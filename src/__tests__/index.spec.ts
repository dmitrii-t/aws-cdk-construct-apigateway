// Integration test
import {ApiGatewayConstruct} from '../index';
import {App, CfnOutput, Stack} from '@aws-cdk/core';
import {deployStack, destroyStack, withStack} from 'cdk-util';
import fetch from 'node-fetch';
import {expect} from 'chai';
import * as path from 'path';
import {Code, Runtime} from "@aws-cdk/aws-lambda";

/**
 * CDK output directory
 */
const CdkOut = path.resolve('cdk.out');

const lambdaProps = {
  handler: 'lambda.handleApiGatewayEvent',
  runtime: Runtime.NODEJS_10_X,
  code: Code.fromAsset('./dist'),
};

describe('given cdk stack which creates two resources with nested paths and Ok(200) handlers', () => {
  /**
   * Stack to deploy the construct for tests
   */
  class ApiGatewayTest extends Stack {
    constructor(scope: App, id: string) {
      super(scope, id);

      const producingConstruct = new ApiGatewayConstruct(this, {id: 'ApiGatewayTest'});

      // Child resource one
      producingConstruct.resource('/test/child/one')
        // .addCors({allowOrigins: ['*'], allowMethods: ['GET']})
        .respondOk('GET');

      // Child resource two
      producingConstruct.resource('/test/child/two')
        // .addCors({allowOrigins: ['*'], allowMethods: ['GET']})
        .proxyLambda('GET',  lambdaProps);

      // Outputs
      new CfnOutput(this, 'ResourceOneUrl', {value: producingConstruct.resourceUrl('/test/child/one')});
      new CfnOutput(this, 'ResourceTwoUrl', {value: producingConstruct.resourceUrl('/test/child/two')});
      new CfnOutput(this, 'ResourceTwoHandlerName', {value: producingConstruct.resource('/test/child/two').handlerName});
    }
  }

  const id = 'ApiGatewayTest';
  const app = new App({outdir: CdkOut});
  const stack = new ApiGatewayTest(app, id);

  // Setup task
  before(async () => {
    await deployStack({name: id, app, exclusively: true});
  });

  // Cleanup task
  after(async () => {
    await destroyStack({name: id, app, exclusively: true});
  });

  it('should get response 200 from apigateway for both resources', withStack({name: id, app, exclusively: true}, async ({environment, stack}) => {
    // Given
    const resourceOneUrl = stack.Outputs!!.find(it => it.OutputKey === 'ResourceOneUrl')!!.OutputValue;
    const resourceTwoUrl = stack.Outputs!!.find(it => it.OutputKey === 'ResourceTwoUrl')!!.OutputValue;
    const resourceTwoHandlerName = stack.Outputs!!.find(it => it.OutputKey === 'ResourceTwoHandlerName')!!.OutputValue;

    // Then
    const responseOne = await fetch(resourceOneUrl!!);
    expect(responseOne.status).to.equal(200);

    const responseTwo = await fetch(resourceTwoUrl!!);
    expect(responseTwo.status).to.equal(200);

    expect(resourceTwoHandlerName).to.exist
  }));
});

