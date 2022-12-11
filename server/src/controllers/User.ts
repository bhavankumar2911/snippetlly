import { RequestHandler } from "express";
import createHttpError from "http-errors";
import successfulResponse from "../helpers/successfulResponse";
import IRequestWithUser from "../interfaces/IRequestWithUser";
import Project from "../models/Project";
import User from "../models/User";

export const ReadOtherUser: RequestHandler = async (req, res, next) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({
      where: { username },
      attributes: ["name", "username", "email"],
      include: Project,
    });

    if (!user) return next(createHttpError.NotFound("User not found"));

    return successfulResponse(res, { data: { ...user.toJSON() } });
  } catch (error) {
    return next(createHttpError.InternalServerError());
  }
};

export const ReadOwnProfile: RequestHandler = async (
  req: IRequestWithUser,
  res,
  next
) => {
  try {
    const userId = req.userId;

    const user = await User.findOne({
      where: { id: userId },
      attributes: ["name", "username", "email"],
      include: Project,
    });

    if (!user) return next(createHttpError.NotFound("User not found"));

    return successfulResponse(res, { data: { ...user.toJSON() } });
  } catch (error) {
    return next(createHttpError.InternalServerError());
  }
};
