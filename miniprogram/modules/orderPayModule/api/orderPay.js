import http from "../../../utils/http";

/**
 * @description 获取订单详情
 */
export const reqOrderInfo = () => {
  return http.get("/order/trade");
};

/**
 * @description 获取订单地址
 */
export const reqOrderAddress = () => {
  return http.get("/userAddress/getOrderAddress");
};

/**
 * @description 立即购买
 * @param {*} param0
 */
export const reqBuyNowGoods = ({ goodsId, ...data }) => {
  return http.get(`/order/buy/${goodsId}`, data);
};
/**
 * @description 提交订单
 */
export const reqSubmitOrder = (data) => {
  return http.post(`/order/submitOrder`, data);
};

/**
 * @description 获取微信预支付信息
 * @param {*} orderNo
 */
export const reqPrePayInfo = (orderNo) => {
  return http.get(`/webChat/createJsapi/${orderNo}`);
};

/**
 * @description 微信支付状态查询
 * @param {*} orderNo
 */
export const reqPayStatus = (orderNo) => {
  return http.get(`/webChat/queryPayStatus/${orderNo}`);
};

/**
 * @description 获取订单列表
 * @returns Promise
 */
export const reqOrderList = (page, limit) => {
  return http.get(`/order/order/${page}/${limit}`);
};
