import { RequestHandler } from "express";
import createHttpError from "http-errors";
import successfulResponse from "../helpers/successfulResponse";
import IRequestWithUser from "../interfaces/IRequestWithUser";
import models from "../models";
import jwt from "jsonwebtoken";
import { TokenConfig } from "../config";
import IJWTPayload from "../interfaces/IJWTPayload";
import User from "../models/User";
import Project from "../models/Project";

// create new project
export const create: RequestHandler = async (
  req: IRequestWithUser,
  res,
  next
) => {
  const { name, description, isPublic } = req.body;

  // data validation
  if (!name)
    return next(createHttpError.UnprocessableEntity("Project requires a name"));

  if (typeof isPublic != "boolean")
    return next(
      createHttpError.UnprocessableEntity(
        "Project scope is required. Kindly select public or private"
      )
    );

  try {
    const project = await models.Project.create({
      name,
      description,
      isPublic,
      authorId: req.userId as string,
    });
    await project.addUser(req.userId);

    return successfulResponse(res, {
      message: "Project created",
      data: project,
    });
  } catch (error) {
    return next(createHttpError.InternalServerError());
  }
};

// read a project
export const readOne: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    const project = await models.Project.findOne({
      where: { id },
      include: User,
    });

    if (!project) return next(createHttpError.NotFound("Project not found"));

    if (project.isPublic) return successfulResponse(res, { data: project });

    const cookies = req.cookies;
    if (!cookies.access_token || !cookies.refresh_token)
      return next(createHttpError.Unauthorized());

    const { access_token, refresh_token } = cookies;

    try {
      const accessTokenDecoded = jwt.verify(
        access_token,
        TokenConfig.accessTokenSecret as string
      ) as IJWTPayload;

      // verify refresh token
      try {
        const decoded = jwt.verify(
          refresh_token,
          TokenConfig.refreshTokenSecret as string
        ) as IJWTPayload;

        if (accessTokenDecoded.userId != decoded.userId)
          return next(createHttpError.Unauthorized());

        const membersOfProject = await project.getUsers();

        const memberIdsOfProject = membersOfProject.map(
          (member) => member.toJSON().id
        );

        if (!memberIdsOfProject.includes(decoded.userId))
          return next(createHttpError.Unauthorized());

        return successfulResponse(res, { data: project });
      } catch (error) {
        return next(createHttpError.Unauthorized());
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.name == "TokenExpiredError")
          return next(createHttpError.Unauthorized(error.name));

        return next(createHttpError.Unauthorized());
      }
    }
  } catch (error) {
    console.log(error);

    return next(createHttpError.InternalServerError());
  }
};

// delete one project
export const deleteOne: RequestHandler = async (
  req: IRequestWithUser,
  res,
  next
) => {
  const { userId } = req;
  const { id } = req.params;

  try {
    const project = await Project.findByPk(id);

    if (!project)
      return next(createHttpError.BadRequest("Project doesn't exist"));

    if (userId != project.authorId) return next(createHttpError.Unauthorized());

    const result = await Project.destroy({ where: { id } });

    console.log(result);

    return successfulResponse(res, { message: "Project deleted" });
  } catch (error) {
    return next(createHttpError.InternalServerError());
  }
};
