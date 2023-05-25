const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = class RegisterDriverController { 
  becomeDriver = async (req, res) => {
    const { UserEmail, UserPassword } = req.body;

    const user = await prisma.users.findFirst({ where: { UserEmail: UserEmail } });
    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    const checkDriver = await prisma.drivers.findFirst({ where: { UserID: user.UserID } });
    if (checkDriver) {
      return res.status(400).json({ error: "Вы уже являетесь водителем" });
    } 

    try {
      const driver = await prisma.drivers.create({
        data: {
          DriverCar: "",
          DriverLicensePlate: "", 
          UserID: user.UserID,
        }
      });
  
      return res.status(200).json({ message: "Вы стали водителем", driver });
    } catch (error) {
      return res.status(500).json({ error: "Произошла ошибка при регистрации водителя" });
    }
  }
};
