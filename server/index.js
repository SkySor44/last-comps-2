const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const session = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const cors = require('cors')


const app =  express();

const {
    SERVER_PORT,
    CONNECTION_STRING,
    SESSION_SECRET,
    DOMAIN,
    CLIENT_ID,
    CLIENT_SECRET,
    CALLBACK_URL
} = process.env;

app.use( express.static( `${__dirname}/../build` ) );

app.use(cors());
app.use(bodyParser.json());
app.use(session({
    secret: 'cheese',
    resave: false,
    saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());

passport.use(new Auth0Strategy({
    domain: DOMAIN,
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: CALLBACK_URL,
    scope: "openid email profile"
}, function(accessToken, refreshToken, extraParams, profile, done){
    return done(null, profile)
}));

passport.serializeUser( (profile, done) => {
    done(null, profile);
});

passport.deserializeUser( (profile, done) => {
    done(null, profile)
})

app.get('/auth/callback', passport.authenticate('auth0', {
    successRedirect: process.env.SUCCESS_REDIRECT,
    failureRedirect: process.env.FAILURE_REDIRECT
}));

app.get('/auth/me', function(req, res, next){
    if (req.user){
        res.status(200).send(req.user)
    } else {
        res.status(401).send('Nice Try Sucka')
    }
})

function authenticated(req, res, next){
    if(req.session){
        next()
    } else {
        res.sendStatus(401)
    }
}

var dummyData = ['I', 'am', 'dummy', 'data']

app.get('/getendpoint', authenticated, function(req, res, next) {
    res.status(200).send(dummyData)
})

app.put('/putendpoint', authenticated, function(req, res, next){
    dummyData[2] = 'smart'
    res.status(200).send(dummyData)
})


app.listen(3004, () => console.log(`I'm listening on port 3004`))