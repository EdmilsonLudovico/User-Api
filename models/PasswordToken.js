var knex = require("../database/connection");
var User = require("./User");

class PasswordToken {
    async create(email){
        //var user = await User.findEmail(email);  

        var user = await knex.select()
                    .where({email: email}).table("users");

        console.log(email);
        console.log(user[0].email);
        //if (user != undefined){
        if(user[0].email == email){
            try {
                var token = Date.now();
                console.log(token);
                console.log(user[0].id);

                await knex.insert({
                    user_id: user[0].id,
                    used: 0,
                    token: token
                }).table("passwordtoken");
                return {status: true, token: token}
            } catch (error) {    
                return {status: false, err: error}
            }
        }else{
            return {status: false, err: "O e-mail passado não existe no banco!"}
        }
         
    } 
    
    async validate(token){
        //result =  await knex.raw("select * from passwordtoken token = "+"1690200251555").then(data => {
        //    console.log(data.token);
        //    console.log("=========================================");
        //});

        console.log(token);
        console.log("=========================================");

         
        try { 
            //var result =  await knex.raw("SELECT * FROM passwordtoken where token = ?",token)
          
            var result =  await knex.select().where({token: token}).table("passwordtoken");
          
            //console.log(result[0]);

            if(result.length > 0){

                 var tk = result[0];   
                         
             
              if (tk.used){
                
                 return {status: false};   
              }else{
                //console.log(tk);
                return {status: true, token: tk};
              }
            }else{
                return false;
        }
        } catch (error) {
            console.log(error+"");
            return {status: false};
        }
        
    
    }
    async setUsed(token){
        await knex.update({used: 1}).where({token: token}).table("passwordtoken");
    }

}

module.exports = new PasswordToken();