import * as path from 'path';
import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ecrAssets from '@aws-cdk/aws-ecr-assets';
import * as ecsPatterns from '@aws-cdk/aws-ecs-patterns';
import * as route53 from '@aws-cdk/aws-route53';
import * as certmgr from '@aws-cdk/aws-certificatemanager';
import * as elasticache from '@aws-cdk/aws-elasticache';

export interface LanguagetoolsStackProps extends cdk.StackProps {
  domainName: string;
  hostedZoneId: string;
  hostedZoneName: string;
}

export class LanguagetoolsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: LanguagetoolsStackProps) {
    super(scope, id, props);

    const domainName = props.domainName;
    const hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
      hostedZoneId: props.hostedZoneId,
      zoneName: props.hostedZoneName
    });

    const vpc = new ec2.Vpc(this, 'VPC', {
      maxAzs: 3
    });

    const cluster = new ecs.Cluster(this, 'Cluster', {
      vpc
    });

    const dockerImage = new ecrAssets.DockerImageAsset(this, 'DockerImage', {
      directory: path.join(__dirname, '../', 'languagetools')
    });

    const certificate = new certmgr.DnsValidatedCertificate(this, 'Certificate', {
      hostedZone,
      domainName
    });

    const redisSecurityGroup = new ec2.SecurityGroup(this, 'RedisSecurityGroup', {
      vpc,
      allowAllOutbound: true
    });

    redisSecurityGroup.addIngressRule(ec2.Peer.ipv4(vpc.vpcCidrBlock), ec2.Port.tcp(6379))

    const subnetGroup = new elasticache.CfnSubnetGroup(this, "RedisSubnetGroup", {
      cacheSubnetGroupName: "redis-languagetool",
      subnetIds: vpc.privateSubnets.map(item => item.subnetId),
      description: 'group of private subnets for the redis cluster'
    });

    const redis = new elasticache.CfnCacheCluster(this, `RedisCluster`, {
      engine: "redis",
      cacheNodeType: "cache.t3.medium",
      numCacheNodes: 1,
      clusterName: "redis-languagetool",
      vpcSecurityGroupIds: [redisSecurityGroup.securityGroupId],
      cacheSubnetGroupName: subnetGroup.cacheSubnetGroupName
    });

    redis.addDependsOn(subnetGroup);

    const languageTools = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'Service', {
      cluster,
      certificate,
      domainName,
      domainZone: hostedZone,
      cpu: 1024,
      memoryLimitMiB: 2048,
      desiredCount: 2,
      platformVersion: ecs.FargatePlatformVersion.VERSION1_4,
      taskImageOptions: {
        image: ecs.ContainerImage.fromDockerImageAsset(dockerImage),
        containerPort: 8080,
        environment: {
          JAVA_MEMORY_LIMIT: '2048M',
          REDIS_HOST: `${redis.attrRedisEndpointAddress}:${redis.attrRedisEndpointPort}`
        }
      },
    });

    const languageToolsTarget = languageTools.service.autoScaleTaskCount({
      minCapacity: 2,
      maxCapacity: 10
    });

    languageToolsTarget.scaleOnCpuUtilization('ScaleOnCPUUtilization', {
      targetUtilizationPercent: 0.6
    });

    languageTools.targetGroup.configureHealthCheck({
      path: "/v2/languages",
    });

  }
}
