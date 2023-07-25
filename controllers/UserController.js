var User = require("../models/User");
var PasswordToken = require("../models/PasswordToken");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");


var secret = "fjassfyvbxjv65673jkdjdbc";


const nodemailer = require("nodemailer");
const { use } = require("../routes/routes");

class UserController{
    async index(req, res){
        var users = await User.findAll();
        res.json(users);
    }
    
    async findUser(req, res){
        var id =req.params.id;
        var user = await User.findId(id);
        if(user == undefined){
            res.status(404);  // recuso não encontrado
            res.json({});
        }else{
            res.status(200);  //ok
            res.json(user);
        }
    }

    async create(req, res){

        var {email, nome, password } = req.body;

        if(email == undefined){
            res.status(400);
            res.json({erro: "Email Invalido"});
            return;
        }
        var emailExists = await User.findEmail(email);

        if(emailExists){
            res.status(406);
            res.json({err: "O e-mail já esta cadastado!"});
            return;
        } 

        try {
          await User.new(email,password,nome);
          res.status(200);
          res.send("Tudo ok!");
        } catch (error) {
            console.log(error);
        };


    }

    async edit(req, res){
        var {id, nome, role, email} = req.body;

        var result = await User.update(id,email,nome,role);

        if(result != undefined){
            if(result.status){
                res.status(200);
                res.send("Tudo Ok!")
            }else{
                res.status(406);
                //res.json(result);
                res.send(result.err);
            }
        }else{
            res.status(406);
            res.send("Ocorreu um erro no servidor!");
        }
    }

    async remove(req, res){
        var id = req.params.id;
        var result = await User.delete(id);

        if(result.status){
            res.status(200);
            res.send("tudo ok");
        }else{
            res.status(406);
            res.send(result.err)
        }
    }

    async recoverPassword(req, res){
        var email = req.body.email;
        var result = await PasswordToken.create(email);

        if(result.status){
            res.status(200);
            res.send("" + result.token);
            //nodeMaler.send() enviar um email para user c/token
        }else{
            res.status(406);
            res.send(""+ result.err); //result.err
        }
    }


    async mudaSenha(req, res){
        var token = req.body.token;
        var password = req.body.password;

        var isTokenValid = await PasswordToken.validate(token);

        //console.log(isTokenValid.status+"Aqui");

        if(isTokenValid.status){
            await User.mudaSenha(password,isTokenValid.token.user_id,isTokenValid.token.token);

            res.status(200);
            res.send("senha alterada!");
        }else{
            res.status(406);
            res.send("Token invalido!")
        }

    }

    async login(req, res) {
        var {email, password} = req.body;

        var user = await User.findEmail(email);
        if(user != undefined){
          var resultado = await bcrypt.compare(password,user.password);

          if(resultado){
            var token = jwt.sign({ email: user.email, role: user.role }, secret);
            res.status(200);
            res.json({token: token});
          }else{
            res.json("Senha incorreta!");
            res.status(406);
          }
        }else{
            res.send("Email não existe!");
            //res.json({status: false});
        }



    }


    async main() {

        const transporter =  nodemailer.createTransport({
            host: "smtp.example.com",
            port: 587,
            secure: false, // upgrade later with STARTTLS
            auth: {
              user: "username",
              pass: "password",
            },
          });

        // send mail with defined transport object
        const info = await transporter.sendMail({
          from: '"Fred Foo 👻" <foo@example.com>', // sender address
          to: "bar@example.com, baz@example.com", // list of receivers
          subject: "Hello ✔", // Subject line
          text: "Hello world?", // plain text body
          html: "<b>Hello world?</b>", // html body
        });
    }

   
}

module.exports = new UserController();