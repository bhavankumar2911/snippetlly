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

    if (!memberIds.includes(userId as string))
      return next(createHttpError.Forbidden());

    const snippet = await Snippet.create({
      name,
      description,
      language,
      code,
      ProjectId: project.id,
      UserId: userId,
    });

    return successfulResponse(res, { message: "Snippet saved", data: snippet });
  } catch (error) {
    return next(createHttpError.InternalServerError());
  }
};

// delete snippet
export const deleteSnippet: RequestHandler = async (
  req: IRequestWithUser,
  res,
  next
) => {
  const { id } = req.params;
  const { userId } = req;

  try {
    const snippet = await Snippet.findByPk(id);

    if (!snippet) return next(createHttpError.BadRequest());

    const project = await snippet.getProject();

    if (snippet.UserId != userId || project.authorId != userId)
      return next(createHttpError.Forbidden());

    await Snippet.destroy({ where: { id } });

    return successfulResponse(res, { message: "Code snippet deleted" });
  } catch (error) {
    return next(createHttpError.InternalServerError());
  }
};

export const editSnippet: RequestHandler = async (
  req: IRequestWithUser,
  res,
  next
) => {
  const { name, description, language, code } = req.body;
  const userId = req.userId;
  const { id } = req.params;

  try {
    const snippet = await Snippet.findByPk(id);

    if (!snippet) return next(createHttpError.NotFound("Snippet not found"));

    const project = await snippet.getProject();

    if (snippet.UserId != userId || project.authorId != userId)
      return next(createHttpError.Forbidden());

    if (!name)
      return next(createHttpError.BadRequest("Snippet name is required"));

    if (!language)
      return next(createHttpError.BadRequest("Kindly select a language"));

    if (!code)
      return next(createHttpError.BadRequest("Write some code to save"));

    await Snippet.update(
      { name, description, language, code },
      { where: { id } }
    );

    return successfulResponse(res, { message: "Code snippet updated" });
  } catch (error) {
    return next(createHttpError.InternalServerError());
  }
};
