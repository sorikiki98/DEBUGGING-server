import express from 'express';
import * as ProductsController from '../controller/products';
import { isAuth } from '../middleware/auth';
const productsRouter = express.Router();
productsRouter.get('/', isAuth, ProductsController.getProducts);
productsRouter.get('/:product_id', isAuth, ProductsController.getProduct);
productsRouter.post('/interest/:product_id', isAuth, ProductsController.addProductInterest);
productsRouter.delete('/interest/:product_id', isAuth, ProductsController.removeCompanyInterest);
export default productsRouter;
//# sourceMappingURL=products.js.map