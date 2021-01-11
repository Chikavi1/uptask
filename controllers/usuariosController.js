const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

exports.formCrearCuenta = (req,res) => {
    res.render('crearCuenta',{
        nombrePagina: 'Crear cuenta en upTask'
    })
}

exports.formIniciarSesion = (req,res) => {
    const { error } = res.locals.mensajes;
    res.render('iniciarSesion',{
        nombrePagina: 'Iniciar Sesión en upTask',
        error
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

        // crear una url de confirmar
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

        //crear el objeto de usuario
        const usuario = {
            email
        }

        //enviar email
        await enviarEmail.enviar({
            usuario,
            subject: 'Confitma tu cuenta upTask',
            confirmarUrl,
            archivo: 'confirmar-cuenta'
        });

        // redigir al usuario
        req.flash('correcto','Enviamos un correo,confirma tu cuenta');
        res.redirect('/iniciar-sesion');



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

