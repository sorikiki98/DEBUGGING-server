import { pool } from '../db/database';
import { ResolveCallback, QueryParamType, PromiseReturnType} from '../types/index';

export default function createPromiseWithDBQuery<T = PromiseReturnType>(
	query: string,
	params: QueryParamType,
	callback: ResolveCallback<T>
): Promise<T> {
	return new Promise((resolve, reject) => {
		pool.query(query, params, (error, result) => {
			if (error) reject(error);
			else callback(resolve, result);
		});
	});
}