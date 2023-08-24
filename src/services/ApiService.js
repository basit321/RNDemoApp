import { Alert } from "react-native";
import UtilityMethods from "../Utils/UtilityMethods";
import { RESPONSE } from "./HttpResponse";

class apiService {
  /// Get Authorization Token///
  getAuthorization = async (token) => {
    return "Bearer " + token;
  };

  sendGetRequest = async (url, token = "", queryParams = "") => {
    if (queryParams.length > 0) {
      url = url + queryParams;
    }

    try {
      let headers = {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      };

      if (token) {
        const authorizationToken = await this.getAuthorization(token);
        /// Add Authorization Token In Headers with
        Object.assign(headers, { Authorization: authorizationToken });
      }

      let response = await UtilityMethods.fetch_timeout(url, {
        method: "GET",
        headers: headers,
        timeout: 30000,
      });

      if (response.code === 200 || response.code === 201) {
        return RESPONSE(true, response.message, response.data);
      } else {
        if (response.code === 401) {
          return RESPONSE(false, response.message, []);
        } else {
          return RESPONSE(false, response.message, []);
        }
      }
    } catch (errorResponse) {
      if (errorResponse?.status === 408) {
        Alert.alert("Request Timeout");
      } else {
        // Alert.alert("Network Request Failed");
      }
      return RESPONSE(false, errorResponse.message, []);
    }
  };

  sendPostRequest = async (url, data, token = "", queryParams = "") => {
    if (queryParams.length > 0) {
      url = url + queryParams;
    }

    try {
      let headers = {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      };

      if (token) {
        const getToken = await this.getAuthorization(token);
        const hed = Object.assign(headers, { Authorization: getToken });
      }

      let options = {
        method: "POST",
        headers: headers,
        timeout: 20000,
      };

      if (data && data.getParts().length > 0) {
        Object.assign(options, { body: data });
      }

      let response = await UtilityMethods.fetch_timeout(url, options);
      if (response.code === 200 || response.code === 201) {
        return RESPONSE(true, response.message, response.data);
      } else {
        if (response.code === 401) {
          // Alert.alert("something went wrong");
        } else {
          // Alert.alert("something went wrong");
          return RESPONSE(false, response.message, []);
        }
      }
    } catch (errorResponse) {
      if (errorResponse?.status === 408) {
        Alert.alert("Request Timeout");
      } else {
        // Alert.alert("Network Request Failed");
      }

      return RESPONSE(false, errorResponse.message, []);
    }
  };
}

const Api = new apiService();
export default Api;
