
module.exports = async function auth(req, res, next) {
    let error = { message: 'Access denied', statusCode: 401 };
    const user = req.user;
    try {
        if (!user) throw new Error();
        error = { message: 'not Admin', statusCode: 401 };
        if (user.admin)
            next();
        else
            throw new Error();
    } catch (ex) {
        return { error }
    }
}