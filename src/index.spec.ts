// Integration test
import {ApiGatewayBuilder} from './index';
import {App, CfnOutput, Stack} from '@aws-cdk/core';
import {deployStack, destroyStack, withStack} from 'cdk-util';
import fetch from 'node-fetch';
import {expect} from 'chai';
import * as path from 'path';

/**
 * CDK output directory
 */
const CdkOut = path.resolve('cdk.out');

describe('given cdk stack which creates two resources with nested paths and Ok(200) handlers', () => {
  /**
   * Stack to deploy the construct for tests
   */
  class ApiGatewayTest extends Stack {
    constructor(scope: App, id: string = ApiGatewayTest.name) {
      super(scope, id);

      const producingConstruct = new ApiGatewayBuilder(this, {id: 'ApiGatewayTest'});

      // Child resource one
      producingConstruct.resource('/test/child/one')
        // .addCors({allowOrigins: ['*'], allowMethods: ['GET']})
        .respondOk('GET');

      // Child resource two
      producingConstruct.resource('/test/child/two')
        // .addCors({allowOrigins: ['*'], allowMethods: ['GET']})
        .respondOk('GET');

      // Outputs
      new CfnOutput(this, 'ResourceOneUrl', {value: producingConstruct.resourceUrl('/test/child/one')});
      new CfnOutput(this, 'ResourceTwoUrl', {value: producingConstruct.resourceUrl('/test/child/two')});
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

    // Then
    const responseOne = await fetch(resourceOneUrl!!);
    expect(responseOne.status).to.equal(200);

    const responseTwo = await fetch(resourceTwoUrl!!);
    expect(responseTwo.status).to.equal(200);
  }));
});

