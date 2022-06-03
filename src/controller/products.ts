import { Request, NextFunction, Response } from 'express';
import * as ProductsRepository from '../data/products.js';
import { Product, ProductInterest } from '../types/index.js';

export async function getProducts(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { getProducts, getProductInterestsByUserId } = ProductsRepository;
	const products = await getProducts();
    const productInterests = await getProductInterestsByUserId(req.userId!);

	updateProductInterested(products, productInterests);
	res.status(200).json(products);
}

export async function getProduct(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const productId = req.params.product_id;
	const product = await ProductsRepository.getProduct(productId);
	const isInterested = await isProductInterested(req);
	product.isProductInterested = isInterested;

	res.status(200).json(product);
}

export async function addProductInterest(
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (await isProductInterested(req)) {
		return res.sendStatus(409);
	}
	await ProductsRepository.addProductInterest(
		req.userId!,
		req.params.product_id
	);
	res.sendStatus(201);
}

export async function removeCompanyInterest(
	req: Request,
	res: Response,
	next: NextFunction
) {
    if (!(await isProductInterested(req))) {
		return res.sendStatus(404);
	}
	await ProductsRepository.removeProductInterest(
		req.userId!,
		req.params.product_id
	);
	res.sendStatus(204);
}

async function isProductInterested(req: Request): Promise<boolean> {
	return await ProductsRepository.findProductInterestById(
		req.userId!,
		req.params.product_id
	);
}

function updateProductInterested(
	products: Product[],
	productInterests: ProductInterest[]
) {
	const interestedProductIds = productInterests.map(
		(productInterest) => productInterest.productId
	);
	products.forEach(
		(product) =>
			(product.isProductInterested = interestedProductIds.includes(product.id))
	);
}
