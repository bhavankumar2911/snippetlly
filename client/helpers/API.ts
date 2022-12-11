import axios, { AxiosError } from "axios";
import { NextRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";
import Config from "../config";
import APIResponse from "../interfaces/APIResponse";
import APIResponseMessage from "../interfaces/APIResponseMessage";

const API = {
  sendRequest: async (
    method: "get" | "post" | "delete" | "put",
    path: string,
    withCredentials: boolean,
    data: any = null
  ): Promise<APIResponse> => {
    // initial response data
    let apiResponse: APIResponse = {
      responseOK: null,
      noResponse: null,
      notAuthorized: null,
      message: null,
      data: null,
    };

    let response;
    try {
      switch (method) {
        case "get":
          response = await axios.get(`${Config.apiHost}${path}`, {
            withCredentials,
          });
          break;
        case "post":
          response = await axios.post(`${Config.apiHost}${path}`, data, {
            withCredentials,
          });
          break;
        case "delete":
          response = await axios.delete(`${Config.apiHost}${path}`, {
            withCredentials,
          });
          break;
        case "put":
          response = await axios.put(`${Config.apiHost}${path}`, data, {
            withCredentials,
          });
          break;
      }
      const responseData = response.data;

      apiResponse.responseOK = true;
      apiResponse.noResponse = false;
      apiResponse.notAuthorized = false;
      apiResponse.message = responseData.message ? responseData.message : null;
      apiResponse.data = responseData.data ? responseData.data : null;
    } catch (error) {
      if (error instanceof AxiosError) {
        apiResponse.responseOK = false;
        // returned by server
        if (error.response) {
          apiResponse.noResponse = false;
          // not authorized
          if (error.response.status == 401) {
            apiResponse.notAuthorized = true;
          }
          // some other error
          else {
            apiResponse.notAuthorized = false;
            apiResponse.message = error.response.data.error.message;
          }
        }
        // not returned by server
        else {
          apiResponse.noResponse = true;
          apiResponse.notAuthorized = true;
          if (error.request) {
            apiResponse.message = "No response from server";
          } else {
            apiResponse.message = "Something went wrong";
          }
        }
      }
    } finally {
      return { ...apiResponse };
    }
  },
  handleResponse: (
    apiResponse: APIResponse,
    setLoader: Dispatch<SetStateAction<boolean>>,
    setData: Dispatch<SetStateAction<any>>,
    setApiResponseMessage: Dispatch<SetStateAction<APIResponseMessage>>,
    router: NextRouter
  ) => {
    const { responseOK, noResponse, notAuthorized, data, message } =
      apiResponse;

    setLoader(false);

    if (responseOK) {
      setData(data);
      setApiResponseMessage({
        show: true,
        type: "success",
        message,
      });
    } else if (noResponse) {
      setApiResponseMessage({
        show: true,
        type: "error",
        message,
      });
    } else if (notAuthorized) {
      router.push("/login");
    } else {
      setLoader(false);
      setApiResponseMessage({
        show: true,
        type: "error",
        message,
      });
    }
  },
};

export default API;
