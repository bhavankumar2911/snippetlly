import isEmail from "validator/lib/isEmail";
import isAlphanumeric from "validator/lib/isAlphanumeric";
import user from "../models/user";
import { Op } from "sequelize";
import bcrypt from "bcryptjs";
import User from "../models/user";
import jwt from "jsonwebtoken";
import IJWTPayload from "../interfaces/IJWTPayload";
import RefreshToken from "../models/RefreshToken";

interface ISignupData {
  name: string;
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export const validateData = (data: ISignupData) => {
  const { name, username, email, password, passwordConfirm } = data;
  const validation = {
    isValid: true,
    message: "",
  };

  //   empty fields check
  if (!(name && username && email && password && passwordConfirm)) {
    validation.isValid = false;
    validation.message = "All fields are required";
  }
  // username validation
  else if (!isAlphanumeric(username)) {
    validation.isValid = false;
    validation.message = "Username should contain only alphanumeric characters";
  }
  //   email validation
  else if (!isEmail(email)) {
    validation.isValid = false;
    validation.message = "Email address is invalid";
  }
  // comparing passwords
  else if (password != passwordConfirm) {
    validation.isValid = false;
    validation.message = "Passwords didn't match";
  }

  return validation;
};

// checking existing users
export const checkExistingUser = async (username: string, email: string) => {
  let result = {
    doesExit: false,
    error: false,
  };

  try {
    const existingUser = await user.findOne({
      where: { [Op.or]: [{ username }, { email }] },
    });

    if (existingUser) result.doesExit = true;
  } catch (error) {
    console.log("Cannot check existing user", error);
    result.error = true;
  } finally {
    return result;
  }
};

// password hashing
export const hashPassword = (password: string): string => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  return hash;
};

export const saveUserInDB = async (data: ISignupData, passwordHash: string) => {
  try {
    const { name, username, email } = data;
    await user.create({
      name,
      username,
      email,
      password: passwordHash,
    });

    return true;
  } catch (error) {
    console.log("Cannot save user in DB", error);
    return false;
  }
};

// validate login data
export const validateLoginData = (
  usernameOrEmail: string,
  password: string
) => {
  let validation = {
    isValid: false,
    isEmail: false,
    message: "",
  };

  // check empty fields
  if (!(usernameOrEmail && password)) {
    validation.message = "All fields are required";
    return validation;
  }

  // email not username
  if (isEmail(usernameOrEmail)) {
    validation.isValid = true;
    validation.isEmail = true;
    return validation;
  }
  // not email but username
  else if (isAlphanumeric(usernameOrEmail)) {
    validation.isValid = true;
    return validation;
  }
  // not valid email and username
  else {
    validation.message = "Invalid username or email";
    return validation;
  }
};

// check user by username or email
export const checkUserByUsernameOrEmail = async (
  isEmail: boolean,
  usernameOrEmail: string
) => {
  interface IResult {
    doesExist: boolean;
    error: boolean;
    user: User | null;
  }

  let result: IResult = {
    doesExist: false,
    error: false,
    user: null,
  };

  try {
    let existingUser: User | null;

    if (isEmail) {
      existingUser = await user.findOne({ where: { email: usernameOrEmail } });
    } else {
      existingUser = await user.findOne({
        where: { username: usernameOrEmail },
      });
    }

    if (existingUser) {
      result.doesExist = true;
      result.user = existingUser;
    }
  } catch (error) {
    console.log("Cannot check existing user", error);
    result.error = true;
  } finally {
    return result;
  }
};

// sign token
export const signToken = (
  secret: string,
  payload: IJWTPayload,
  expiresIn: number | string
) => jwt.sign(payload, secret, { expiresIn });

// save refresh token
export const saveRefreshToken = async (userId: string, token: string) => {
  try {
    await RefreshToken.create({ userId, token });

    return true;
  } catch (error) {
    return false;
  }
};
