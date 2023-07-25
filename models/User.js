var knex = require("../database/connection");
var bcrypt = require("bcrypt");
const PasswordToken = require("./PasswordToken");

//service
class User{

    //listagem de usuários cadastrados
    async findAll(){
      try {
         var result = await knex.select(["id","nome","email"])
           .table("users").orderBy([{ column: 'nome', order: 'desc' }]);
         return result;
        } catch (error) {
            console.log(error);
            return [];
          }
    }

    //Consulta de usuario por id
    async findId(id){
        try {
           var result = await knex.select(["id","nome","email","role"])
           .where({id: id}).table("users");   //.orderBy([{ column: 'id', order: 'desc' }]);

             if (result.length > 0){
              return result[0];
            }else{
                return {undefined};
            }
          } catch (error) {
              console.log(error);
              return undefined;
          }
        }

    async new(email, password, nome){
        try {
            var hash = await bcrypt.hash(password, 10);
            await knex.insert({email,password: hash,nome,role: 0}).table("users");
        } catch (error) {
            console.log(error);
        }
       
       
    }
    async findEmail(email){
        try{
 
            var result = await knex.select()
                         .where({email: email}).table("users");

            if(result.length > 0){
                return result[0];   //Email cadastrado
            }else{
                return undefined;
            }
        }catch(err){
           console.log(err);
           return undefined;
        }
    }

    async update(id,email,nome,role) {
        var user = await this.findId(id);
        
        if(user != undefined){
            
            var editUser = {};

            if(email != undefined){
                if (email != user.email){
                    var result = await this.findEmail(email);
                    if(!result){
                       editUser.email = email; //não achou, email não existe na base de dados
                    }else{
                        return {status: false,err: "O e-mail já está cadastrado"}
                    }

                }
            }

            if(nome != undefined){
                editUser.nome = nome;
            }

            if(role != undefined){
                editUser.role = role;
            }

            try {
                await knex.update(editUser).where({id: id}).table("users");
                return {status: true}               
            }catch(err){
                return {status: false,err: err}
            }
            

        }else{
            return {status: false,err: "O usuário não existe!"}
        }

    }

    async delete(id){
        var user = await this.findId(id);
        if(user != undefined){
            try {
                await knex.delete().where({id: id}).table("Users");
                return {status: true};
            } catch (error) {
                 return {status: false,err: error}
            }
            
        }else{
           return {status:false,err: "Usuário não existe no banco de dados."}
        }
    }

    async mudaSenha(newPassword,id,token){


        var senhaNova = await bcrypt.hash(newPassword, 10)

         try {
            await knex.where({id: id}).update({password: senhaNova}).table("users");
            await PasswordToken.setUsed(token);
            
        } catch (error) {
            console.log(error+"");
        }
         

    }

}
module.exports = new User();