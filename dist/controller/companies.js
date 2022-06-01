var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as CompaniesRepository from '../data/companies.js';
import * as UserRepository from '../data/user.js';
export function getCompanies(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const companies = (yield CompaniesRepository.getCompanies());
        res.status(200).json(companies);
    });
}
export function reserve(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let reservationInfo = req.body;
        reservationInfo = Object.assign(Object.assign({}, reservationInfo), { reservationDateTime: new Date() });
        const id = yield CompaniesRepository.reserveCompany(req.userId, req.params.company_id, reservationInfo);
        const user = yield UserRepository.findUserById(req.userId);
        const userInfo = {
            userId: user.id,
            userName: user.userName,
            userContactNumbers: user.contactNumbers,
            userEmail: user.email,
            userAddress: user.address,
            sizeOfHouse: user.sizeOfHouse,
            numOfRooms: user.numOfRooms,
        };
        const company = yield CompaniesRepository.findCompanyById(req.params.company_id);
        const companyInfo = {
            companyId: company.id,
            companyName: company.name,
            shortIntro: company.shortIntro,
            description: company.description,
            companyContactNumbers: company.contactNumbers,
            killableBugs: company.killableBugs,
            availableArea: company.availableArea,
            availableCounselTime: company.availableCounselTime,
            thumbnail: company.thumbnail,
        };
        const reservationDetail = Object.assign(Object.assign(Object.assign({ id }, reservationInfo), userInfo), companyInfo);
        res.status(201).json(reservationDetail);
    });
}
//# sourceMappingURL=companies.js.map