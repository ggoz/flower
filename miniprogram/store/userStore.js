import { observable, action } from "mobx-miniprogram";
import { getStorage } from "../utils/storage";

export const userStore = observable({
  // 数据字段
  token: getStorage("token") || "",
  // 用户信息
  userInfo: getStorage("userInfo") || "",
  // 计算属性

  // actions
  setToken: action(function (token) {
    this.token = token;
  }),
  setUserInfo: action(function (userInfo) {
    this.userInfo = userInfo;
  }),
});
