export default interface ProfilePageUser {
  loading: boolean;
  name: null | string;
  username: null | string;
  email: null | string;
  error: boolean;
  errorMessage: null | string;
  projects: null | any[];
}
