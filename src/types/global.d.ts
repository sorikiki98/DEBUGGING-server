export {};

declare global {

	type Bug = {
		id: number;
		name: string;
		appearance: string;
		movement: string;
		habitat: string;
		color: string;
		surveyResult: string;
	};

	type UserRegistration = {
		userName: string;
		password: string;
		name: string;
		contactNumbers: string;
		email: string;
		address?: string;
		sizeOfHouse?: number;
		numOfRooms?: number;
	};

	type User = { id: number } & UserRegistration;

	type UserLogin = {
		userName: string;
		password: string;
	};

	type UserAuthenticationSuccess = {
		token: string;
		userName: string;
	};
}
