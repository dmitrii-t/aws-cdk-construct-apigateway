### Neat'n'sweet AWS ApiGateway construct
 
Use the construct to create a Lambda handler to serve HTTP requests or
to create HTTP proxy for server-based backend. Set CORS policy, usage
plans and more.

Run tests with the following command 

```bash
npm run clean && npm run build && npm run test
```

Use the construct to define the resource and a handler for that resource

```typescript
new ApiGatewayBuilder(this, {id: 'ApiGateway'})
    .resource('/orders')
    .addCors({allowOrigins: ['*'], allowMethods: ['GET']})
    .respondOk('GET');
```
