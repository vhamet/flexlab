const { ApolloServer } = require('apollo-server');
const jwt = require('jsonwebtoken');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const { sequelize } = require('./models');

require('dotenv').config();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async (context) => {
    const authHeader = context.req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        console.log(err);
      }

      context.user = user;
    });

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
