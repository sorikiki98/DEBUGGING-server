import createPromiseWithDBQuery from '../util/promise';
export function getProducts() {
    return createPromiseWithDBQuery('SELECT * FROM products', undefined, (resolve, result) => resolve(result));
}
export function getProduct(productId) {
    return createPromiseWithDBQuery('SELECT * FROM products WHERE id = ?', productId, (resolve, result) => resolve(result[0]));
}
export function isProductInterested(userId, productId) {
    return createPromiseWithDBQuery('SELECT * FROM productinterests WHERE userId = ? AND productId = ?', [userId, productId], (resolve, result) => {
        if (!result[0])
            resolve(0);
        else
            resolve(1);
    });
}
export function addProductInterest(userId, productId) {
    return createPromiseWithDBQuery('INSERT INTO productinterests (userId, productId) VALUES (?, ?)', [userId, productId], (resolve, result) => resolve(result['insertId']));
}
export function removeProductInterest(userId, productId) {
    return createPromiseWithDBQuery('DELETE FROM productinterests WHERE userId = ? AND productId = ?', [userId, productId], (resolve, result) => resolve(result));
}
export function getProductItemsOfUser(userId) {
    return createPromiseWithDBQuery('SELECT pi.id AS productInterestId, p.id AS productId, pi.userId, p.name AS productName, p.thumbnail FROM productinterests AS pi INNER JOIN products AS p ON pi.productId = p.id WHERE pi.userId = ?', userId, (resolve, result) => resolve(result));
}
export function getNumberOfInterestedUsersOfProduct(productId) {
    return createPromiseWithDBQuery('SELECT COUNT(*) FROM productinterests WHERE productId = ?', productId, (resolve, result) => resolve(result[0]['COUNT(*)']));
}
//# sourceMappingURL=products.js.map