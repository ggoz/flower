import http from "../utils/http";

/**
 * @description 登录
 * @param {*} code
 * @returns Promise
 */
export const reqLogin = (code) => {
  return http.get(`/weixin/wxLogin/${code}`);
};

export const reqUserInfo = () => {
  return http.get("/weixin/getuserInfo");
};

/**
 * @description 上传本地资源
 * @param {*} filePath
 * @param {*} name
 * @returns Promise
 */
export const reqUploadFile = (filePath, name) => {
  return http.upload("/fileUpload", filePath, name);
};

/**
 * @description 更新用户信息
 */
export const reqUpdateUserInfo = (userInfo) => {
  return http.post("/weixin/updateUser", userInfo);
};
