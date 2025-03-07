const {verify} = require('jsonwebtoken');

const validateToken = (req, res, next) => {
    const accessToken = req.header("accessToken");

    if (!accessToken) {
        return res.json({ error: "You aren't logged in" });
    } else {
        try {
            const validToken = verify(accessToken, "importantsecret");
            if (validToken) {
                req.user = validToken;
                return next();
            }
        } catch (err) {
            return res.json({ error: err });
        }
    }
}

module.exports = {validateToken}