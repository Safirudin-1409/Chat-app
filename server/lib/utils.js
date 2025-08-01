// import jwt from 'jsonwebtoken';

// export const generateToken = (userId) => {
//     const token = jwt.sign({userId}, process.env.JWT_SECRET);
//     return token;
// }

import jwt from 'jsonwebtoken';

export const generateToken = (userId) => {
    const token = jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: '30m' }  // Token lasts 30 minutes
    );
    return token;
};
