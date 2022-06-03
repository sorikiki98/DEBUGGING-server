export default function createReservationDetail(id, user, company, reservation) {
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
    const reservationInfo = Object.assign(Object.assign({}, reservation), { reservationDateTime: new Date() });
    return Object.assign(Object.assign(Object.assign({ id }, userInfo), companyInfo), reservationInfo);
}
//# sourceMappingURL=reservation.js.map