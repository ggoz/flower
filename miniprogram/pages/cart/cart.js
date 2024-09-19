import {
  reqAddCart,
  reqCartList,
  reqCheckAllStatus,
  reqDelCartGoods,
  reqUpdateChecked,
} from "@/api/cart";
import { userStore } from "@/store/userStore";
import { ComponentWithStore } from "mobx-miniprogram-bindings";
const computedBehavior = require("miniprogram-computed").behavior;
import { debounce } from "miniprogram-licia";
import { swipeCellBehavior } from "@/behaviors/swipeCell";

// pages/cart/component/cart.js
ComponentWithStore({
  behaviors: [computedBehavior, swipeCellBehavior],
  storeBindings: {
    store: userStore,
    fields: ["token"],
  },
  computed: {
    selectAllStatus: (data) => {
      return (
        data.cartList.length !== 0 &&
        data.cartList.every((item) => item.isChecked === 1)
      );
    },
    totalPrice(data) {
      let totalPrice = 0;
      data.cartList.forEach((item) => {
        if (item.isChecked === 1) {
          totalPrice += item.price * item.count;
        }
      });
      return totalPrice;
    },
  },
  // 组件的属性列表
  properties: {},

  // 组件的初始数据
  data: {
    cartList: [],
    emptyDes: "还没有添加商品，快去添加吧～",
  },

  // 组件的方法列表
  methods: {
    toOrder() {
      if (this.data.totalPrice === 0) {
        wx.toast({ title: "请选择需要购买的商品" });
        return;
      }
      wx.navigateTo({
        url: "/modules/orderPayModule/pages/order/detail/detail",
      });
    },
    async delCartGoods(e) {
      const { id } = e.currentTarget.dataset;
      const modalRes = await wx.modal({ content: "您确认删除该商品么？" });
      if (modalRes) {
        await reqDelCartGoods(id);
        this.showTopGetList();
      }
    },

    changeBuyNum: debounce(async function (e) {
      const newBuyNum = e.detail > 200 ? 200 : e.detail;
      const { id, index, oldbuynum } = e.target.dataset;
      const reg = /^([1-9]|[1-9]\d|1\d{2}|200)$/;
      const regRes = reg.test(newBuyNum);
      if (!regRes) {
        this.setData({
          [`cartList[${index}].count`]: oldbuynum,
        });
        return;
      }

      const disCount = newBuyNum - oldbuynum;
      if (disCount === 0) return;
      const res = await reqAddCart({ goodsId: id, count: disCount });
      if (res.code == 200) {
        this.setData({
          [`cartList[${index}].count`]: newBuyNum,
        });
      }
    }, 500),

    async selectAllStatus(e) {
      console.log(e);
      const isChecked = e.detail ? 1 : 0;
      const res = await reqCheckAllStatus(isChecked);
      console.log(res);
      if (res.code === 200) {
        const newCartList = JSON.parse(JSON.stringify(this.data.cartList));
        newCartList.forEach((item) => (item.isChecked = isChecked));
        this.setData({
          cartList: newCartList,
        });
      }
    },
    async updateChecked(e) {
      const { id, index } = e.target.dataset;
      const isChecked = e.detail ? 1 : 0;
      const res = await reqUpdateChecked(id, isChecked);
      if (res.code === 200) {
        this.setData({
          [`cartList[${index}].isChecked`]: isChecked,
        });
      }
    },
    async showTopGetList() {
      const { token } = this.data;
      if (!token) {
        this.setData({
          emptyDes: "您尚未登录，点击登录获取更多权益",
          cartList: [],
        });
        return;
      }

      const { data: cartList, code } = await reqCartList();
      if (code === 200) {
        this.setData({
          cartList,
          emptyDes: cartList === 0 && "还没有添加商品，快去添加吧～",
        });
      }
    },
    onShow() {
      this.showTopGetList();
    },
    onHide() {
      this.onSwipeCellCommonClick();
    },
  },
});
