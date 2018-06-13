const express = require('express');
const next = require('next');
const lg = require('minilog')('server');
const expressGraphQL = require('express-graphql');
const makeExecutableSchema = require('graphql-tools').makeExecutableSchema;
const formatApolloError  = require('apollo-errors').formatError;

const resolvers = require('./models/resolvers');
const typeDefs = require('./models/schema.js');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

require('minilog').enable();

function formatError(error) {
    lg.error(error);
    return formatApolloError(error);
}

const schema = makeExecutableSchema({typeDefs, resolvers});
const graphqlMiddleware = expressGraphQL(req => ({
    formatError,
    schema,
    context: {req},
    graphiql: dev,
    rootValue: {request: req},
    pretty: dev,
}));

app.prepare()
    .then(() => {
        const server = express();
        server.use('/graphql', graphqlMiddleware);

        server.get('*', (req, res) => {
            return handle(req, res);
        });

        server.listen(3000, (err) => {
            if (err) throw err;
            lg.info('> Ready on http://localhost:3000');
        });
    })
    .catch((ex) => {
        lg.error(ex);
        process.exit(1);
    });

