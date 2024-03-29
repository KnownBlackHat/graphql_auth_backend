import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

async function init() {
    const app = express();
    const port = Number(process.env.PORT) || 8000;

    const gqlserver = new ApolloServer({
        typeDefs: `
        type Query{
            hello: String
            say(name: String): String
        }
        `,
        resolvers: {
            Query: {
                hello: () => `Hello world!`,
                say: (_, {name}: {name: String}) => `Hello ${name}`
            }
        },
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
