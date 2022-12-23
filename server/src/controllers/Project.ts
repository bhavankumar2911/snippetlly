import { Request, RequestHandler } from "express";
import createHttpError from "http-errors";
import successfulResponse from "../helpers/successfulResponse";
import IRequestWithUser from "../interfaces/IRequestWithUser";
import models from "../models";
import jwt from "jsonwebtoken";
import { TokenConfig } from "../config";
import IJWTPayload from "../interfaces/IJWTPayload";
import User from "../models/User";
import Project from "../models/Project";
import Snippet from "../models/Snippet";
import RefreshToken from "../models/RefreshToken";
import { saveRefreshToken, signToken } from "../services/auth";

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
  const cookies = req.cookies;
  const { id } = req.params;
  // let userId: null | string = null;

  interface Response {
    project: Project | null;
    isAuthor: boolean;
    isMember: boolean;
    userId: string | null;
  }

  const response: Response = {
    project: null,
    isAuthor: false,
    isMember: false,
    userId: null,
  };

  // fetch projects
  try {
    const project = await Project.findByPk(id, {
      include: [
        { model: Snippet },
        { model: User, attributes: ["username", "name", "id"] },
      ],
    });

    if (!project) return next(createHttpError.NotFound());

    let projectMembers: User[] | string[] = await project.getUsers();
    projectMembers = projectMembers.map((member) => member.id);

    const isPublic = project.isPublic;

    if (!cookies.access_token || !cookies.refresh_token) {
      if (!isPublic) {
        return next(createHttpError.Forbidden());
      } else {
        response.isAuthor = false;
        response.isMember = false;
        response.project = project;

        return successfulResponse(res, { data: response });
      }
    } else {
      const { access_token, refresh_token } = cookies;

      // verify access token
      try {
        jwt.verify(
          access_token,
          TokenConfig.accessTokenSecret as string
        ) as IJWTPayload;
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

              // compare with the blacklist
              let tokenRecord;
              try {
                tokenRecord = await RefreshToken.findByPk(userId);
              } catch (error) {
                return next(createHttpError.InternalServerError());
              }

              console.log(tokenRecord?.toJSON(), cookies.refresh_token);

              if (!tokenRecord || tokenRecord.token != cookies.refresh_token) {
                if (!isPublic) {
                  return next(createHttpError.Forbidden());
                } else {
                  response.isAuthor = false;
                  response.isMember = false;
                  response.project = project;

                  return successfulResponse(res, { data: response });
                }
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

              // authorized user
              if (projectMembers.includes(userId)) {
                response.isMember = true;
                response.userId = userId;

                if (userId == project.authorId) {
                  response.isAuthor = true;
                }

                response.project = project;

                return successfulResponse(res, { data: response });
              } else {
                if (!isPublic) {
                  return next(createHttpError.Forbidden());
                } else {
                  response.isAuthor = false;
                  response.isMember = false;
                  response.project = project;

                  return successfulResponse(res, { data: response });
                }
              }
            } catch (error) {
              if (error instanceof Error) {
                if (!isPublic) {
                  return next(createHttpError.Forbidden());
                } else {
                  response.isAuthor = false;
                  response.isMember = false;
                  response.project = project;

                  return successfulResponse(res, { data: response });
                }
              }
            }
          } else {
            if (!isPublic) {
              return next(createHttpError.Forbidden());
            } else {
              response.isAuthor = false;
              response.isMember = false;
              response.project = project;

              return successfulResponse(res, { data: response });
            }
          }
        }
      }

      // verify refresh token
      try {
        const decoded = jwt.verify(
          refresh_token,
          TokenConfig.refreshTokenSecret as string
        ) as IJWTPayload;
        const { userId } = decoded;

        // check token in blacklist
        const refreshToken = await RefreshToken.findOne({
          where: { userId: decoded.userId },
        });

        if (refreshToken?.token != cookies.refresh_token) {
          if (!isPublic) {
            return next(createHttpError.Forbidden());
          } else {
            response.isAuthor = false;
            response.isMember = false;
            response.project = project;

            return successfulResponse(res, { data: response });
          }
        }

        // authorized user
        if (projectMembers.includes(userId)) {
          response.isMember = true;
          response.userId = userId;

          if (userId == project.authorId) {
            response.isAuthor = true;
          }

          response.project = project;

          return successfulResponse(res, { data: response });
        } else {
          if (!isPublic) {
            return next(createHttpError.Forbidden());
          } else {
            response.isAuthor = false;
            response.isMember = false;
            response.project = project;

            return successfulResponse(res, { data: response });
          }
        }
      } catch (error) {
        if (!isPublic) {
          return next(createHttpError.Forbidden());
        } else {
          response.isAuthor = false;
          response.isMember = false;
          response.project = project;

          return successfulResponse(res, { data: response });
        }
      }
    }
  } catch (error) {
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

// add members to project
export const addMember: RequestHandler = async (
  req: IRequestWithUser,
  res,
  next
) => {
  const { id } = req.params;
  const { userId } = req;
  const { username } = req.body;

  if (!username)
    return next(createHttpError.UnprocessableEntity("Username is required"));

  try {
    const project = await Project.findByPk(id);

    if (!project) return next(createHttpError.NotFound("Project not found"));

    const authorId = project.authorId;

    if (authorId !== userId) return next(createHttpError.Unauthorized());

    const user = await User.findOne({
      where: { username },
      attributes: ["username", "name", "id"],
    });

    if (!user) return next(createHttpError.NotFound("No user found"));

    await project.addUser(user.id);

    return successfulResponse(res, {
      message: "User added to this project",
      data: user,
    });
  } catch (error) {
    console.log(error);

    return next(createHttpError.InternalServerError());
  }
};

// remove member
export const removeMember: RequestHandler = async (
  req: IRequestWithUser,
  res,
  next
) => {
  const { id } = req.params;
  const { userId } = req;
  const { username } = req.body;

  if (!username)
    return next(createHttpError.UnprocessableEntity("Username is required"));

  try {
    const project = await Project.findByPk(id);

    if (!project) return next(createHttpError.NotFound("Project not found"));

    const authorId = project.authorId;

    if (authorId !== userId) return next(createHttpError.Unauthorized());

    const user = await User.findOne({
      where: { username },
      attributes: ["username", "name", "id"],
    });

    if (!user) return next(createHttpError.NotFound("No user found"));

    if (user.id == authorId)
      return next(createHttpError.BadRequest("Owner cannot be removed"));

    await project.removeUser(user.id);

    return successfulResponse(res, {
      message: "User removed from this project",
      // data: user,
    });
  } catch (error) {
    console.log(error);

    return next(createHttpError.InternalServerError());
  }
};
