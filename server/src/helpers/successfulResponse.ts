import { Response } from "express";

export default (res: Response, data: any, status: number = 200) =>
  res.status(status).json(data);
