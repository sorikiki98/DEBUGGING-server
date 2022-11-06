import express from 'express';
import * as ProductsController from '../controller/products.js';
import { isAuth } from '../middleware/auth.js';

const productsRouter = express.Router();

productsRouter.get('/', isAuth, ProductsController.getProducts);
productsRouter.get('/:product_id', isAuth, ProductsController.getProduct);
productsRouter.post(
	'/interest/:product_id',
	isAuth,
	ProductsController.addProductInterest
);
productsRouter.delete(
	'/interest/:product_id',
	isAuth,
	ProductsController.removeProductInterest
);

export default productsRouter;
