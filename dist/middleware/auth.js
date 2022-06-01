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
    // 서버는 사용자들에게 각각의 아이디로 만든 서로 다른 토큰 객체를 전달
    // 클라이언트 한 명이 토큰을 제공을 함
    // 서버는 받은 토큰을 해독해서 유저의 아이디를 알아내고
    // 이 유저가 db 상에 존재하는 지 보고 다음 미들웨어에 전달한다.
    // 따라서 db에 접근을 해야하기 때문에 비동기적인 처리를 해야한다.
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