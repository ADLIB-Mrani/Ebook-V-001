const users = new Map();
const authUsers = new Map();

const saveUser = (user) => {
    users.set(user.userId, user);
    return user;
};

const getUserById = (userId) => users.get(userId) || null;

const saveAuthUser = (user) => {
    authUsers.set(user.email, user);
    return user;
};

const getAuthUserByEmail = (email) => authUsers.get(email) || null;

module.exports = {
    saveUser,
    getUserById,
    saveAuthUser,
    getAuthUserByEmail
};
