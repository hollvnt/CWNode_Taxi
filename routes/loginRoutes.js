const express = require('express');
const LoginContoller = require('../controllers/loginController'); 

module.exports = () =>{
  const constroller = new LoginContoller();
  const router = express.Router();

  router.post('/login',  (req, res) => {constroller.login(req, res)});

  return router;
}