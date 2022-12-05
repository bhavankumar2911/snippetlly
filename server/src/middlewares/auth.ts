import { RequestHandler } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { TokenConfig } from "../config";
import IJWTPayload from "../interfaces/IJWTPayload";
import IRequestWithUser from "../interfaces/IRequestWithUser";
import RefreshToken from "../models/RefreshToken";

const auth: RequestHandler = async (req: IRequestWithUser, res, next) => {
  const cookies = req.cookies;
  let decoded: IJWTPayload = { userId: "" };

  //   token not present
  if (!cookies.access_token || !cookies.refresh_token)
    return next(createHttpError.Unauthorized("You are unauthorized"));

  // verify access token
  try {
    const result = jwt.verify(
      cookies.access_token,
      TokenConfig.accessTokenSecret as string
    ) as IJWTPayload;

    decoded.userId = result.userId;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name == "TokenExpiredError")
        return next(createHttpError.Unauthorized("Token Expired"));
      else {
        return next(
          createHttpError.Unauthorized(
            "You are unauthorized - invalid access token"
          )
        );
      }
    }
  }

  // verify refresh token
  try {
    const decoded = jwt.verify(
      cookies.refresh_token,
      TokenConfig.refreshTokenSecret as string
    ) as IJWTPayload;

    // check token in blacklist
    const refreshToken = await RefreshToken.findOne({
      where: { userId: decoded.userId },
    });

    if (refreshToken?.token != cookies.refresh_token) {
      return next(
        createHttpError.Unauthorized(
          "You are unauthorized - refresh token not in db"
        )
      );
    }

    // authorized
    req.userId = decoded.userId;
    return next();
  } catch (error) {
    return next(
      createHttpError.Unauthorized(
        "You are unauthorized - invalid refresh token"
      )
    );
  }
};

export default auth;
