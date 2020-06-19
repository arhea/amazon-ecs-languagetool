#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { LanguagetoolsStack } from '../lib/languagetools-stack';

const app = new cdk.App();

new LanguagetoolsStack(app, 'LanguageTools', {
  domainName: 'languagetool.arhea.io',
  hostedZoneId: 'ZQTWE55QZLND0',
  hostedZoneName: 'arhea.io'
});
