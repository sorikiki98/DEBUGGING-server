import { pool } from '../db/database.js';
import { ResolveCallback, QueryParamType, PromiseReturnType} from '../types/index.js';

export default function createPromiseWithDBQuery<T = PromiseReturnType>(
	query: string,
	params: QueryParamType,
	callback: ResolveCallback<T>
): Promise<T> {
	return new Promise((resolve, reject) => {
		pool.query(query, params, (error, result) => {
			if (error) {
				console.log(error.sqlMessage);
				reject(error);
			}
			callback(resolve, result);
		});
	});
}