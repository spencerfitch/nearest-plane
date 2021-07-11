module.exports = {
    cors: (_req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, accept-language");
        res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE");
        next();
    }
};