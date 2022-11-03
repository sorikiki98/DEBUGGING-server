var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as CompaniesRepository from '../data/companies';
import * as UserRepository from '../data/user';
export function getCompanies(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const companies = yield CompaniesRepository.getCompanies();
        Promise.all(companies.map((company) => __awaiter(this, void 0, void 0, function* () {
            return updateCompanyProperties(req.userId, company);
        }))).then((result) => res.status(200).json(result));
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
        if (reservation == null) {
            return res.status(404).json({ message: 'A reservation id is invalid.' });
        }
        const user = yield UserRepository.findUserById(req.userId);
        const company = yield CompaniesRepository.findCompanyById(reservation.companyId.toString());
        if (user && company) {
            const reservationDetail = createReservationDetail(reservation, user, company);
            res.status(200).json(reservationDetail);
        }
    });
}
export function addCompanyInterest(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.userId;
        const companyId = req.params.company_id;
        if (yield isCompanyInterested(userId, companyId)) {
            return res.sendStatus(409);
        }
        yield CompaniesRepository.addCompanyInterest(userId, companyId);
        res.sendStatus(201);
    });
}
export function removeCompanyInterest(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.userId;
        const companyId = req.params.company_id;
        if (!(yield isCompanyInterested(userId, companyId))) {
            return res.sendStatus(404);
        }
        yield CompaniesRepository.removeCompanyInterest(userId, companyId);
        res.sendStatus(204);
    });
}
export function updateCompanyProperties(userId, company) {
    return __awaiter(this, void 0, void 0, function* () {
        yield updateIsCompanyInterested(userId, company);
        yield updateNumOfInterestedUsers(company);
        return company;
    });
}
function updateIsCompanyInterested(userId, company) {
    return __awaiter(this, void 0, void 0, function* () {
        company.isCompanyInterested = yield isCompanyInterested(userId, company.id.toString());
    });
}
function updateNumOfInterestedUsers(company) {
    return __awaiter(this, void 0, void 0, function* () {
        company.numOfInterestedUsers =
            yield CompaniesRepository.getNumberOfInterestedUsersOfCompany(company.id.toString());
    });
}
function isCompanyInterested(userId, companyId) {
    return __awaiter(this, void 0, void 0, function* () {
        return CompaniesRepository.isCompanyInterested(userId, companyId);
    });
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