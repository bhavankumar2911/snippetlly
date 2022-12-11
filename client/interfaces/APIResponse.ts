export default interface APIResponse {
  responseOK: null | boolean;
  noResponse: null | boolean;
  notAuthorized: null | boolean;
  message: null | string;
  data: any;
}
