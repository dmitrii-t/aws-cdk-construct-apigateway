### Neat 'n' sweet :lollipop: AWS ApiGateway builder
 
Use the builder to make Lambda handler to serve HTTP requests or to create HTTP proxy 
for server-based backend. Set CORS policy and usage plans and more.

Run tests with the following command 

```bash
npm run test
```

Use the builder to define the resource and a handler for that resource

```typescript
new ApiGatewayBuilder(this, {id: 'ApiGateway'})
    .resource('/orders')
    .addCors({allowOrigins: ['*'], allowMethods: ['GET']})
    .respondOk('GET');
```
