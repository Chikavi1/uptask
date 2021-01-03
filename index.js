const express = require('express');
const routes  = require('./routes');
const path    = require('path');
const bodyParser = require('body-parser');

//helpers con algunas funciones
const helpers = require('./helpers');

// crear conexion a la BD
const db = require('./config/db');


require('./models/Proyectos');
require('./models/Tareas');
db.sync()
    .then(()=>{
        console.log('conectado al server');
    }).catch(error => console.log(error));
const app = express();

// cargar archivos estaticos
app.use(express.static('public'));

// habilitar pug
app.set('view engine','pug');

//añadir carperta vista
app.set('views', path.join(__dirname,'./views'));

//pasar var dunmpo a la app
app.use((req,res,next) => {
    res.locals.vardump = helpers.vardump;
    next();
});

// habilitar bodyParser para leer datos del formulario
app.use(bodyParser.urlencoded({extended: true}))
app.use('/',routes());



app.listen(3000);