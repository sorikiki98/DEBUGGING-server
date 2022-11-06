import { Request, NextFunction, Response } from 'express';
import * as ProductsRepository from '../data/products.js';
import { Product } from '../types/index.js';

export async function getProducts(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const products = await ProductsRepository.getProducts();
	const result = await Promise.all(
		products.map(async (product) => {
			return updateProductProperties(req.userId!, product);
		})
	);
	return res.status(200).json(result);
}

export async function getProduct(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const userId = req.userId!;
	const productId = req.params.product_id;
	const product = await ProductsRepository.getProduct(productId);
	if (product == null) {
		return res.sendStatus(404);
	}
	await updateProductProperties(userId, product).then((result) =>
		res.status(200).json(result)
	);
}

export async function addProductInterest(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const userId = req.userId!;
	const productId = req.params.product_id;
	if (await isProductInterested(userId, productId)) {
		return res.sendStatus(409);
	}
	const insertId = await ProductsRepository.addProductInterest(
		userId,
		productId
	);
	res.status(201).json({ insertId });
}

export async function removeProductInterest(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const userId = req.userId!;
	const productId = req.params.product_id;
	if (!(await isProductInterested(userId, productId))) {
		return res.sendStatus(404);
	}
	await ProductsRepository.removeProductInterest(userId, productId);
	res.sendStatus(204);
}

async function updateProductProperties(
	userId: number,
	product: Product
): Promise<Product> {
	await updateIsProductInterested(userId, product);
	await updateNumOfInterestedUsers(product);
	return product;
}

async function updateIsProductInterested(userId: number, product: Product) {
	product!.isProductInterested = await isProductInterested(
		userId,
		product!.id.toString()
	);
}

async function updateNumOfInterestedUsers(product: Product) {
	const numOfUsers =
		await ProductsRepository.getNumberOfInterestedUsersOfProduct(
			product!.id.toString()
		);
	product!.numOfInterestedUsers = numOfUsers;
}

async function isProductInterested(
	userId: number,
	productId: string
): Promise<number> {
	return await ProductsRepository.isProductInterested(userId, productId);
}
