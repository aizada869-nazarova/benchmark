import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { UserDocument, UserModel } from "../../typings"

const { Schema, model } = mongoose;

const UsersSchema = new Schema<UserDocument>(
	{
		name: { type: String, required: true, default: "User" },
		surname: { type: String, required: true, default: "Surname" },
		email: { type: String, required: true },
		password: { type: String, required: true },
		role: { type: String, required: true, enum: ["Host", "User"], default: "User" },
		avatar: { type: String },
	},
	{ timestamps: true }
);



UsersSchema.pre("save", async function (next) {
	const newUser = this;
	const plainPW = newUser.password;
	if (newUser.isModified("password")) {
		newUser.password = await bcrypt.hash(plainPW, 10);
	}
	next();
});



UsersSchema.methods.toJSON = function () {
	const userDocument = this;
	const userObject = userDocument.toObject();
	// delete userObject.password;
	delete userObject.__v;
	return userObject;
};



UsersSchema.statics.checkCredentials = async function (email, plainPW) {
	const user = await this.findOne({ email });
	if (user) {
		const isMatch = await bcrypt.compare(plainPW, user.password);
		return isMatch ? user : null;

	} else {
		return null;
	}
};



UsersSchema.static("getUser", async function (id) {
	const user = await this.findOne({ _id: id })
	return user;
});

export default model<UserDocument, UserModel>("User", UsersSchema);
