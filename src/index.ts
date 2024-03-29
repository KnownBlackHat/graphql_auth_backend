import express from 'express';
import { expressMiddleware } from '@apollo/server/express4';
import createApolloGraphqlServer from './graphql';

async function init() {
    const app = express();
    const port = Number(process.env.PORT) || 8000;

    app.use(express.json());
    app.use('/graphql', expressMiddleware(await createApolloGraphqlServer()));


    app.get('/', (_, res) => {
        res.json({
            message: 'Server is up and runnning'
        })
    });


    app.listen(port, () => console.log(`Server started at ${port}`));
}

init();
