const passport = require('passport');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

// esto se puede borrar no es necesario
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Usuarios = require('../models/Usuarios');

exports.autenticarUsuario = passport.authenticate('local',{

    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios.'
});


//  funcion para revisar si el usuario esta logueada
exports.usuarioAutenticado = (req,res,next) => {
    // si el usuario esta autenticado, adelante
    if(req.isAuthenticated()){
        return next();
    }


    // si no esta autentificado, redirigir al formulario
    return res.redirect('/iniciar-sesion');
}

// funcion para cerrar sesion

exports.cerrarSesion = (req,res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion');
    })
}


exports.googleauth = passport.authenticate('google',{
    scope: ['profile', 'email'],
   
});


exports.googleCallback = passport.authenticate('google', {

    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true
});



exports.formRestablecerPassword = (req,res) => {
    res.render('reestablecer',{
        nombrePagina: "reestablecer tu contraseña"
    })
}


// genera un token si el usuaio es valido
exports.enviarToken = async (req,res) => {
    const { email } = req.body;
    const usuario = await Usuarios.findOne({ where: { email  }});

    if(!usuario){
        req.flash('error','no existe esa cuenta');
        res.redirect('/reestablecer');
    }

// falta verificar que no sea de google papi eso es aqui

    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000;

   await usuario.save();
   
   const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;
   console.log(resetUrl);

}


exports.validarToken = async(req,res) => {
   const usuario = await Usuarios.findOne({
    where: {
        token: req.params.token
    }
   });
if(!usuario){
    req.flash('error','No valido');
    res.redirect('/reestablecer');
}
res.render('resetPassword',{
    nombrePagina: 'Reestablecer contraseña'
})


console.log(usuario);

}

exports.actualizarPassword = async (req,res) => {
    console.log(req.params.token);

    const usuario = await Usuarios.findOne({ 
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte] : Date.now()
            }
        } 
    });

    if(!usuario){
        req.flash('error','no válido');
        res.redirect('/reestablecer');
    }

    usuario.password = bcrypt.hashSync(req.body.password,bcrypt.genSaltSync(10));
    usuario.token = null;
    usuario.expiracion = null;
    await usuario.save();
    req.flash('correcto','Tu password se ha modificado correctamente');
    res.redirect('/iniciar-sesion');
}