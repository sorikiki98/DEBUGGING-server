import * as dotenv from 'dotenv';

dotenv.config();

function demand(key: string, defaultValue?: any) {
	const value = process.env[key] || defaultValue;
	if (!value) {
		throw new Error(`${key} is unvalid...`);
	}
	return value;
}

export const config = {
	db: {
		host: demand('DB_HOST'),
		user: demand('DB_USER'),
		password: demand('DB_PASSWORD'),
		database: demand('DB_DATABASE'),
		port: demand('DB_PORT'),
	},
    host: {
        port: demand('HOST_PORT', 8080),
    },
    jwt: {
        expirSecs: demand('JWT_EXPIRATION_MILLISEC'),
        privateKey: demand('JWT_PRIVATE_KEY'),
    },
    bcrypt: {
        saltsRound: demand('BCRYPT_SALTS_ROUND')
    }
};
