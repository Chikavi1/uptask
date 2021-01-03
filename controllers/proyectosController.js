const Proyectos = require('../models/Proyectos');
const Tareas    = require('../models/Tareas');

exports.proyectosHome  = async(req,res) => {
    const proyectos = await Proyectos.findAll();

    res.render('index',{
        nombrePagina: 'Proyectos',
        proyectos
    });
}

exports.formularioProyecto  = async (req,res) => {
    const proyectos = await Proyectos.findAll();
    res.render('nuevo-proyecto',{
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    });
}

exports.proyectoPorUrl = async (req,res,next) => {
    const proyectosPromise =  Proyectos.findAll();
    const proyectoPromise =  Proyectos.findOne({
        where:{
            url: req.params.url
        }
    });

    const [proyectos,proyecto] = await Promise.all([proyectosPromise,
        proyectoPromise]);

    // consulta
    // console.log(proyecto);

    const tareas = await Tareas.findAll({
        where: {
            proyectoId : proyecto.id
        },
        include: [
            { model: Proyectos }
        ]
    });

    // console.log(tareas);

    if(!proyecto) return next();
    
    res.render('tareas',{
        nombrePagina: 'Tareas del proyecto',
        proyectos,
        proyecto,
        tareas
    })
}

exports.nuevoProyecto = async (req,res) => {
    const proyectos = await Proyectos.findAll();

    const { nombre } = req.body;
    let errores = [];
    if(!nombre){
        errores.push({'texto':'Agrega un nombre al proyecto'})
    }

    if(errores.length > 0){
        res.render('nuevo-proyecto',{
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    }else{
        //insertarq
        // const url = slug(nombre).toLowerCase()
        Proyectos.create({nombre});
       res.redirect('/');
    }

}


exports.formularioEditar  = async (req,res) => {
    const proyectosPromise =  Proyectos.findAll();
    const proyectoPromise =  Proyectos.findOne({
        where:{
            id: req.params.id
        }
    });

    const [proyectos,proyecto] = await Promise.all([proyectosPromise,proyectoPromise])

    res.render('nuevo-proyecto',{
       nombrePagina: 'Editar Proyecto',
       proyectos,
       proyecto

    });
}

exports.actualizarProyecto = async (req,res) => {
    const proyectos = await Proyectos.findAll();

    const { nombre } = req.body;
    let errores = [];
    if(!nombre){
        errores.push({'texto':'Agrega un nombre al proyecto'})
    }

    if(errores.length > 0){
        res.render('nuevo-proyecto',{
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    }else{
       
       await Proyectos.update(
           {nombre: nombre},
           { where: { id: req.params.id }}
           );
       res.redirect('/');
    }

}

exports.eliminarProyecto = async (req,res,next)  => {
     const { url } = req.params;
    
    const resultado = await Proyectos.destroy({where: {url: url}});
    if(!resultado){
        return next();
    }
    res.status(200).send('Proyecto eliminado correctamente');
}