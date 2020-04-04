#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkTemplatesAndSnippetsStack } from '../lib/cdk-templates-and-snippets-stack';

const app = new cdk.App();
new CdkTemplatesAndSnippetsStack(app, 'CdkTemplatesAndSnippetsStack');
