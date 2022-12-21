import { RequestHandler } from "express";
import createHttpError from "http-errors";
import successfulResponse from "../helpers/successfulResponse";
import IRequestWithUser from "../interfaces/IRequestWithUser";
import Project from "../models/Project";
import Snippet from "../models/Snippet";

export const addSnippetToProject: RequestHandler = async (
  req: IRequestWithUser,
  res,
  next
) => {
  const { name, description, language, code } = req.body;
  const userId = req.userId;
  const { id } = req.params;

  try {
    if (!name)
      return next(createHttpError.BadRequest("Snippet name is required"));

    if (!language)
      return next(createHttpError.BadRequest("Kindly select a language"));

    if (!code)
      return next(createHttpError.BadRequest("Write some code to save"));

    const project = await Project.findByPk(id);

    if (!project) return next(createHttpError.NotFound("Project not found"));

    const users = await project.getUsers();
    const memberIds = users.map((user) => user.id);

    if (!memberIds.includes(project.authorId))
      return next(createHttpError.Forbidden());

    const snippet = await Snippet.create({
      name,
      description,
      language,
      code,
      projectId: project.id,
    });

    return successfulResponse(res, { message: "Snippet saved", data: snippet });
  } catch (error) {
    return next(createHttpError.InternalServerError());
  }
};
