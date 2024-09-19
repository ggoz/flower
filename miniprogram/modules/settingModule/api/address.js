import http from "../../../utils/http";

/**
 * @description 新增收货地址
 * @param {*} data
 */
export const reqAddAddress = (data) => {
  return http.post("/userAddress/save", data);
};

/**
 * @description 获取地址列表
 */
export const reqAddressList = () => {
  return http.get("/userAddress/findUserAddress");
};

/**
 * @description 获取地址详情
 * @param {*} id
 */
export const reqAddressInfo = (id) => {
  return http.get(`/userAddress/${id}`);
};

/**
 * @description 更新地址详情
 * @param {*} data
 */
export const reqUpdateAddress = (data) => {
  return http.post("/userAddress/update", data);
};

/**
 * @description 删除收货地址
 * @param {*} id
 */
export const reqDelAddress = (id) => {
  return http.get(`/userAddress/delete/${id}`);
};
