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
    if (authHeader && authHeader.split(' ')[1]) {
        token = authHeader.split(' ')[1];
    }
    if (!token) {
        return res.sendStatus(401);
    }
    jwt.verify(token, config.jwt.privateKey, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.log(err.message);
            return res.sendStatus(401);
        }
        const user = yield UserRepository.findUserById(decoded.userId);
        if (!user) {
            return res.sendStatus(401);
        }
        req.userId = decoded.userId;
        next();
    }));
};
//# sourceMappingURL=auth.js.map