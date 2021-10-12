import {ApolloServer} from 'apollo-server';
import {ApolloGateway} from '@apollo/gateway';
require('dotenv').config();

const port = 3000;

const gateway = new ApolloGateway({
  serviceList: [
    {
      name: 'staffs',
      url: `http://${process.env.STAFF_API_HOST}:3000/graphql`,
    },
    {name: 'users', url: `http://${process.env.USER_API_HOST}:3000/graphql`},
    {
      name: 'inquiries',
      url: `http://${process.env.INQUIRY_API_HOST}:3000/graphql`,
    },
  ],
});

const server = new ApolloServer({
  gateway,
  // subscriptions: false,
  introspection: true,
  // playground: true,
});

server.listen({port}).then(({url}) => {
  console.log(`Gateway available at ${url}`);
});
