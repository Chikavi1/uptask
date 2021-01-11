const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// REferencia la modelo donde vamos a autenticar
const Usuarios  = require('../models/Usuarios');


passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email,password,done  ) => {
            try{

                const usuario = await Usuarios.findOne({
                    where: { email,activo: 1 }
                });

                if(!usuario.verificarPassword(password)){
                    return done(null,false,{
                        message: 'contraseña incorrecta'
                    }) 
                }

                return done(null,usuario);
            }catch(error){

                return done(null,false,{
                    message: 'Esa cuenta no existe'
                })
            }
        }
    )
);

passport.use(
    new GoogleStrategy({
    clientID: '166224822320-p5175agfpr9h38lkt7df1h51j7rpt4re.apps.googleusercontent.com',
    clientSecret: 'rvzKG7T8Iu37O5wMv9A-cz8Z',
    callbackURL: 'http://localhost:3000/auth/google/callback'
  },
  async function(accessToken, refreshToken,profile, done) {
    // console.log(profile.id);
    const usuario = await Usuarios.findOne({
          where: { googleId: profile.id }
      });

      if(!usuario){
       const usuarioNuevo = await Usuarios.create({
            email: profile.emails[0].value,
            password: profile.id,
            googleId: profile.id
        });
        return done(null,usuarioNuevo.dataValues);
      }

      return done(null,usuario);

  }
));


//  serializar el usuario
passport.serializeUser((usuario,callback) => {
    callback(null,usuario);
});

// deserializar el usuario 
passport.deserializeUser((usuario,callback) => {
callback(null,usuario);                                                         
});

module.exports = passport;

