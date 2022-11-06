var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import * as UserRepository from '../data/user.js';
export const isAuth = (req, res, next) => {
    const authHeader = req.get('Authorization');
    let token;
    if (authHeader && authHeader.split(' ')[0].startsWith('Bearer')) {
        token = authHeader.split(' ')[1];
    }
    if (!token) {
        return res.status(401).json({ message: 'Authorization header is invalid.' });
    }
    jwt.verify(token, config.jwt.privateKey, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.status(401).json({ message: err.message });
        }
        const user = yield UserRepository.findUserById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: 'User does not exist.' });
        }
        req.userId = decoded.userId;
        next();
    }));
};
//# sourceMappingURL=auth.js.map