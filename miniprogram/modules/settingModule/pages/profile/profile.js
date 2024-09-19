// pages/profile/profile.js

import { reqUpdateUserInfo, reqUploadFile } from "../../../../api/user";
import { toast } from "../../../../utils/extendApi";
import { setStorage } from "../../../../utils/storage";
import { userBehavior } from "./behavior";

Page({
  behaviors: [userBehavior],
  // 页面的初始数据
  data: {
    isShowPopup: false, // 控制更新用户昵称的弹框显示与否
  },

  // 修改头像
  async chooseavatar(e) {
    const { avatarUrl } = e.detail;
    const { data } = await reqUploadFile(avatarUrl, "file");
    this.setData({
      "userInfo.headimgurl": data,
    });
  },

  // 更新用户信息
  async updateUserInfo() {
    const res = await reqUpdateUserInfo(this.data.userInfo);
    if (res.code === 200) {
      setStorage("userInfo", this.data.userInfo);
      this.setUserInfo(this.data.userInfo);
      toast({ title: "用户信息更新成功" });
    }
  },
  // 获取用户昵称
  getNickName(e) {
    const { nickname } = e.detail.value;
    console.log(nickname);
    this.setData({
      "userInfo.nickname": nickname,
      isShowPopup: false,
    });
  },
  // 显示修改昵称弹框
  onUpdateNickName() {
    this.setData({
      isShowPopup: true,
      "userInfo.nickname": this.data.userInfo.nickname,
    });
  },

  // 弹框取消按钮
  cancelForm() {
    this.setData({
      isShowPopup: false,
    });
  },
});
