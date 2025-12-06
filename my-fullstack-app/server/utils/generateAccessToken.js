import jwt from 'jsonwebtoken';

export const generateAccessToken = async (userID) => { 
    const token = await jwt.sign(
        {id: userID,},
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
    );
    return token
}

export default generateAccessToken;