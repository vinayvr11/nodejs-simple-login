var express = require('express');
var cookieParser = require('cookie-parser');
var path = require('path');
var app = express();
let UserReg = require('./userRegister')
app.use((req, res,next)=>{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Header", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
    next();
})
const mongoose = require('mongoose');


const cors = require('cors');

const bcrypt = require('bcryptjs');
//Paytm params call
const https = require('https');



app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//app.use(compress); //This line will compress all the static file before sending to the server

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
const fs = require('fs');


//app.use(passport.initialize());
//app.use(passport.session());



mongoose.connect("mongodb://localhost:27017/testProject", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if (err) throw err;
    console.log('Your are connected to mongoose database');
});

mongoose.set("useCreateIndex", true);

app.use(cors());
app.options('*', cors());



let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}
app.listen(port);


app.put('/user/login', async (req, res, next) => {
    let contact = req.body.contact
    let password = req.body.password

    let user = await UserReg.findOne({contact: contact}).exec()
    if (!user) {
        return res.json({
            message: "You are not registered please signup"
        })
    } else {
        bcrypt.compare(password, user.password, (err, result) => {
            if (result) {
                return res.status(200).json({
                    message: "Password matched"
                })
            } else {
                return res.json({
                    message: "Password not matched"
                })
            }
        })
    } 
})

app.post('/user/signup', async (req, res, next) => {
    let contact = req.body.contact
    let name = req.body.name
    let password = req.body.password
    let saltRounds = 10;
    bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            let userModel = {
                name: name,
                contact: contact,
                password: hash
            }
            let savedModel = await UserReg.create(userModel)
            if (savedModel) {
                savedModel.password = undefined
                return res.status(200).json({
                    user: savedModel,
                    message: "You are registered successfully",
                    error: false
                })
            } else {
                return res.status(500).json({
                    message: "There is some iternal error in server",
                    error: true
                })
            }
            
        })
    })

})




