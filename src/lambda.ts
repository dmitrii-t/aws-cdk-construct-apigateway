import {APIGatewayEvent, APIGatewayProxyResult} from 'aws-lambda';
import {Body} from "./Body";

export async function handleApiGatewayEvent(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
  console.log(`Handled ApiGateway Event ${JSON.stringify(event)}`);

  try {
    const body = JSON.parse(event.body);
    return await handleBody(body);

  } catch (e) {
    console.error(`Fail to process a body of ApiGateway event ${event.body}`, e);
  }
}

async function handleBody(body: Body): Promise<APIGatewayProxyResult> {
  console.log(`processing message body ${JSON.stringify(body)}`);
  //TODO extension point

  return {
    statusCode: 200
  } as APIGatewayProxyResult
}
