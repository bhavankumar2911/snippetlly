import { RequestHandler } from "express";
import createHttpError from "http-errors";
import successfulResponse from "../helpers/successfulResponse";
import {
  validateData,
  checkExistingUser,
  hashPassword,
  saveUserInDB,
} from "../services/auth";

export const signup: RequestHandler = async (req, res, next) => {
  const data = req.body;

  //   data validation
  const { isValid, message } = validateData(data);
  if (!isValid) return next(createHttpError.UnprocessableEntity(message));

  //   checking existing users
  const { doesExit, error } = await checkExistingUser(
    data.username,
    data.email
  );
  if (error) return next(createHttpError.InternalServerError());
  else if (doesExit)
    return next(
      createHttpError.Conflict("Username or email is already in use")
    );

  // hashing password
  const passwordHash = hashPassword(data.passwordConfirm);

  // save user in db
  if (await saveUserInDB(data, passwordHash))
    return successfulResponse(res, "Account created successfully");
  else return next(createHttpError.InternalServerError());
};
