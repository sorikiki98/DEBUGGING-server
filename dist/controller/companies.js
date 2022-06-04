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
        const { getCompanies, getCompanyInterestsByUserId } = CompaniesRepository;
        const companies = yield getCompanies();
        const companyInterests = yield getCompanyInterestsByUserId(req.userId);
        updateCompanyInterested(companies, companyInterests);
        res.status(200).json(companies);
    });
}
export function reserve(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const reservation = req.body;
        const reservationId = yield CompaniesRepository.reserveCompany(req.userId, req.params.company_id, reservation);
        res.status(201).json(reservationId);
    });
}
export function checkReservation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const reservation = yield CompaniesRepository.getReservationDetail(req.params.reservation_id);
        const user = yield UserRepository.findUserById(req.userId);
        const company = yield CompaniesRepository.findCompanyById(reservation.companyId.toString());
        const reservationDetail = createReservationDetail(reservation, user, company);
        res.status(200).json(reservationDetail);
    });
}
export function addCompanyInterest(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield isCompanyInterested(req)) {
            return res.sendStatus(409);
        }
        yield CompaniesRepository.addCompanyInterest(req.userId, req.params.company_id);
        res.sendStatus(201);
    });
}
export function removeCompanyInterest(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(yield isCompanyInterested(req))) {
            return res.sendStatus(404);
        }
        yield CompaniesRepository.removeCompanyInterest(req.userId, req.params.company_id);
        res.sendStatus(204);
    });
}
function isCompanyInterested(req) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield CompaniesRepository.findCompanyInterestById(req.userId, req.params.company_id);
    });
}
function updateCompanyInterested(companies, companyInterests) {
    const interestedCompanyIds = companyInterests.map((companyInterest) => companyInterest.companyId);
    companies.forEach((company) => (company.isCompanyInterested = interestedCompanyIds.includes(company.id)));
}
function createReservationDetail(reservation, user, company) {
    const reservationInfo = Object.assign(Object.assign({}, reservation), { reservationDateTime: new Date() });
    const userInfo = {
        userId: user.id,
        userName: user.userName,
        userContactNumbers: user.contactNumbers,
        userEmail: user.email,
        userAddress: user.address,
        sizeOfHouse: user.sizeOfHouse,
        numOfRooms: user.numOfRooms,
    };
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
    return Object.assign(Object.assign(Object.assign({}, reservationInfo), userInfo), companyInfo);
}
//# sourceMappingURL=companies.js.map