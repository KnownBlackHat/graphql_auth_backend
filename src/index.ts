import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { prismaClient } from './lib/db';

async function init() {
    const app = express();
    const port = Number(process.env.PORT) || 8000;

    const gqlserver = new ApolloServer({
        typeDefs: `
        type Query{
            hello: String
            say(name: String): String
        }

        type Mutation{
            createUser(firstName: String!, lastName: String!, email: String!, password: String!): Boolean
        }
        `,
        resolvers: {
            Query: {
                hello: () => `Hello world!`,
                    say: (_, {name}: {name: String}) => `Hello ${name}`
            },

            Mutation: {
                createUser: async(_, { firstName, lastName, email, password }:
                                  { firstName: string, lastName: string, email: string, password: string}) => {

                    await prismaClient.user.create({
                        data: {email, firstName, lastName, password, salt: 'random_salt'}
                    });
                    return true;
                }}
        }
    });

    await gqlserver.start();

    app.use(express.json());
    app.use('/graphql', expressMiddleware(gqlserver));


    app.get('/', (req, res) => {
        res.json({
            message: 'Server is up and runnning'
        })
    });


    app.listen(port, () => console.log(`Server started at ${port}`));
}

init();
