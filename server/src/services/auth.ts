import isEmail from "validator/lib/isEmail";
import isAlphanumeric from "validator/lib/isAlphanumeric";
import user from "../models/user";
import { Op } from "sequelize";
import bcrypt from "bcryptjs";

interface ISignupData {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export const validateData = (data: ISignupData) => {
  const { username, email, password, passwordConfirm } = data;
  const validation = {
    isValid: true,
    message: "",
  };

  //   empty fields check
  if (!(username && email && password && passwordConfirm)) {
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
    const { username, email } = data;
    await user.create({
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
