"use strict";

import userDAO from "../dao/userDAO.mjs";

const userController = {
    findAll: async () => {
        return await userDAO.findAll();
    },
    add: async (user) => {
        return await userDAO.add(user);
    },
    login: async (userInfo) => {
        return await userDAO.login(userInfo);
    },
    findUserByEmail: async (email) => {
        return await userDAO.findByEmail(email);
    },
    update: async (user) => {
        return await userDAO.update(user);
    },
    removeByEmail: async (email) => {
        return await userDAO.removeByEmail(email);
    }
}

export default userController