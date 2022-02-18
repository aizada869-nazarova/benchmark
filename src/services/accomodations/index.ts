import { accomodationHost, hostOnly } from "../../auth/host.js"

import Accomodation from "./schema.js";
import { JWTAuthenticate } from "../../auth/tools.js";
import {JWTMiddleware} from "../../auth/middlewares.js"
import createError from "http-errors";
import express from "express";

const accomodationsRouter = express.Router();



accomodationsRouter.post("/", JWTMiddleware, hostOnly, async (req, res, next) => {
    try {
        const newAccomodation = new Accomodation({...req.body, user: req.user._id});
        const { _id } = await newAccomodation.save();

        res.status(201).send({_id});
    } catch (error) {
        console.log(error);
        if (error.name === "ValidationError") {
            next(createError(400, error));
        } else {
            next(createError(500, "An error occurred while saving accomodations"));
        }
    }
});


accomodationsRouter.get("/", JWTMiddleware, async (req, res, next) => {
	try {
		const accomodation = await Accomodation.find({}).populate("user");
		res.send(accomodation);
	} catch (error) {
		console.log(error);
		next(createError(500, "An error occurred while getting accomodations"));
	}
});


accomodationsRouter.get("/:id", JWTMiddleware, async (req, res, next) => {
	try {
		const id = req.params.id;
		const accomodation = await Accomodation.findById(id).populate("user");
		if (accomodation) {
			res.send(accomodation);
		} else {
			next(createError(404, `Accomodation ${req.params.id} not found`));
		}
	} catch (error) {
		console.log(error);
		next(createError(500, "An error occurred while getting accomodation"));
	}
});

accomodationsRouter.put("/:id", JWTMiddleware, async (req, res, next) => {
	try {
		const accomId = req.params.id
		const modifiedAccommodation = await Accomodation.findOneAndUpdate({_id: accomId, user:{_id: req.user._id}}, req.body, {new: true, runValidators: true})
		if (modifiedAccommodation){
			res.send(modifiedAccommodation)
		} else {
			next(createError(404, 'Accommodation not found! OR You are NOT Authorized!'))
		}
	} catch (error) {
		console.log(error);
		next(createError(500, "An error occurred while modifying accomodation"))
	}


accomodationsRouter.delete("/:id", JWTMiddleware, async (req, res, next) => {
	try {
		const accomId = req.params.id
		const deletedAccommodation = await Accomodation.findOneAndDelete({_id: accomId, user:{_id: req.user._id}})
		if (deletedAccommodation){
			res.status(204).send()
		} else {
			next(createError(404, 'Accommodation not found! OR You are NOT Authorized!'))
		}
	} catch (error) {
		console.log(error);
		next(createError(500, "An error occurred while deleting accomodation"))
	}
	
});

export default accomodationsRouter;
