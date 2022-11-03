var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as ProductsRepository from '../data/products';
export function getProducts(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const products = yield ProductsRepository.getProducts();
        Promise.all(products.map((product) => __awaiter(this, void 0, void 0, function* () {
            return updateProductProperties(req.userId, product);
        }))).then((result) => res.status(200).json(result));
    });
}
export function getProduct(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.userId;
        const productId = req.params.product_id;
        const product = yield ProductsRepository.getProduct(productId);
        if (product == null) {
            return res.sendStatus(404);
        }
        yield updateProductProperties(userId, product).then((result) => res.status(200).json(result));
    });
}
export function addProductInterest(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.userId;
        const productId = req.params.product_id;
        if (yield isProductInterested(userId, productId)) {
            return res.sendStatus(409);
        }
        yield ProductsRepository.addProductInterest(userId, productId);
        res.sendStatus(201);
    });
}
export function removeCompanyInterest(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.userId;
        const productId = req.params.product_id;
        if (!(yield isProductInterested(userId, productId))) {
            return res.sendStatus(404);
        }
        yield ProductsRepository.removeProductInterest(userId, productId);
        res.sendStatus(204);
    });
}
function updateProductProperties(userId, product) {
    return __awaiter(this, void 0, void 0, function* () {
        yield updateIsProductInterested(userId, product);
        yield updateNumOfInterestedUsers(product);
        return product;
    });
}
function updateIsProductInterested(userId, product) {
    return __awaiter(this, void 0, void 0, function* () {
        product.isProductInterested = yield isProductInterested(userId, product.id.toString());
    });
}
function updateNumOfInterestedUsers(product) {
    return __awaiter(this, void 0, void 0, function* () {
        const numOfUsers = yield ProductsRepository.getNumberOfInterestedUsersOfProduct(product.id.toString());
        product.numOfInterestedUsers = numOfUsers;
    });
}
function isProductInterested(userId, productId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield ProductsRepository.isProductInterested(userId, productId);
    });
}
//# sourceMappingURL=products.js.map