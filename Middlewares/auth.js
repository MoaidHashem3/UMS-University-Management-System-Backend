var jwt = module.require('jsonwebtoken');
let { promisify } = module.require("util")
async function auth(req, res, next) {
    let { authorization } = req.headers
    if (!authorization) {
        return res.json({ message: "you must login" })
    }
    try {
        let decoded = await promisify(jwt.verify)(authorization, process.env.secret)
        console.log(decoded)
        req.id = decoded.data.id
        req.role = decoded.data.role
        next();
    }
    catch (err) {
        res.json({ message: err.message })
    }

}
function restrict(...roles) {
    return (req, res, next) => {
        if (!roles.includes(req.role)) {
            return res.json({ message: "can not access this role or operation" })
        }
        next();
    }
}

module.exports = { auth, restrict }