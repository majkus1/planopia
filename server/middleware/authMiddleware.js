const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Zakładamy, że `roles` to tablica ról
        req.user = { 
            userId: decoded.userId, 
            roles: decoded.roles // Poprawka: `roles` zamiast `role`
        };

        next();
        console.log("Authenticated user:", req.user);

    } catch (error) {
        console.error('Error in auth middleware:', error);
        res.status(401).send('Unauthorized');
    }
};
