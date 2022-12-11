import APIRequestState from "./APIRequestState";

export default interface CreateProjectRequestState extends APIRequestState {
  name: null | string;
  description: null | string;
  isPublic: boolean;
  showAlert: boolean;
}
