# LanguageTool Server on AWS Fargate

[LanguageTool](https://languagetool.org/) is an open source Grammar, Style, and Spell Checker. This repository leverages [AWS Cloud Development Kit (CDK)](https://aws.amazon.com/cdk/) to deploy a highly available LanguageTool server on AWS Fargate for Amazon ECS.

## Usage

Prior to getting started, you will need an AWS account and the AWS CDK installed on your local machine. Next, you will need to configure the `bin/languagetools.ts` file with settings that match your account.

Then to deploy the stack run the following commands:

```bash
# install the dependencies
npm install

# deploy the stack to AWS
cdk deploy
```

## License

This library is licensed under the MIT-0 License. See the [LICENSE file](./LICENSE).
