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
import { config } from '../config.js';
export function createUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userName, password } = req.body;
        const user = yield UserRepository.findUserByName(userName);
        if (user) {
            return res.sendStatus(209);
        }
        const hashed = yield bcrypt.hash(password, parseInt(config.bcrypt.saltsRound));
        const userId = yield UserRepository.createUser(Object.assign(Object.assign({}, req.body), { password: hashed }));
        const token = createJWT(userId);
        res.status(201).json({
            token,
            userName,
        });
    });
}
export function login(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userName, password } = req.body;
        const user = yield UserRepository.findUserByName(userName);
        if (!user)
            return res.sendStatus(401);
        const match = yield bcrypt.compare(password, user.password);
        if (!match)
            return res.sendStatus(401);
        const token = createJWT(user.id);
        res.status(200).json({
            token,
            userName,
        });
    });
}
export function remove(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        yield UserRepository.deleteUser(req.userId);
        res.sendStatus(204);
    });
}
function createJWT(userId) {
    return jwt.sign({ userId }, config.jwt.privateKey, {
        expiresIn: config.jwt.expirSecs,
    });
}
//# sourceMappingURL=user.js.map