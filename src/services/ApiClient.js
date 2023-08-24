import ApiService from "./ApiService";
import BaseUrl from "./BaseUrl";
import EndPoints from "./EndPoints";
import { RESPONSE } from "./HttpResponse";

class apiClient {

// ----> Authentication -->

  login = async (email, password, socialToken, userId) => {
    if (socialToken == "") {
      const url = BaseUrl + EndPoints.LOGIN;
      console.log(email, " email ", password, "password");
      let formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      return await ApiService.sendPostRequest(url, formData);
    } else if (socialToken != "" && userId != "") {
      const url = BaseUrl + EndPoints.FACEBOOK_LOGIN;
      let formData = new FormData();
      formData.append("token", socialToken);
      formData.append("user_id", userId);
      return await ApiService.sendPostRequest(url, formData);
    } else {
      const url = BaseUrl + EndPoints.GOOGLE_LOGIN;
      let formData = new FormData();
      formData.append("token", socialToken);
      return await ApiService.sendPostRequest(url, formData);
    }
  };
  logout = async (token) => {
    const url = BaseUrl + EndPoints.LOGOUT;
    console.log(url);
    let form = new FormData();
    return await ApiService.sendPostRequest(url, form, token);
  };

  otpVerification = async (code, email) => {
    console.log("email", email);
    try {
      const response = await fetch(BaseUrl + EndPoints.OPT_VERIFY, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp: code, email: email }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          return data;
        });
      if (response.code === 200 || response.code === 201) {
        return RESPONSE(true, response.message, response.data);
      } else {
        return RESPONSE(false, response.message, []);
      }
    } catch (errorResponse) {
      if (errorResponse?.status === 408) {
        Alert.alert("Request Timeout");
      } else {
        console.log("errorResponse", errorResponse);
        // Alert.alert("Network Request Failed");
      }

      return RESPONSE(false, errorResponse.message, []);
    }
  };
  setProfile = async (data) => {
    const url = BaseUrl + EndPoints.Set_PROFILE;
    let formData = new FormData();
    data.name && formData.append("name", data.name);
    data.gender && formData.append("gender", data.gender);
    data.role && formData.append("role", data.role);
    if (data.image) {
      if (data.image.hasOwnProperty("path")) {
        formData.append("profile_url", {
          uri: data.image.path,
          type: data.image.mime,
          name: "profile image",
        });
      } else {
        formData.append("profile_url", data.image);
      }
    }
    data.fcm_token && formData.append("fcm_token", data.fcm_token);
    if (data.hasOwnProperty("notification")) {

      data.notification !== null && formData.append("notification", data.notification);
    }
    else {

    }


    return await ApiService.sendPostRequest(url, formData, data.token);
  };
  resendOtp = async (email) => {
    const url = BaseUrl + EndPoints.RESEND_OTP;

    let formData = new FormData();
    formData.append("email", email);

    return await ApiService.sendPostRequest(url, formData);
  };

  forgotPassword = async (email) => {
    const url = BaseUrl + EndPoints.FORGET_PASSWORD;

    let formData = new FormData();
    formData.append("email", email);

    return await ApiService.sendPostRequest(url, formData);
  };
  chnagePassword = async (data) => {
    const url = BaseUrl + EndPoints.CHANGE_PASSWORD;

    let formData = new FormData();
    formData.append("current_password", data.current_password);
    formData.append("new_password", data.new_password);
    formData.append("confirm_password", data.confirm_password);

    return await ApiService.sendPostRequest(url, formData, data.token);
  };

// --> Add Document-->

  addShop = async (
    shopName,
    address,
    logo,
    latitude,
    longitude,
    category_id,
    token,
    is_variant
  ) => {
    const url = BaseUrl + EndPoints.ADD_SHOP;
    let formData = new FormData();

    formData.append("name", shopName);
    formData.append("address", address);
    formData.append("logo", {
      uri: logo.path,
      type: logo.mime,
      name: "shopLogo",
    });
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("category_id", category_id);
    formData.append("is_variant", is_variant);

    return await ApiService.sendPostRequest(url, formData, token);
    console.log(formData)
  };
  addBankInformation = async (data, token) => {

    getAllDocuments = async (token) => {
      const url = BaseUrl + EndPoints.GET_ALL_DOCUMENTS;
      return await ApiService.sendGetRequest(url, token);
    };
  
      const url = BaseUrl + EndPoints.ADD_BANK;
      let formData = new FormData();
      formData.append("bank_name", data.bankName);
      formData.append("clearance_code", data.bankClearingCode);
      formData.append("code", data.bankCode);
      formData.append("account", data.accountNumber);
      formData.append("iban", data.ibanNumber);
      formData.append("address", data.bankAddress);
  
      return await ApiService.sendPostRequest(url, formData, token);
   };
   addDocument = async (data) => {
    const url = BaseUrl + EndPoints.UPLOAD_DOCUMENT;
    console.log(url);
    let formData = new FormData();
    formData.append("type", data.type);
    formData.append("name", data.name);
    formData.append("front_image", {
      uri: data.front_image.path,
      type: data.front_image.mime,
      name: "Document",
    });
    // conditional data are optional
    data.backImage &&
      formData.append("back_image", {
        uri: data.front_image.path,
        type: data.front_image.mime,
        name: "Document",
      });
    formData.append("expiry_date", data.issue_date);
    data.issue_date && formData.append("issue_date", data.issue_date);
    return await ApiService.sendPostRequest(url, formData, data.token);
  };
  addAddress = async (data, token) => {
    console.log("data", data.id);
    const url = BaseUrl + EndPoints.ADD_ADDRESS;
    let formData = new FormData();
    formData.append("delivery_address", data.address);
    formData.append("name", data.name);
    formData.append("latitude", data.latitude);
    formData.append("longitude", data.longitude);
    formData.append("city", data.city);
    formData.append("province", data.province);
    formData.append("address_label", data.address_label);
    formData.append("is_default", data.is_default);
    formData.append("phone_number", data.phone);
    return await ApiService.sendPostRequest(url, formData, token);
  };

//  --- > Update Document -->

  updateShop = async (
    shopName,
    address,
    logo,
    latitude,
    longitude,
    category_id,
    id,
    token,
    is_variant
  ) => {
    const url = BaseUrl + EndPoints.UPDATE_SHOP;
    let formData = new FormData();
    shopName && formData.append("name", shopName);
    address && formData.append("address", address);
    logo &&
      formData.append("logo", {
        uri: logo.path,
        type: logo.mime,
        name: "shopLogo",
      });
    latitude && formData.append("latitude", latitude);
    longitude && formData.append("longitude", longitude);
    category_id && formData.append("category_id", category_id);

    formData.append("id", id);
    formData.append("is_variant", is_variant);
    return await ApiService.sendPostRequest(url, formData, token);
  };

  updateDocument = async (data, token) => {
    const url = BaseUrl + EndPoints.UPDATE_DOCUMENT;
    console.log(data.front_image);
    let formData = new FormData();
    data.type && formData.append("type", data.type);
    data.name && formData.append("name", data.name);
    data.front_image &&
      formData.append("front_image", {
        uri: data.front_image.path,
        type: data.front_image.mime,
        name: "Document",
      });
    // conditional data are optional
    data.backImage &&
      formData.append("back_image", {
        uri: data.front_image.path,
        type: data.front_image.mime,
        name: "Document",
      });
    data.expiry_date && formData.append("expiry_date", data.expiry_date);
    data.issue_date && formData.append("issue_date", data.issue_date);
    formData.append("id", data.id);
    return await ApiService.sendPostRequest(url, formData, token);
  };
  updateVehicleInformation = async (data) => {
    const url = BaseUrl + EndPoints.UPDATE_DRIVER;
    let formData = new FormData();
    data.vehicleType && formData.append("vehicle_type", data.vehicleType);
    data.registrationNumber &&
      formData.append("vehicle_number", data.registrationNumber);
    data.frontImage &&
      formData.append("license_image", {
        uri: data.frontImage.path,
        type: data.frontImage.mime,
        name: "front_Image",
      });
    data.backImage &&
      formData.append("license_back_image", {
        uri: data.backImage.path,
        type: data.backImage.mime,
        name: "back_Image",
      });
    data.drivinglicenseNumber &&
      formData.append("license_number", data.drivinglicenseNumber);
    data.id && formData.append("id", data.id);
    return await ApiService.sendPostRequest(url, formData, data.token);
  };
   updateProduct = async (data, token) => {
    const url = BaseUrl + EndPoints.UPDATE_PRODUCT + "/" + data.slug;

    let formData = new FormData();
    data.title && formData.append("title", data.title);
    data.price && formData.append("price", data.price);
    data.category && formData.append("category", data.category.id);
    data.is_variant && formData.append("is_variant", data.is_variant);
    data.total_quantity &&
      formData.append("total_quantity", data.total_quantity);
    console.log(data.product_images);
    data.product_images &&
      data.product_images.forEach((item, index) => {
        if (item.hasOwnProperty("path")) {
          formData.append(`product_images[${index}]`, {
            uri: item.path,
            type: item.mime,
            name: `Image[${index}]`,
          });
        } else if (item.hasOwnProperty("image_url")) {
          formData.append(`product_images[${index}]`, item.image_url);
        } else {
          console.log("noImage");
        }
      });
    data.discount && formData.append("discount", data.discount);
    data.services && formData.append("services", data.services);

    data.specifications &&
      formData.append("specifications", data.specifications);
    data.services && formData.append("services", data.services);
    data.product_variants &&
      data.product_variants.map((item, index) => {
        formData.append(`variants[color][${index}]`, item.color);
        item.properties.map((propertiesItem, propertiesIndex) => {
          formData.append(
            `variants[properties][${index}][${propertiesIndex}][quantity]`,
            propertiesItem.quantity
          );
          formData.append(
            `variants[properties][${index}][${propertiesIndex}][size]`,
            propertiesItem.size
          );
        });
      });
    return await ApiService.sendPostRequest(url, formData, token);
  };

// --- > Get Document -->

  getProfile = async (token) => {
    const url = BaseUrl + EndPoints.GET_PROFILE;
    return await ApiService.sendGetRequest(url, token);
  };
  getMyProducts = async (token, queryParams) => {
    const url = BaseUrl + EndPoints.MY_PRODUCTS;
    return await ApiService.sendGetRequest(url, token, queryParams);
  };
  getShopDetails = async (token, queryParams) => {
    const url = BaseUrl + EndPoints.SHOP_DETAILS;
    return await ApiService.sendGetRequest(url, token, queryParams);
  };
  getAllShops = async (token, paramQuery, categoryId) => {
    const url = BaseUrl + EndPoints.GET_ALL_SHOPS;
    const formData = new FormData();
    categoryId && formData.append("category_id", categoryId);
    console.log("categoryId", categoryId);
    return await ApiService.sendPostRequest(url, formData, token, paramQuery);
  };

  getProductDetails = async (token, queryParams) => {
    const url = BaseUrl + EndPoints.PRODUCT_DETAILS;

    return await ApiService.sendGetRequest(url, token, queryParams);
  };

  getShopWithProducts = async (token, paramQuery) => {
    const url = BaseUrl + EndPoints.GET_SHOP_WITH_PRODUCTS;
    const formData = new FormData();
    return await ApiService.sendGetRequest(url, token, paramQuery);
  };
  getShopStats = async (token, queryParams) => {
    const url = BaseUrl + EndPoints.GET_ORDERS_STATUS_COUNT;
    return await ApiService.sendGetRequest(url, token, queryParams);
  };
  

 // --- > Delete Document -->

  deleteBank = async (token, id) => {
    const url = BaseUrl + EndPoints.DELETE_BANK;
    let formData = new FormData();
    formData.append("id", id);
    return await ApiService.sendPostRequest(url, formData, token);
  };

 deleteAddress = async (id, token) => {
    const url = BaseUrl + EndPoints.DELETE_ADDRESS;
    let formData = new FormData();
    formData.append("id", id);
    return await ApiService.sendPostRequest(url, formData, token);
  };
  deletePaymentCard = async (token, id) => {
    try {
      const response = await fetch(BaseUrl + EndPoints.DELETE_CARD, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ card_id: id, result: "Successful" }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          return data;
        });
      if (response.code === 200 || response.code === 201) {
        return RESPONSE(true, response.message, response.data);
      } else {
        return RESPONSE(false, response.message, []);
      }
    } catch (errorResponse) {
      return RESPONSE(false, errorResponse.message, []);
    }
  };

deleteAccount = async (token) => {
    const url = BaseUrl + EndPoints.DELETE_ACCOUNT;
    const formData = new FormData();
    return await ApiService.sendPostRequest(url, formData, token);
  };


// --- > Save  Document -->
  SaveCardToken = async (token, data) => {
    const url = BaseUrl + EndPoints.SAVE_CARD_TOKEN;
    return await ApiService.sendGetRequest(url, token);
  };
  SaveCard = async (token, data) => {
    try {
      const response = await fetch(BaseUrl + EndPoints.SAVE_CARD, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brandName: data.brandName,
          cardToken: data.cardToken,
          maskedPAN: data.maskedPAN,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          return data;
        });
      if (response.code === 200 || response.code === 201) {
        return RESPONSE(true, response.message, response.data);
      } else {
        return RESPONSE(false, response.message, []);
      }
    } catch (errorResponse) {
      return RESPONSE(false, errorResponse.message, []);
    }
  };

  

 
  // --------------------------

}

const ApiClient = new apiClient();
export default ApiClient;
