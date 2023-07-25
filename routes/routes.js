var express = require("express")
var app = express();
var router = express.Router();
var HomeController = require("../controllers/HomeController");
var UserController = require("../controllers/UserController");

var AdminAuth = require("../middleware/adminAuth");

router.get('/', HomeController.index);//rota de consulta é method get  
router.post('/user', UserController.create);//rota de cadastro de usuario é method post
router.get('/user',AdminAuth,UserController.index);  //rota de pesquisa de usuarios
router.get('/user/:id', UserController.findUser);  //rota de pesquisa de usuarios
router.put('/user', UserController.edit); //rota para alterar um usuario
router.delete('/user/:id', UserController.remove); //rota para deletar um usuario
router.post('/recoverpassword', UserController.recoverPassword); 
router.post('/mudasenha', UserController.mudaSenha);
router.post('/login', UserController.login);

module.exports = router;