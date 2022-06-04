import createPromiseWithDBQuery from '../util/promise.js';
export function getProducts() {
    return createPromiseWithDBQuery('SELECT * FROM products', undefined, (resolve, result) => resolve(result));
}
export function getProductInterestsByUserId(userId) {
    return createPromiseWithDBQuery('SELECT * FROM productinterests WHERE userId = ?', userId, (resolve, result) => resolve(result));
}
export function getProduct(productId) {
    return createPromiseWithDBQuery('SELECT * FROM products WHERE id = ?', productId, (resolve, result) => resolve(result[0]));
}
export function findProductInterestById(userId, productId) {
    return createPromiseWithDBQuery('SELECT * FROM productinterests WHERE userId = ? AND productId = ?', [userId, productId], (resolve, result) => {
        if (!result[0])
            resolve(false);
        else
            resolve(true);
    });
}
export function addProductInterest(userId, productId) {
    return createPromiseWithDBQuery('INSERT INTO productinterests (userId, productId) VALUES (?, ?)', [userId, productId], (resolve, result) => resolve(result['insertId']));
}
export function removeProductInterest(userId, productId) {
    return createPromiseWithDBQuery('DELETE FROM productinterests WHERE userId = ? AND productId = ?', [userId, productId], (resolve, result) => resolve(result));
}
export function getProductItemsOfUser(userId) {
    return createPromiseWithDBQuery('SELECT p.id, p.name FROM productinterests AS pi INNER JOIN products AS p ON pi.productId = p.id WHERE pi.userId = ?', userId, (resolve, result) => resolve(result));
}
//# sourceMappingURL=products.js.map