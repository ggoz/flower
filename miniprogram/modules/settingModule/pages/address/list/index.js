const { swipeCellBehavior } = require("@/behaviors/swipeCell");
const { reqAddressList, reqDelAddress } = require("../../../api/address.js");
const app = getApp();
// pages/address/list/index.js
Page({
  behaviors: [swipeCellBehavior],
  // 页面的初始数据
  data: {
    addressList: [],
  },
  async getAddressList() {
    const { data } = await reqAddressList();
    this.setData({
      addressList: data,
    });
  },
  onShow() {
    this.getAddressList();
  },
  // 去编辑页面
  toEdit(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/modules/settingModule/pages/address/add/index?id=${id}`,
    });
  },
  // 删除地址
  async delAddress(e) {
    const { id } = e.currentTarget.dataset;
    const modelRes = await wx.modal({ content: "您确认删除该收货地址吗？" });
    if (modelRes) {
      await reqDelAddress(id);
      wx.toast({ title: "收货地址删除成功" });
      this.getAddressList();
    }
  },
  changeAddress(e) {
    if (this.flag !== "1") return;

    const addressId = e.currentTarget.dataset.id;
    const selectAddress = this.data.addressList.find(
      (item) => item.id === addressId
    );
    if (selectAddress) {
      app.globalData.address = selectAddress;
      wx.navigateBack();
    }
  },
  onLoad(options) {
    this.flag = options.flag;
  },
});
