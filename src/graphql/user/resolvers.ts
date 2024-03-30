import UserService, { CreateUserPayload } from "../../services/user";

const queries = {
    getUserToken: async(_:any, payload: { email: string, password: string }) => {
        const token = await UserService.generateToken({
            email: payload.email,
            password: payload.password
        })
        return token;
    },
    getCurrentLoggedInUser: async(_:any, param:any, context: any) => {
        if (context && context.user) {
            const user = await UserService.getUserById(context.user.id);
            return user;
        }
        throw new Error('We have no info about who are you!');
    }
};

const mutations = {
    createUser: async(_: any, payload: CreateUserPayload) => {
        const res = await UserService.createUser(payload);
        return res.id;
    }
}

export const resolvers = { queries, mutations }
