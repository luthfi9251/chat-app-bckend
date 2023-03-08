let GoogleStrategy = require('passport-google-oauth20').Strategy;
let passport = require('passport')
let User = require('../models/user')

let GOOGLE_CLIENT_ID = '492930706196-i0rsnu8ma0kr0jhfokpdk6i25ln0ks79.apps.googleusercontent.com'
let GOOGLE_CLIENT_SECRET = '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'

function createUsername(string){
    let temp = string.toLowerCase().split(" ").join("") + Math.floor(Math.random()*1000)
    return temp
}

function insertDatabase(object){
    User.create(obj, (err, data)=>{
        if(err) return console.log(err)
        console.log(data)
    })
}

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:4000/auth/redirect/google"
  },
  function(accessToken, refreshToken, profile, done) {
    let dataProfile = {
        authType: "google",
        authId: profile.id,
        name: profile.displayName,
        username: createUsername(profile.displayName),
        email: profile.emails[0]?.value,
        profilePicture: profile.photos[0]?.value
    }
    //database action
    User.findOne({ authType: "google", authId: dataProfile.authId},(err, data)=>{
        if(err) return done(null,false)
        if(!data){
            User.create(dataProfile, (err, res)=>{
                if(err) return console.log(err)
                console.log(res)
                done(null,res)
            })
            return
        }
        done(null,data)
    })
  }
));

passport.serializeUser((user,done)=>{
  done(null,user)
})

passport.deserializeUser((user,done)=>{
  done(null,user)
})