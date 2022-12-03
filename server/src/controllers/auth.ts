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
  signToken,
  saveRefreshToken,
} from "../services/auth";
import { TokenConfig } from "../config";
import { sign } from "crypto";

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

  // sign tokens
  const accessToken = signToken(
    TokenConfig.accessTokenSecret as string,
    {
      userId: user ? user.id : "",
    },
    30
  );
  const refreshToken = signToken(
    TokenConfig.refreshTokenSecret as string,
    {
      userId: user ? user.id : "",
    },
    60
  );

  // save refresh token in db
  if (!(await saveRefreshToken(user ? user.id : "", refreshToken)))
    return next(createHttpError.InternalServerError());

  // set token cookies
  res.cookie("access_token", accessToken, {
    httpOnly: true,
    maxAge: 30 * 1000,
  });
  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    maxAge: 60 * 1000,
  });

  return successfulResponse(res, {
    loggedIn: true,
    message: `Welcome ${user ? user.name : ""}!`,
  });
};
