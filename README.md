### Neat'n'sweet AWS ApiGateway construct
 
Use the construct to create a Lambda handler to serve HTTP requests or
to create HTTP proxy for server-based backend. Set CORS policy, usage
plans and more.

Install the project locally

```bash
git clone https://github.com/theotherdmitrii/aws-cdk-construct-apigateway.git
npm install
```

Build the construct and lambda handler

```bash
npm run build
```

Create local .env file with AWS credentials for your deployment account
```bash
cat > .env.json <<EOF
{
    "AWS_ACCESS_KEY_ID": "<provide your access key id>",
    "AWS_SECRET_ACCESS_KEY": "<privide your scret key>",
    "AWS_DEFAULT_REGION": "<specify default region to deploy>"
}
EOF
```

Test the construct
```bash
npm run test
```

Use the construct to define the resource and a handler for that resource

```typescript
new ApiGatewayBuilder(this, {id: 'ApiGateway'})
    .resource('/orders')
    .addCors({allowOrigins: ['*'], allowMethods: ['GET']})
    .respondOk('GET');
```
