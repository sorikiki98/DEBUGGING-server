var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as ProductsRepository from '../data/products.js';
export function getProducts(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { getProducts, getProductInterestsByUserId } = ProductsRepository;
        const products = yield getProducts();
        const productInterests = yield getProductInterestsByUserId(req.userId);
        updateProductInterested(products, productInterests);
        res.status(200).json(products);
    });
}
export function getProduct(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const productId = req.params.product_id;
        const product = yield ProductsRepository.getProduct(productId);
        const isInterested = yield isProductInterested(req);
        product.isProductInterested = isInterested;
        res.status(200).json(product);
    });
}
export function addProductInterest(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield isProductInterested(req)) {
            return res.sendStatus(409);
        }
        yield ProductsRepository.addProductInterest(req.userId, req.params.product_id);
        res.sendStatus(201);
    });
}
export function removeCompanyInterest(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(yield isProductInterested(req))) {
            return res.sendStatus(404);
        }
        yield ProductsRepository.removeProductInterest(req.userId, req.params.product_id);
        res.sendStatus(204);
    });
}
function isProductInterested(req) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield ProductsRepository.findProductInterestById(req.userId, req.params.product_id);
    });
}
function updateProductInterested(products, productInterests) {
    const interestedProductIds = productInterests.map((productInterest) => productInterest.productId);
    products.forEach((product) => (product.isProductInterested = interestedProductIds.includes(product.id)));
}
//# sourceMappingURL=products.js.map