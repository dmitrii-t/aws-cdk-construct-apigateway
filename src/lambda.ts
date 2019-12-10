import {APIGatewayEvent, APIGatewayProxyResult} from 'aws-lambda';
import {Body} from "./Body";

export function withApiGatewayEventHandler(bodyHandler: (body: Body) => void) {
  return async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    console.log(`Handled ApiGateway Event ${JSON.stringify(event)}`);

    try {
      const body = JSON.parse(event.body);
      await bodyHandler(body);

      return {
        statusCode: 200
      } as APIGatewayProxyResult

    } catch (e) {
      console.error(`Fail to process a body of ApiGateway event ${event.body}`, e);
    }
  }
}

export const handleApiGatewayEvent = withApiGatewayEventHandler((body) => {
  console.log(`processing message body ${JSON.stringify(body)}`);
});
