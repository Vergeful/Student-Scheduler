const {StatusCodes} = require('http-status-codes');
const {BadRequestError, InvalidAuthenticationError} = require('../Errors');
const { pool } = require('../Database/connect');
const jwt = require('jsonwebtoken');

const studentLogin = async(req, res) => {
    var {id, email, password} = req.body

    if(!id || !email || !password){
        throw new BadRequestError('Provide id, email and password')
    }

    id = parseInt(id);
    email = email.toString();
    password = password.toString();

    const [rows] = await pool.promise().query(`
        SELECT	*
        FROM    STUDENT 
        WHERE	ID = ? AND Email = ? AND Password = ?`, 
    [id, email, password]);

    if (rows.length > 0) {
        // Check password (should be done with bcrypt)
        if(password.trim() !== rows[0].Password.trim())
            throw new InvalidAuthenticationError('Incorrect Password');

        const token = jwt.sign({id: rows[0].ID, type: "student"}, "jwtkey");

        res.cookie("access_token", token, {
            httpOnly: true
        }).status(StatusCodes.OK).json({id: rows[0].ID, name: rows[0].FName, type: "student"});
    } else {
        res.status(StatusCodes.NOT_FOUND).json({ error: 'Student could not be found' });
    }
 
}

const adminLogin = async(req, res) => {
    var {id, email, password} = req.body

    if(!id || !email || !password){
        throw new BadRequestError('Provide id, email and password')
    }
    
    id = parseInt(id);
    email = email.toString();
    password = password.toString();

    const [rows] = await pool.promise().query(`
        SELECT	*
        FROM    ADMIN 
        WHERE	ID = ? AND Email = ? AND Password = ?`, 
    [id, email, password]);

    if (rows.length > 0) {
        // Check password (should be done with bcrypt)
        if(password.trim() !== rows[0].Password.trim())
            throw new InvalidAuthenticationError('Incorrect Password');

        const token = jwt.sign({id: rows[0].ID, type: "admin"}, "jwtkey");

        res.cookie("access_token", token, {
            httpOnly: true
        }).status(StatusCodes.OK).json({id: rows[0].ID, name: rows[0].FName, type: "admin"});
    } else {
        res.status(StatusCodes.NOT_FOUND).json({ error: 'Admin could not be found' });
    }
}

const logout = async(req, res) => {
    res.clearCookie("access_token", {
        sameSite: "none",
        secure: true
    }).status(StatusCodes.OK).json("Logout successful");
}

module.exports = {adminLogin, studentLogin, logout}

