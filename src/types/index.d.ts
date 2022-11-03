import { JsonWebTokenError, Jwt } from 'jsonwebtoken';

declare global {
	namespace Express {
		interface Request {
			userId?: number;
		}
	}
}

export type Bug = {
	id: number;
	name: string;
	appearance: string;
	movement: string;
	habitat: string;
	color: string;
	surveyResult: string;
} | undefined;

export type Survey = {
	userId: number;
	bugId: string;
	surveyDate: Date;
};

export type Company = {
	id: number;
	name: string;
	shortIntro: string;
	description: string;
	contactNumbers: string;
	killableBugs: string;
	availableArea: string;
	availableCounselTime: string;
	thumbnail?: string;
	isCompanyInterested?: number = 0;
	numOfInterestedUsers?: number = 0;
} | undefined;

export type CompanyInterestFK = [number, string];

export type ReservationForm = {
	bugName: string;
	firstFoundDate: string;
	firstFoundPlace: string;
	wantedDate: string;
	wantedTime: string;
	hasBugBeenShown: boolean;
	reservationDateTime?: string;
	extraMessage?: string;
};

export type ReservationWithFK = ReservationForm & {
	userId: number;
	companyId: string;
};

export type ReservationDetail = ReservationForm & {
	userId: number;
	userName: string;
	userContactNumbers: string;
	userEmail: string;
	userAddress?: string;
	sizeOfHouse?: number;
	numOfRooms?: number;
	companyId: number;
	companyName: string;
	shortIntro: string;
	description: string;
	companyContactNumbers: string;
	killableBugs: string;
	availableArea: string;
	availableCounselTime: string;
	thumbnail?: string;
	processState?: number = 0;
	engineerName?: string;
	engineerContactNumbers?: string;
	expectedEstimate?: string;
	visitDateTime?: string;
} | undefined;

export type CompanyInterest = {
	id: number;
	userId: number;
	companyId: number;
};

export type Product = {
	id: number;
	name: string;
	type: string;
	shortIntro: string;
	description: string;
	thumbnail?: string;
	isProductInterested?: int = 0;
	numOfInterestedUsers?: number = 0;
} | undefined;

export type ProductInterestFK = [number, string];

export type ProductInterest = {
	id: number;
	userId: number;
	productId: number;
};

export type UserRegistration = {
	userName: string;
	password: string;
	name: string;
	contactNumbers: string;
	email: string;
	address?: string;
	sizeOfHouse?: number;
	numOfRooms?: number;
};

export type User = ({ id: number } & UserRegistration) | undefined;

export type SurveyItem = {
	surveyId: number;
	bugId: number;
	bugName: string;
	surveyDate: string;
};

export type ProductItem = {
	productInterestId: number;
	productId: number;
	userId: number;
	productName: string;
	thumbnail: string;
	numOfInterestedUsers: number;
};

export type ReservationItem = {
	reservationId: number;
	userId: number;
	companyName: string;
	bugName: string;
	processState: number;
	reservationDateTime: string;
	visitDateTime: string;
};

export type UserDetail = User & {
	accumulatedNumOfUsages: number;
	numOfInterestedCompanies: number;
	surveyList: SurveyItem[];
	productList: ProductItem[];
	reservationList: ReservationItem[];
};

export type UserLogin = {
	userName: string;
	password: string;
};

export type UserAuthenticationSuccess = {
	token: string;
	userName: string;
};

export type JwtPayloadWithUserId = Jwt.JwtPayload & { userId: number };

export type ResolveCallback<T> = (
	resolve: (value: T | PromiseLike<T>) => void,
	result: any
) => any;

export type CompanyQueryParamType =
	| number
	| string
	| undefined
	| ReservationWithFK
	| CompanyInterestFK;

export type BugQueryParamType = undefined | number | string | Survey;

export type UserQueryParamType = number | string | UserRegistration;

export type ProductQueryParamType =
	| number
	| string
	| undefined
	| ProductInterestFK;

export type QueryParamType =
	| CompanyQueryParamType
	| BugQueryParamType
	| UserQueryParamType
	| ProductQueryParamType;

export type CompanyPromiseReturnType =
	| Company
	| Company[]
	| CompanyInterest[]
	| ReservationDetail[]
	| ReservationItem[]
	| number
	| boolean
	| undefined;

export type BugPromiseReturnType = number | Bug | Bug[] | SurveyItem[];

export type UserPromiseReturnType = number | undefined | User;

export type ProductPromiseReturnType =
	| Product
	| Product[]
	| ProductInterest[]
	| ProductItem[]
	| boolean
	| number
	| undefined;

export type PromiseReturnType =
	| CompanyPromiseReturnType
	| BugPromiseReturnType
	| UserPromiseReturnType
	| ProductPromiseReturnType;
