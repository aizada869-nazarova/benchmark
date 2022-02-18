import User from "../users/schema.js";
import mongoose from "mongoose";
import { IUser } from "../../typings"

const { Schema, model } = mongoose;

const AccomodationSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		city: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		maxGuests: { type: Number , default: 1, required: true, },
		user: { type: Schema.Types.ObjectId, ref: "User" },
	},
	{ timestamps: true }
);

AccomodationSchema.pre("save", async function (done) {
	try {
		const isExist = await User.findById(this.user);
		if (isExist) {
			done();
		} else {
			const error = new Error("this author does not exist");
			error.status = 400;
			done(error);
		}
	} catch (error) {
		done(error);
	}
});

export default model("Accomodation", AccomodationSchema);
