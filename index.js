const express = require('express');
const routes  = require('./routes');
const path    = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

//helpers con algunas funciones
const helpers = require('./helpers');

// crear conexion a la BD
const db = require('./config/db');


require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');
db.sync()
    .then(()=>{
        console.log('conectado al server');
    }).catch(error => console.log(error));
const app = express();
app.use(bodyParser.urlencoded({extended: true}))

// agregamos express validator a toda la app
app.use(expressValidator());

// cargar archivos estaticos
app.use(express.static('public'));

// habilitar pug
app.set('view engine','pug');

//añadir carperta vista
app.set('views', path.join(__dirname,'./views'));

//agregar flash messages
app.use(flash());

app.use(cookieParser());
//sessiones  nos permite navegar entre distintas paginas sin volvernos autenticar
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//pasar var dunmpo a la app
app.use((req,res,next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    next();
});

// habilitar bodyParser para leer datos del formulario
app.use('/',routes());



app.listen(3000);