var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as UserRepository from '../data/user.js';
// Todo: password 암호화해서 보관 => 토큰 생성
export function createUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield UserRepository.findUserByName(req.body.userName);
        if (user) {
            return res.sendStatus(209);
        }
        const userId = yield UserRepository.createUser(req.body);
        res.status(201).json({
            token: userId,
            userName: req.body.userName
        });
    });
}
export function login(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
//# sourceMappingURL=user.js.map