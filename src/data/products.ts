import { Product, ProductInterest } from '../types/index.js';
import createPromiseWithDBQuery from '../util/promise.js';

export function getProducts(): Promise<Product[]> {
	return createPromiseWithDBQuery<Product[]>(
		'SELECT * FROM products',
		undefined,
		(resolve, result: Product[]) => resolve(result)
	);
}

export function getProductInterestsByUserId(
	userId: number
): Promise<ProductInterest[]> {
	return createPromiseWithDBQuery<ProductInterest[]>(
		'SELECT * FROM productinterests WHERE userId = ?',
		userId,
		(resolve, result: ProductInterest[]) => resolve(result)
	);
}

export function getProduct(productId: string): Promise<Product> {
	return createPromiseWithDBQuery<Product>(
		'SELECT * FROM products WHERE id = ?',
		productId,
		(resolve, result) => resolve(result[0])
	);
}

export function findProductInterestById(
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
		(resolve, result) => {
			resolve(result['insertId'])
		}
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
