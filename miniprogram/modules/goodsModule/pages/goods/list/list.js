// pages/goods/list/index.js

import { reqGoodsList } from "../../../api/goods";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [], // 商品列表数据
    isFinish: false, // 判断数据是否加载完毕
    // 商品总条数
    total: 0,
    // 接口请求参数
    requestData: {
      page: 1,
      limit: 10,
      category1Id: "",
      category2Id: "",
    },
    isLoading: false,
  },
  // 获取商品列表
  async getGoodsList() {
    this.setData({
      isLoading: true,
    });
    const { data } = await reqGoodsList(this.data.requestData);
    this.setData({
      isLoading: false,
    });
    this.setData({
      goodsList: [...this.data.goodsList, ...data.records],
      total: data.total,
    });
  },
  onLoad(options) {
    Object.assign(this.data.requestData, options);
    this.getGoodsList();
  },
  onReachBottom() {
    if (this.data.isLoading) return;

    if (this.data.goodsList.length === this.data.total) {
      this.setData({
        isFinish: true,
      });
      return;
    }

    this.setData({
      "requestData.page": this.data.requestData.page + 1,
      // requestData: { ...this.data.requestData, page: page + 1 },
    });

    this.getGoodsList();
  },
  onPullDownRefresh() {
    this.setData({
      goodsList: [],
      isFinish: false,
      requestData: { ...this.data.requestData, page: 1 },
      total: 0,
    });
    this.getGoodsList();
    wx.stopPullDownRefresh();
  },
  onShareAppMessage: function () {},
  onShareTimeline() {},
});
