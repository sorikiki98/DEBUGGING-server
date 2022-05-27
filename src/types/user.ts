import { Request, Response } from "express"

export type UserRegistration = {
    userName: string,
    password: string,
    name: string,
    contactNumbers: string,
    email: string,
    address: string,
    sizeOfHouse?: number,
    numOfRooms?: number
}
export type RequestWithUserRegistration = Request<{}, {}, UserRegistration>; 

export type User = { id: number } & UserRegistration

export type UserAuthenticationSuccess = {
    token: string,
    userName: string
}

export type ResponseWithUserAuthentication = Response<UserAuthenticationSuccess>