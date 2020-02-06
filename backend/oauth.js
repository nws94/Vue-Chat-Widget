
const Mydb = require('./mydb');
const axios = require("axios");
const request = require('request-promise');
const passport = require('passport');
const KakaoStrategy = require("passport-kakao").Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;;
const kakao_token = require('passport-kakao-token2');
const qs = require('qs');


module.exports = function(app, pool) {
  const kakaokey = {
    clientID: "f416dd33804b135b1009132880917e4d",
    clientSecret: "7Gc4N753EHlYElG1A7zcu6ML2LwJAgGt",
    callbackURL: "http://localhost:3003/auth/kakao/callback"
  }
  
  passport.use("kakao-login", new KakaoStrategy(kakaokey, (accessToken, refreshToken, profile, done) => {
    console.log(profile);
    })
  );

  app.get("/kakao",passport.authenticate("kakao-login"))
  app.options("/kakao",passport.authenticate("kakao-login"))
  app.get("/kakao/callback", passport.authenticate("kakao-login", {failureRedirect: "/"}), (req,res) => {
    res.redirect("http://localhost:3004/home");
  });


  passport.use(new GoogleStrategy({
    clientID: '621163886285-c9a1iasp515jqp9f4gk5hh9eroqk8m2h.apps.googleusercontent.com',
    clientSecret: 'uWzypOVo3YyOBooGYLbuDVej',
    callbackURL: "http://localhost:3003/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
       User.findOrCreate({ googleId: profile.id }, function (err, user) {
         return done(err, user);
       });
  }
));

  app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));
}