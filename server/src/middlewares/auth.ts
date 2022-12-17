import { RequestHandler } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { TokenConfig } from "../config";
import successfulResponse from "../helpers/successfulResponse";
import IJWTPayload from "../interfaces/IJWTPayload";
import IRequestWithUser from "../interfaces/IRequestWithUser";
import RefreshToken from "../models/RefreshToken";
import { saveRefreshToken, signToken } from "../services/auth";

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
      if (error.name == "TokenExpiredError") {
        // verify refresh token
        try {
          const decoded = jwt.verify(
            cookies.refresh_token,
            TokenConfig.refreshTokenSecret as string
          ) as IJWTPayload;
          const { userId } = decoded;

          console.log(userId);

          // compare with the blacklist
          let tokenRecord;
          try {
            tokenRecord = await RefreshToken.findByPk(userId);
          } catch (error) {
            return next(createHttpError.InternalServerError());
          }

          console.log(tokenRecord?.toJSON(), cookies.refresh_token);

          if (!tokenRecord || tokenRecord.token != cookies.refresh_token) {
            console.log("2...");

            return next(createHttpError.Unauthorized("You are unauthorized"));
          }

          // sign new tokens
          const newAccessToken = signToken(
            TokenConfig.accessTokenSecret as string,
            {
              userId,
            },
            60
          );
          const newRefreshToken = signToken(
            TokenConfig.refreshTokenSecret as string,
            {
              userId,
            },
            2 * 60
          );

          // save refresh token in db
          if (!(await saveRefreshToken(userId, newRefreshToken)))
            return next(createHttpError.InternalServerError());

          // set token cookies
          res.cookie("access_token", newAccessToken, {
            httpOnly: true,
            maxAge: 2 * 60 * 1000,
          });
          res.cookie("refresh_token", newRefreshToken, {
            httpOnly: true,
            maxAge: 2 * 60 * 1000,
          });

          req.userId = userId;

          if (req.originalUrl == "/api/auth")
            return successfulResponse(res, { message: "Authorized" });
          else return next();
        } catch (error) {
          if (error instanceof Error) {
            console.log("3...");

            return next(createHttpError.Unauthorized("You are unauthorized"));
          }
        }
      } else {
        return next(createHttpError.Unauthorized("You are unauthorized"));
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
      return next(createHttpError.Unauthorized("You are unauthorized"));
    }

    // authorized
    req.userId = decoded.userId;

    if (req.originalUrl == "/api/auth")
      return successfulResponse(res, { message: "Authorized" });
    else return next();
  } catch (error) {
    return next(createHttpError.Unauthorized("You are unauthorized"));
  }
};

export default auth;
