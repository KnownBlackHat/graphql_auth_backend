import express from 'express';
import { expressMiddleware } from '@apollo/server/express4';
import createApolloGraphqlServer from './graphql';
import UserService from './services/user';

async function init() {
    const app = express();
    const port = Number(process.env.PORT) || 8000;

    app.use(express.json());
    app.use('/graphql', expressMiddleware(await createApolloGraphqlServer(), {
        context: async ({req}) => {
            // @ts-ignore
            const token = req.headers['token']
            try {
                const user = UserService.decodeJWTToken(token as string);
                return { user };
            } catch (error) {
                return {};
            }
        }
    }));

    app.get('/', (_, res) => {
        res.json({
            message: 'Server is up and runnning'
        })
    });


    app.listen(port, () => console.log(`Server started at ${port}`));
}

init();
