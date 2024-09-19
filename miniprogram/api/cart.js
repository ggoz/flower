import http from "../utils/http";

/**
 * @description 加入购物车  [商品详情加入购物车] 以及 [购物车更新商品数量]
 * @param {*} param0
 */
export const reqAddCart = ({ goodsId, count, ...data }) => {
  return http.get(`/cart/addToCart/${goodsId}/${count}`, data);
};

/**
 * @description 获取购物车列表
 */
export const reqCartList = () => {
  return http.get("/cart/getCartList");
};

/**
 * @description 更新商品选中状态
 * @param {*} goodsId
 * @param {*} isChecked
 */
export const reqUpdateChecked = (goodsId, isChecked) => {
  return http.get(`/cart/checkCart/${goodsId}/${isChecked}`);
};

/**
 * @description 实现全选全不选
 * @param {*} isChecked
 */
export const reqCheckAllStatus = (isChecked) => {
  return http.get(`/cart/checkAllCart/${isChecked}`);
};

/**
 * @description 删除购物车商品
 * @param {*} goodsId
 */
export const reqDelCartGoods = (goodsId) => {
  return http.get(`/cart/delete/${goodsId}`);
};
