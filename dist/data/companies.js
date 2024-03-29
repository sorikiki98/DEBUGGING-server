var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import createPromiseWithDBQuery from '../util/promise.js';
export function getCompanies() {
    return createPromiseWithDBQuery('SELECT * FROM companies', undefined, (resolve, result) => resolve(result));
}
export function reserveCompany(userId, companyId, reservation) {
    const reservationWithFK = Object.assign({ userId, companyId }, reservation);
    return createPromiseWithDBQuery('INSERT INTO reservations SET ?', reservationWithFK, (resolve, result) => {
        resolve(result['insertId']);
    });
}
export function getReservationDetail(reservationId) {
    return createPromiseWithDBQuery('SELECT * FROM reservations WHERE id = ?', reservationId, (resolve, result) => resolve(result[0]));
}
export function findCompanyById(companyId) {
    return createPromiseWithDBQuery('SELECT * FROM companies WHERE id = ?', companyId, (resolve, result) => resolve(result[0]));
}
export const isCompanyInterested = (userId, companyId) => __awaiter(void 0, void 0, void 0, function* () {
    return createPromiseWithDBQuery('SELECT * FROM companyinterests WHERE userId = ? AND companyId = ?', [userId, companyId], (resolve, result) => {
        if (!result[0])
            resolve(0);
        else
            resolve(1);
    });
});
export function addCompanyInterest(userId, companyId) {
    return createPromiseWithDBQuery('INSERT INTO companyinterests (userId, companyId) VALUES (?, ?)', [userId, companyId], (resolve, result) => resolve(result['insertId']));
}
export function removeCompanyInterest(userId, companyId) {
    return createPromiseWithDBQuery('DELETE FROM companyinterests WHERE userId = ? AND companyId = ?', [userId, companyId], (resolve, result) => resolve(result));
}
export function getNumberOfReservationsOfUser(userId) {
    return createPromiseWithDBQuery('SELECT COUNT(*) FROM reservations WHERE userId = ?', userId, (resolve, result) => resolve(result[0]['COUNT(*)']));
}
export function getNumberOfInterestedCompaniesOfUser(userId) {
    return createPromiseWithDBQuery('SELECT COUNT(*) FROM companyinterests WHERE userId = ?', userId, (resolve, result) => resolve(result[0]['COUNT(*)']));
}
export const getNumberOfInterestedUsersOfCompany = (companyId) => __awaiter(void 0, void 0, void 0, function* () {
    return createPromiseWithDBQuery('SELECT COUNT(*) FROM companyinterests WHERE companyId = ?', companyId, (resolve, result) => resolve(result[0]['COUNT(*)']));
});
export function getReservationItemsOfUser(userId) {
    return createPromiseWithDBQuery('SELECT r.id AS reservationId, r.userId, r.processState, r.bugName, c.name AS companyName, r.reservationDateTime, r.visitDateTime FROM reservations AS r INNER JOIN companies AS c ON r.companyId = c.id WHERE r.userId = ?', userId, (resolve, result) => resolve(result));
}
//# sourceMappingURL=companies.js.map