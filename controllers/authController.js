const passport = require('passport');

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