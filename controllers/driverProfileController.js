const ejs = require('ejs');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

module.exports = class profileDriverController { 
  driverProfile = async (req, res) => {
    try {
      const token = req.cookies.AuthToken;
      const decoded = jwt.verify(token, 'secretkey');
      const { id: DriverID } = decoded; 
  
      const driver = await prisma.drivers.findFirst({
        where: {
          DriverID: Number(DriverID)
        },
        include: {
          Users: true,
          Cars: {
            include: {
              Tariffs: true
            }
          }
        }
      }); 
      
  
      const template = fs.readFileSync('./views/driverProfile.ejs', 'utf-8');
      const html = ejs.render(template, { driver });
      res.send(html);
      console.log(decoded);
      console.log(driver);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  driverProfileUpdate = async (req, res) => {
    try {
      const token = req.cookies.AuthToken;
      const decoded = jwt.verify(token, 'secretkey');
      const { id: DriverID } = decoded;
  
      
      const { UserName, UserLastName, UserEmail, UserPhone } = req.body; 
      const updatedDriver = await prisma.drivers.update({
        where: { DriverID: Number(DriverID) },
        data: {
          Users: {
            update: {
              UserName,
              UserLastName,
              UserEmail,
              UserPhone
            }
          }
        },
        include: {
          Users: true
        }
      });
  
      res.render('driverProfile', { driver: updatedDriver });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
}  
  