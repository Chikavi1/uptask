const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// REferencia la modelo donde vamos a autenticar
const Usuarios  = require('../models/Usuarios');


passport.use(

    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email,password,done) => {
            try{

                const usuario = await Usuarios.findOne({
                    where: { email:email }
                });

                console.log(usuario);

                if(!usuario.verificarPassword(password)){
                    return done(null,false,{
                        message: 'contraseña incorrecta'
                    }) 
                }

                return done(null,usuario);
            }catch(error){

                console.log(error);
                return done(null,false,{
                    message: 'Esa cuenta no existe'
                })
            }
        }
    )
);

//  serializar el usuario
passport.serializeUser((usuario,callback) => {
    callback(null,usuario);
});

// deserializar el usuario 
passport.deserializeUser((usuario,callback) => {
callback(null,usuario);                                                         
});

module.exports = passport;

