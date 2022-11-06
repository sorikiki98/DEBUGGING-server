var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as BugsRepository from '../data/bugs.js';
export function getBugs(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const bugs = (yield BugsRepository.getBugs());
        res.status(200).json(bugs);
    });
}
export function getBug(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const bug = (yield BugsRepository.getBug(req.params.bug_id));
        if (bug == null) {
            return res.sendStatus(404);
        }
        res.status(200).json(bug);
    });
}
export function survey(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        yield BugsRepository.addSurveyResult(req.userId, req.params.bug_id);
        res.sendStatus(201);
    });
}
//# sourceMappingURL=bugs.js.map