import {ApolloGateway, IntrospectAndCompose} from '@apollo/gateway';
import {ApolloServer} from 'apollo-server';

const port = 3000;

const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      {
        name: 'staffs',
        url: `http://${process.env.STAFF_HOST}/graphql`,
      },
      {
        name: 'users',
        url: `http://${process.env.USER_HOST}/graphql`,
      },
      {
        name: 'inquiries',
        url: `http://${process.env.INQUIRY_HOST}/graphql`,
      },
    ],
  }),
});

const server = new ApolloServer({
  gateway,
});

server.listen({port}).then(({url}) => {
  console.log(`Gateway available at ${url}`);
});
