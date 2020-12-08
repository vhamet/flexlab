const { ApolloServer } = require('apollo-server');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const { sequelize } = require('./models');

require('dotenv').config();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);

  sequelize
    .authenticate()
    .then(() => console.log('connected to db !'))
    .catch((err) => console.log('Connection to database failed', err));
});
