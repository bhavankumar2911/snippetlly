import { Response } from "express";

export default (res: Response, data: string | object, status: number = 200) =>
  res.status(status).json({ data });
