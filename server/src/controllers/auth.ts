import { RequestHandler } from "express";
import createHttpError from "http-errors";
import successfulResponse from "../helpers/successfulResponse";
import bcrypt from "bcryptjs";
import {
  validateData,
  checkExistingUser,
  hashPassword,
  saveUserInDB,
  validateLoginData,
  checkUserByUsernameOrEmail,
} from "../services/auth";
import { Model } from "sequelize";

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

export const login: RequestHandler = async (req, res, next) => {
  const { usernameOrEmail, password } = req.body;

  // validate login data
  const { isValid, isEmail, message } = validateLoginData(
    usernameOrEmail,
    password
  );
  if (!isValid) return next(createHttpError.UnprocessableEntity(message));

  // check if user exist
  const { error, doesExist, user } = await checkUserByUsernameOrEmail(
    isEmail,
    usernameOrEmail
  );
  if (error) return next(createHttpError.InternalServerError());
  else if (!doesExist)
    return next(createHttpError.NotFound("No user was found"));

  // compare passwords
  if (!bcrypt.compareSync(password, user ? user.password : ""))
    return next(createHttpError.BadRequest("Invalid credentials"));

  res.cookie("token", "value", { httpOnly: true });
  res.cookie("jhghj", "jhgkh");
  return res.json({ message: "logged in" });
};
