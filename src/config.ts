import * as dotenv from 'dotenv';

dotenv.config();

function require(key: string, defaultValue?: any) {
	const value = process.env[key] || defaultValue;
	if (!value) {
		throw new Error(`${key} is unvalid...`);
	}
	return value;
}

export const config = {
	db: {
		host: require('DB_HOST'),
		user: require('DB_USER'),
		password: require('DB_PASSWORD'),
		database: require('DB_DATABASE'),
		port: require('DB_PORT'),
	},
    host: {
        port: require('HOST_PORT', 8080),
    },
    jwt: {
        expirSecs: require('JWT_EXPIRATION_MILLISEC'),
        privateKey: require('JWT_PRIVATE_KEY'),
    },
    bcrypt: {
        saltsRound: require('BCRYPT_SALTS_ROUND')
    }
};
