import { ParsedUrlQuery } from "querystring";

export default interface ParamsWithUsername extends ParsedUrlQuery {
  username: string;
}
