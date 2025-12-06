import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

const generateRefreshToken = async(userID) => {
    const refreshToken = await jwt.sign(
        {id: userID,},
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    )
    
    await User.update(
        { refreshToken: refreshToken },  // Giá trị cần update
        { where: { id: userID } }         // Điều kiện
    );
    return refreshToken;
}

export default generateRefreshToken;