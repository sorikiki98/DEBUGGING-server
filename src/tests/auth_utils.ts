import { faker } from '@faker-js/faker';
import { AxiosInstance } from 'axios';

export async function createNewAccount(request: AxiosInstance) {
	const userDetails = createUserDetails();
	const response = await request.post('/user/signup', userDetails);

	return {
		...userDetails,
		token: response.data.token,
	};
}

export function createUserDetails() {
    return {
        userName: faker.name.firstName(),
		password: faker.internet.password(),
		name: faker.name.middleName(),
		contactNumbers: faker.phone.number(),
		email: faker.internet.email(),
    }
}
