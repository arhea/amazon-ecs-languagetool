#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { AmazonEcsLanguagetoolsStack } from '../lib/amazon-ecs-languagetools-stack';

const app = new cdk.App();
new AmazonEcsLanguagetoolsStack(app, 'AmazonEcsLanguagetoolsStack');
