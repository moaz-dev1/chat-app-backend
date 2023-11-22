import jwt from 'jsonwebtoken';

// Create new token
function createToken(id: string) {
    try {
        return jwt.sign({id}, 'secret token', {'expiresIn': '3000d'});
    } catch (error) {
        throw error;
    }
}

// Check if the token is valid
function authToken(token: string) {
    try {
        jwt.verify(token, 'secret token', (error, decoded) => {
            if(error) return {logged: false};
            return {id: decoded, logged: true};
        });
    } catch (error) {
        throw error;
    }
}

export {createToken, authToken};