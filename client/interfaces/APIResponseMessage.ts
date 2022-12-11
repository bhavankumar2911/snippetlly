export default interface APIResponseMessage {
  show: boolean;
  type: null | "error" | "success";
  message: null | string;
}
