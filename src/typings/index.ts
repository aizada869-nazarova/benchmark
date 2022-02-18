import { Document, Model } from "mongoose"

export interface IUser {
    name: string
	surname: string
	email: string
	password: string
	role: string[]
	avatar: string
}

export interface UserDocument extends Document, IUser {}

export interface UserModel extends Model<UserDocument> {
    checkCredentials(email: string, plainPW: string): Promise<UserDocument | null>
}

export interface IAccommodation {
    name: string
    city: string
    description: string
    maxGuests: number
    user: string
}

export interface AccommodationDocument extends Document, IAccommodation {}

export interface AccommodationModel extends Model<AccommodationDocument> {

}

