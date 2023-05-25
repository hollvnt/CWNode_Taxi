const express = require('express');
const RegisterController = require('../controllers/registerController');
const passport = require('passport');
module.exports = () =>{
  const constroller = new RegisterController();
  const router = express.Router();

  router.post('/register', (req, res) => {constroller.register(req, res)});
  router.get('/auth/google', passport.authenticate('google', { scope: ['email'], clientID: '127077560420-qfd62fkuhoo5ufuem4g0upfdos8ks4t0.apps.googleusercontent.com', callbackURL: 'http://localhost:3000/api/auth/google/callback' }));

  router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        res.redirect('/');
    });

  return router;
}