import { modal, toast } from "./extendApi";
import WxRequest from "mina-request";
import { clearStorage, getStorage } from "./storage";
import { env } from "./env";
const instance = new WxRequest({
  baseURL: env.baseURL,
  timeout: 15000,
});

instance.interceptors.request = (config) => {
  // 携带token
  const token = getStorage("token");
  if (token) {
    config.header["token"] = token;
  }

  return config;
};

instance.interceptors.response = async (response) => {
  const { isSuccess, data } = response;
  if (!isSuccess) {
    wx.showToast({
      title: "网络异常请重试",
      icon: "error",
      mask: true,
    });
    return response;
  }

  switch (data.code) {
    // 成功
    case 200:
      return data;
    // 没有token
    case 208:
      const res = await modal({
        content: "鉴权失败,请重新登录",
        showCancel: false,
      });
      if (res) {
        clearStorage();
        wx.navigateTo({
          url: "/pages/login/login",
        });
      }
      return Promise.reject(response);
    default:
      toast({
        title: "程序出现异常, 请联系客服或稍后重试",
      });
      return Promise.reject(response);
  }
};

export default instance;
