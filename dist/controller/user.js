var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as UserRepository from '../data/user.js';
const saltRounds = 10;
const jwtPrivateKey = 'VljbgaD4Nn$GGMJ4';
const jwtExpiration = 60000;
export function createUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userName, password } = req.body;
        const user = yield UserRepository.findUserByName(userName);
        if (user) {
            return res.sendStatus(209);
        }
        const hashed = yield bcrypt.hash(password, saltRounds);
        const userId = yield UserRepository.createUser(Object.assign(Object.assign({}, req.body), { password: hashed }));
        const token = createJWT(userId);
        res.status(201).json({
            token,
            userName,
        });
    });
}
export function login(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () { });
}
function createJWT(userId) {
    return jwt.sign({ userId }, jwtPrivateKey, { expiresIn: jwtExpiration });
}
//# sourceMappingURL=user.js.map