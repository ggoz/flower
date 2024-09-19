import { reqAddCart, reqCartList } from "@/api/cart";
import { reqGoodsInfo } from "../../../api/goods";
import { userBehavior } from "../../../behaviors/userBehavior";

// pages/goods/detail/index.js
Page({
  behaviors: [userBehavior],
  // 页面的初始数据
  data: {
    goodsInfo: {}, // 商品详情
    show: false, // 控制加入购物车和立即购买弹框的显示
    count: 1, // 商品购买数量，默认是 1
    blessing: "", // 祝福语,
    buyNow: 0, // 0加入购物车，1立即购买
    allCount: "",
  },
  async getCartCount() {
    if (!this.data.token) return;
    const res = await reqCartList();
    if (res.data.length !== 0) {
      let allCount = 0;
      res.data.forEach((item) => {
        allCount += item.count;
      });
      console.log(allCount);
      this.setData({
        allCount: (allCount > 99 ? "99+" : allCount) + "",
      });
    }
  },

  // 弹框确定按钮
  async handlerSubmit() {
    const { count, blessing, buyNow, token } = this.data;
    const goodsId = this.goodsId;
    if (!token) {
      wx.navigateTo({
        url: "/pages/login/login",
      });
      return;
    }

    if (buyNow === 0) {
      const res = await reqAddCart({ goodsId, count });
      console.log(res);
      if (res.code === 200) {
        wx.toast({ title: "加入购物车成功" });
        this.getCartCount();
        this.setData({
          show: false,
        });
      }
    } else {
      wx.navigateTo({
        url: `/modules/orderPayModule/pages/order/detail/detail?goodsId=${goodsId}&blessing=${blessing}`,
      });
    }
  },
  // 加入购物车
  handleAddcart() {
    this.setData({
      show: true,
      buyNow: 0,
    });
  },

  // 立即购买
  handeGotoBuy() {
    this.setData({
      show: true,
      buyNow: 1,
    });
  },

  // 点击关闭弹框时触发的回调
  onClose() {
    this.setData({ show: false });
  },

  // 监听是否更改了购买数量
  onChangeGoodsCount(event) {
    this.setData({
      count: event.detail,
    });
    console.log(event.detail);
  },
  async getGoodsInfo() {
    const { data } = await reqGoodsInfo(this.goodsId);
    this.setData({
      goodsInfo: data,
    });
  },
  // 预览图片
  previewImage() {
    wx.previewImage({
      urls: this.data.goodsInfo.detailList,
    });
  },
  onLoad(options) {
    this.goodsId = options.goodsId;
    // 获取商品详情
    this.getGoodsInfo();

    this.getCartCount();
  },
  onShareAppMessage: function () {},
  onShareTimeline() {},
});
