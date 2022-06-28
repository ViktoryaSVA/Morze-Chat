import mongoose from "mongoose";
import CryptoJS from "crypto-js"
import { UserInterface } from '../interfaces/user.interface';
const translatorBOT = require('../service/app');
const { qwertyArray } = require('../service/keyBoard');

const { userScheme } = require('../models/user.model');
// mongoose.connect(`mongodb://localhost:27017/${process.env.MONGODB_DB}`);
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.isy6zdz.mongodb.net/test`);

const User = mongoose.model("User", userScheme);

let permissionLevel: Array<string> = [];

const loginUser = function (req: any, res: any, UserInterface: UserInterface) {

    UserInterface.login = req.body.login;
    UserInterface.password = req.body.password;
    UserInterface.email = req.body.email;

    permissionLevel.push(req.body.permissionLevel);

    if (UserInterface.login) {
        User.find({login:UserInterface.login})
            .then(validate)
    } else if(UserInterface.email){
        User.find({email:UserInterface.email})
            .then(validate)
    } else {
        res.send({
            status: '400' ,
            data: 'Wrong data'
        });
    }

    function validate(element: any) {

        element.forEach(function (el:any) {
            const checkPass = CryptoJS.AES.decrypt(el.password, `${process.env.SECRET_KEY}`);
            const decryptedData = checkPass.toString(CryptoJS.enc.Utf8);


            if(UserInterface.password == decryptedData){

                if (UserInterface.permissionLevel == 'admin') {
                    res.send({
                        status: '200' ,
                        data: {token: el.password, permissionLevel: el.permissionLevel}
                    });
                } else {
                    res.render('contact.ejs', {
                        data: {},
                        errors: {}
                    })
                }

            } else{
                res.send({
                    status: '401' ,
                    data: 'User is not authorized'
                });
            }
            
        })
    }


}

const registerUser = function (req: any, res: any, UserInterface: UserInterface) {

    UserInterface.login = req.body.login;
    UserInterface.email = req.body.email;
    UserInterface.password = req.body.password;
    UserInterface.permissionLevel = req.body.permissionLevel;
    UserInterface.token = CryptoJS.AES.encrypt(UserInterface.password, `${process.env.SECRET_KEY}`).toString();

    try {
        const user =  new User({
            login: UserInterface.login,
            email: UserInterface.email,
            password: UserInterface.token,
            registerDate: Date.now(),
            permissionLevel: UserInterface.permissionLevel,
        })

        user.save(function(){
            // mongoose.disconnect();
            console.log("Сохранен объект", user);
        });

        res.render('index.ejs', {
            data: {},
            errors: {}
        })
    } catch (err) {
        res.send({
            status: '500' ,
            data: err
        });
    }
}

const getUsers = function (req: any, res: any) {
    User.find({}, function (err: any, users: any){
        res.send({
            status: '200' ,
            data: users
        });
    })
}

const getRegistration = function (req: any, res: any) {
    res.render('registration.ejs', {
        data: {},
        errors: {}
    })
} 

const getData = function (req: any, res: any) {
    res.render('index.ejs', {
      data: req.body,
      errors: {}
    });
}

module.exports = {
    registerUser,
    loginUser,
    getUsers,
    getRegistration,
    getData,
}
