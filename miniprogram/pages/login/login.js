import { reqLogin, reqUserInfo } from "../../api/user";
import { toast } from "../../utils/extendApi";
import { setStorage } from "../../utils/storage";
import { ComponentWithStore } from "mobx-miniprogram-bindings";
import { userStore } from "../../store/userStore";
import { debounce } from "miniprogram-licia";

// pages/login/login.js
ComponentWithStore({
  storeBindings: {
    store: userStore,
    fields: ["token", "userInfo"],
    actions: ["setToken", "setUserInfo"],
  },
  /**
   * 页面的初始数据
   */
  data: {},
  methods: {
    // 登录
    login: debounce(function () {
      wx.login({
        success: async ({ code }) => {
          if (code) {
            const { data } = await reqLogin(code);
            setStorage("token", data.token);
            this.setToken(data.token);

            // 获取用户信息
            this.getUserInfo();

            wx.navigateBack();
          } else {
            toast({ title: "授权失败，请重新登录" });
          }
        },
      });
    }, 500),

    // 获取用户信息
    async getUserInfo() {
      const { data } = await reqUserInfo();
      console.log(data);
      setStorage("userInfo", data);
      this.setUserInfo(data);
    },
  },
});
