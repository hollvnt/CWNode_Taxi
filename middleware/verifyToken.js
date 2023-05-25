const jwt = require('jsonwebtoken');

module.exports = class VerifyToken {
    verifyToken = async(req, res, next) =>{ 
        const token = req.cookies.AuthToken; 
        if (!token) { 
            return res.status(401).json({ message: 'Токен не найден' }); 
        }
        try { 
            const decoded = jwt.verify(token, 'secretkey'); 
            req.user = decoded; 
            next(); 
        } catch (err) { 
            return res.status(401).json({ message: 'Неверный токен' }); 
        } 
    } 
} 