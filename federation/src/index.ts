import {ApolloGateway} from '@apollo/gateway';
import {ApolloServer} from 'apollo-server';

const portStr = process.env.PORT;
const port = portStr && portStr.match(/^\d+$/) ? parseInt(portStr, 10) : 3000;

const gateway = new ApolloGateway({
  serviceList: [
    {
      name: 'staffs',
      url: `http://${process.env.STAFF_API_HOST}/graphql`,
    },
    {
      name: 'users',
      url: `http://${process.env.USER_API_HOST}/graphql`,
    },
    {
      name: 'inquiries',
      url: `http://${process.env.INQUIRY_API_HOST}/graphql`,
    },
  ],
});

const server = new ApolloServer({
  gateway,
  introspection: true,
});

server.listen({port}).then(({url}) => {
  console.log(`Gateway available at ${url}`);
});
