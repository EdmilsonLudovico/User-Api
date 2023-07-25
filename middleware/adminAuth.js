const { compare } = require("bcrypt");
var jwt = require("jsonwebtoken");

var secret = "fjassfyvbxjv65673jkdjdbc";


module.exports = function(req, res, next){
    const autoToken = req.headers['authoziration'];

    if(autoToken != undefined){
        const bearer = autoToken.split(' ');
        var token = bearer[1];

        var decoded = jwt.verify(token, secret);

        console.log(decoded);
        next();

        res.status(200);
    }else{
        res.status(403);
        res.send("Você não esta autenticado!");
        return;
    }
}