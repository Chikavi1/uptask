const Usuarios = require('../models/Usuarios');

exports.formCrearCuenta = (req,res) => {
    res.render('crearCuenta',{
        nombrePagina: 'Crear cuenta en upTask'
    })
}


exports.crearCuenta = async (req,res) => {

    //leer datos
    const { email,password } = req.body;
    try{
        await Usuarios.create({
            email,
            password
        });
        res.redirect('/iniciar-sesion')

    }catch(error){
        req.flash('error', error.errors.map(error => error.message) );
        res.render('crearCuenta',{
            mensajes: req.flash(),
            nombrePagina: 'Crear cuenta en uptask',
            email,
            password
        })
    }

    
     //crear usuario
    // res.send('Enviaste el form');
}