import axios from "axios";
import { APPURL } from "./Constants";

let timeOut = (time, expirationTime) => {
  //console.log(((expirationTime+20) -  (time.getTime() / 1000)) * 1000);
  return setTimeout(() => {
    checkToken();
  }, (expirationTime + 20 - time.getTime() / 1000) * 1000);
};
const adjustTokenTimer = () => {
  const clear = localStorage.getItem("checkToken");
  if (JSON.parse(localStorage.getItem("userInfo"))) {
    const expiration_date = JSON.parse(localStorage.getItem("userInfo"))["exp"];
    clearTimeout(clear);
    const actualTimeout = timeOut(new Date(), expiration_date);
    localStorage.setItem("checkToken", actualTimeout);
  }
};
const flushData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userInfo");
  localStorage.removeItem("checkToken");
  window.location.reload();
};

const request = async (endpoint, data, method) => {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: token,
    };
    const resp = await axios({
      method: method,
      url: endpoint,
      data: data,
      headers: headers,
    });
    adjustTokenTimer();
    return { statusCode: 200, message: resp.data };
  } catch (e) {
    const resp = e.response;
    if (resp !== undefined) {
      if (resp.status === 401) {
        flushData();
      }
    }
    try {
      return { statusCode: resp.status, message: resp.data };
    } catch (e) {
      return {
        statusCode: 500,
        message: {
          status: false,
          message: "something wrong with the connection",
        },
      };
    }
  }
};

const postRequestsWithToken = async (endpoint, data) => {
  return await request(endpoint, data, "POST");
};
const getRequestsWithToken = async (endpoint, data = {}) => {
  return await request(endpoint, data, "GET");
};
const checkToken = async () => {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: token,
    };
    console.log("token", token);
    const resp = await axios({
      method: "POST",
      url: APPURL + "checkToken",
      headers: headers,
    });
    return { statusCode: 200, message: resp.data };
  } catch (e) {
    const resp = e.response;
    if (resp === undefined) {
      flushData();
      return { statusCode: resp.status, message: "something wrong with token" };
    }
    if (resp.status === 401) {
      flushData();
    }
    return { statusCode: resp.status, message: "something wrong with token" };
  }
};

const loginRequest = async (state) => {
  const endpoint = APPURL + "login";
  //state should have username and password
  const data = {
    username: state.username,
    password: state.password,
  };
  const response = await postRequestsWithToken(endpoint, data);
  if (response.statusCode === 200) {
    const expiration_time = response.message.info.exp;

    const actualTimeout = timeOut(new Date(), expiration_time);
    localStorage.setItem("checkToken", actualTimeout);
    localStorage.setItem("userInfo", JSON.stringify(response.message.info));
  }
  return response;
};
const getAllRefrigetors = async () => {
  const endpoint = APPURL + "refrigerator";
  const response = await getRequestsWithToken(endpoint);
  return response;
};
const deleteRefrigerator = async (id) => {
  const endpoint = APPURL + "refrigerator/remove/" + id;
  const response = await postRequestsWithToken(endpoint);
  return response;
};
const addRefrigerator = async (name) => {
  const endpoint = APPURL + "refrigerator/add";
  const data = {
    refrigeratorName: name,
  };
  const response = await postRequestsWithToken(endpoint, data);
  return response;
};
const updateRefrigerator = async (name, id) => {
  const endpoint = APPURL + "refrigerator/update/" + id;
  const data = {
    refrigeratorName: name,
  };
  const response = await postRequestsWithToken(endpoint, data);
  return response;
};
const signupRequest = async (state) => {
  const endpoint = APPURL + "signup";
  const data = {
    username: state.username,
    password: state.password,
    email: state.email,
  };
  const response = await postRequestsWithToken(endpoint, data);
  return response;
};
const getPersonalItemWithBarcode = async (barCode) => {
  const endpoint = APPURL + "personal_item/?bar_code=" + barCode;
  const response = await getRequestsWithToken(endpoint);
  return response;
};
const getAllPersonalItems = async () => {
  const endpoint = APPURL + "personal_item/all";
  const response = await getRequestsWithToken(endpoint);
  return response;
};
const addPersonalItem = async (itemInformation) => {
  const itemName = itemInformation["item_name"];
  const barCode = itemInformation["bar_code"];
  const data = {
    item_name: itemName,
    bar_code: barCode,
  };
  const endpoint = APPURL + "personal_item/add";
  const response = await postRequestsWithToken(endpoint, data);
  return response;
};
const getAllItemsInRefrigerator = async (refrigeratorId) => {
  const endpoint = APPURL + "item/" + refrigeratorId;
  const response = await getRequestsWithToken(endpoint);
  return response;
};
const addRefrigeratorItem = async (data) => {
  const endpoint = APPURL + "item/add";
  const response = await postRequestsWithToken(endpoint, data);
  return response;
};
const deleteItemFromRefrigerator = async (data) => {
  const endpoint = APPURL + "item/remove";
  const response = await postRequestsWithToken(endpoint, data);
  return response;
};
const editItemInRefrigerator = async (data) => {
  const endpoint = APPURL + "item/edit";
  const response = await postRequestsWithToken(endpoint, data);
  return response;
};
const getItemByRefrigeratorIdAndBarCode = async (data) => {
  const refrigerator_id = data["refrigerator_id"];
  const bar_code = data["bar_code"];
  const endpoint =
    APPURL +
    "item/?refrigerator_id=" +
    refrigerator_id +
    "&bar_code=" +
    bar_code;
  const response = await getRequestsWithToken(endpoint);
  return response;
};
const takeItemOutOFRefrigerator = async (data) => {
  const endpoint = APPURL + "item/take";
  const response = await postRequestsWithToken(endpoint, data);
  return response;
};
const getAllUsersWithAccess = async (refrigerator_id) => {
  const endpoint = APPURL + "access/?refrigerator_id=" + refrigerator_id;
  const response = await getRequestsWithToken(endpoint);
  return response;
};
const getRefrigeratorByRefrigeratorId = async (refrigerator_id) => {
  const endpoint = APPURL + "refrigerator/" + refrigerator_id;
  const response = await getRequestsWithToken(endpoint);
  return response;
};
const searchUsers = async (username) => {
  const endpoint = APPURL + "users/search/?username=" + username;
  const response = await getRequestsWithToken(endpoint);
  return response;
};
const giveUserAccess = async (data) => {
  const endpoint = APPURL + "access/give";
  const response = await postRequestsWithToken(endpoint, data);
  return response;
};
const takeAccessAway = async (data) => {
  const endpoint = APPURL + "access/remove";
  const response = await postRequestsWithToken(endpoint, data);
  return response;
};
const deletePersonalItem = async (data) => {
  const endpoint = APPURL + "personal_item/remove";
  const response = await postRequestsWithToken(endpoint, data);
  return response;
};
const getBarCodeInfo = async (barcode) =>{
  const endpoint = APPURL +"personal_item/lookup?bar_code="+barcode;
  const response = await getRequestsWithToken(endpoint);
  return response;
}
const backendAPI = {
  postRequestsWithToken: postRequestsWithToken,
  getRequestsWithToken: getRequestsWithToken,
  loginRequest: loginRequest,
  signupRequest: signupRequest,
  checkToken: checkToken,
  getAllRefrigetors: getAllRefrigetors,
  deleteRefrigerator: deleteRefrigerator,
  addRefrigerator: addRefrigerator,
  updateRefrigerator: updateRefrigerator,
  getPersonalItemWithBarcode: getPersonalItemWithBarcode,
  addPersonalItem: addPersonalItem,
  getAllPersonalItems: getAllPersonalItems,
  addRefrigeratorItem: addRefrigeratorItem,
  getAllItemsInRefrigerator: getAllItemsInRefrigerator,
  deleteItemFromRefrigerator: deleteItemFromRefrigerator,
  editItemInRefrigerator: editItemInRefrigerator,
  getItemByRefrigeratorIdAndBarCode: getItemByRefrigeratorIdAndBarCode,
  takeItemOutOFRefrigerator: takeItemOutOFRefrigerator,
  getAllUsersWithAccess: getAllUsersWithAccess,
  getRefrigeratorByRefrigeratorId: getRefrigeratorByRefrigeratorId,
  searchUsers: searchUsers,
  giveUserAccess: giveUserAccess,
  takeAccessAway: takeAccessAway,
  deletePersonalItem,
  getBarCodeInfo
};

export default backendAPI;
