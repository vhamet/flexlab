const { ApolloServer, PubSub } = require('apollo-server');
const jwt = require('jsonwebtoken');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const { sequelize } = require('./models');

require('dotenv').config();

const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async (context) => {
    let token;
    if (context.req && context.req.headers.authorization) {
      const authHeader = context.req.headers.authorization;
      token = authHeader && authHeader.split(' ')[1];
    } else if (context.connection && context.connection.context.Authorization) {
      const authConnection = context.connection.context;
      token = authConnection && authConnection.Authorization.split(' ')[1];
    }

    if (token) {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
          console.log(err);
        }

        context.user = user;
      });
    }
    context.pubsub = pubsub;

    return context;
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);

  sequelize
    .authenticate()
    .then(() => console.log('connected to db !'))
    .catch((err) => console.log('Connection to database failed', err));
});
