import { Product, ProductInterest, ProductItem } from '../types/index.js';
import createPromiseWithDBQuery from '../util/promise.js';

export function getProducts(): Promise<Product[]> {
	return createPromiseWithDBQuery<Product[]>(
		'SELECT * FROM products',
		undefined,
		(resolve, result: Product[]) => resolve(result)
	);
}

export function getProduct(productId: string): Promise<Product> {
	return createPromiseWithDBQuery<Product>(
		'SELECT * FROM products WHERE id = ?',
		productId,
		(resolve, result) => resolve(result[0])
	);
}

export function isProductInterested(
	userId: number,
	productId: string
): Promise<boolean> {
	return createPromiseWithDBQuery<boolean>(
		'SELECT * FROM productinterests WHERE userId = ? AND productId = ?',
		[userId, productId],
		(resolve, result) => {
			if (!result[0]) resolve(false);
			else resolve(true);
		}
	);
}

export function addProductInterest(
	userId: number,
	productId: string
): Promise<number> {
	return createPromiseWithDBQuery(
		'INSERT INTO productinterests (userId, productId) VALUES (?, ?)',
		[userId, productId],
		(resolve, result) => resolve(result['insertId'])
	);
}

export function removeProductInterest(
	userId: number,
	productId: string
): Promise<undefined> {
	return createPromiseWithDBQuery<undefined>(
		'DELETE FROM productinterests WHERE userId = ? AND productId = ?',
		[userId, productId],
		(resolve, result) => resolve(result)
	);
}

export function getProductItemsOfUser(userId: number): Promise<ProductItem[]> {
	return createPromiseWithDBQuery<ProductItem[]>(
		'SELECT p.id, p.name FROM productinterests AS pi INNER JOIN products AS p ON pi.productId = p.id WHERE pi.userId = ?',
		userId,
		(resolve, result) => resolve(result)
	);
}

export function getNumberOfInterestedUsersOfProduct(productId: string): Promise<number> {
	return createPromiseWithDBQuery<number>(
		'SELECT COUNT(*) FROM productinterests WHERE productId = ?',
		productId,
		(resolve, result) => resolve(result[0]['COUNT(*)'])
	);
}
