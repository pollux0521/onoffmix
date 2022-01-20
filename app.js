// [ Require Modules ]
const express       = require('express');
const session       = require('express-session');
const MySQLStore    = require('express-mysql-session')(session);

const bodyParser    = require('body-parser');
const app           = express();

const Port          = 3001;

const mainRoute     = require('./routes/main.js');
const classRoute    = require('./routes/class.js');
const mypageRoute   = require('./routes/mypage.js');
const senddataRoute = require('./routes/senddata.js');  
const conn          = require('./modules/conndb.js');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static("src"));

app.set('views', __dirname+'/src/html');


// [ Use Session ]
const MySQLOption = {
    host : 'localhost',
    port : '3306',
    user : 'root',
    password : 'root',
    database : 'onoffmix'
};

const sessionStore = new MySQLStore(MySQLOption);
app.use(
    session({
        key:"session_cookie_name",
        secret:"session_cookie_secret",
        store: sessionStore,
        resave:true,
        saveUninitialized:true
    })
);

// [ Route ]
app.use('/', mainRoute);
app.use('/class', classRoute);
app.use('/mypage', mypageRoute);
app.use('/senddata', senddataRoute);


// [ Open Server ]
app.listen(Port, (req, res)=> console.log("open"));