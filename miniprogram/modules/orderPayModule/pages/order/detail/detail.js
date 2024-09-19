import {
  reqBuyNowGoods,
  reqOrderAddress,
  reqOrderInfo,
  reqPayStatus,
  reqPrePayInfo,
  reqSubmitOrder,
} from "../../../api/orderPay";
import { formatTime } from "../../../utils/formatTime";
// 导入 async-validator 对参数进行验证
import Schema from "async-validator";
import { debounce } from "miniprogram-licia";
const app = getApp();
Page({
  data: {
    buyName: "", // 订购人姓名
    buyPhone: "", // 订购人手机号
    deliveryDate: "选择送达日期", // 期望送达日期
    blessing: "", // 祝福语
    show: false, // 期望送达日期弹框
    minDate: new Date().getTime(),
    currentDate: new Date().getTime(),
    orderAddress: {},
    orderInfo: {},
  },

  // 提交订单
  submitOrder: debounce(async function () {
    const {
      buyName,
      buyPhone,
      deliveryDate,
      blessing,
      orderAddress,
      orderInfo,
    } = this.data;

    const params = {
      buyName,
      buyPhone,
      cartList: orderInfo.cartVoList,
      deliveryDate,
      remarks: blessing,
      userAddressId: orderAddress?.id || "",
    };
    const { valid } = await this.validateOrder(params);
    if (!valid) return;
    const res = await reqSubmitOrder(params);
    if (res.code === 200) {
      this.orderNo = res.data;
      this.advancePay();
    }
  }, 500),

  async advancePay() {
    try {
      const res = await reqPrePayInfo(this.orderNo);
      if (res.code === 200) {
        const payInfo = await wx.requestPayment(res.data);
        if (payInfo.errMsg === "requestPayment:ok") {
          const payStatus = await reqPayStatus(this.orderNo);
          if (payStatus.code === 200) {
            wx.redirectTo({
              url: "/modules/orderPayModule/pages/order/list/list",
              success: () => {
                wx.toast({ title: "支付成功", icon: "success" });
              },
            });
          }
        }
      }
    } catch (error) {
      wx.toast({ title: "支付失败，请联系客服", icon: "error" });
    }
  },

  // 验证订单
  validateOrder(params) {
    // 验证收货人，是否只包含大小写字母、数字和中文字符
    const nameRegExp = "^[a-zA-Z\\d\\u4e00-\\u9fa5]+$";

    // 验证手机号
    const phoneReg =
      "^1(?:3\\d|4[4-9]|5[0-35-9]|6[67]|7[0-8]|8\\d|9\\d)\\d{8}$";

    const rules = {
      userAddressId: [{ required: true, message: "请选择收货地址" }],
      buyName: [
        { required: true, message: "请输入订购人姓名" },
        { pattern: nameRegExp, message: "订购人姓名不合法" },
      ],
      buyPhone: [
        { required: true, message: "请输入订购人手机号" },
        { pattern: phoneReg, message: "手机号不合法" },
      ],
      deliveryDate: { required: true, message: "请选择送达日期" },
    };

    // 创建验证实例，并传入验证规则
    const validator = new Schema(rules);

    return new Promise((resolve) => {
      validator.validate(params, (errors, fields) => {
        if (errors) {
          // 如果验证失败，需要给用户进行提示
          wx.toast({
            title: errors[0].message,
          });
          resolve({ valid: false });
        } else {
          resolve({ valid: true });
        }
      });
    });
  },
  // 选择期望送达日期
  onShowDateTimerPopUp() {
    this.setData({
      show: true,
    });
  },

  // 期望送达日期确定按钮
  onConfirmTimerPicker(e) {
    const time = formatTime(new Date(e.detail));
    this.setData({
      show: false,
      deliveryDate: time,
    });
  },

  // 期望送达日期取消按钮 以及 关闭弹框时触发
  onCancelTimePicker() {
    this.setData({
      show: false,
      minDate: new Date().getTime(),
      currentDate: new Date().getTime(),
    });
  },

  // 跳转到收货地址
  toAddress() {
    wx.navigateTo({
      url: "/modules/settingModule/pages/address/list/index",
    });
  },
  async getAddress() {
    const addressId = app.globalData.address.id;
    if (addressId) {
      this.setData({
        orderAddress: app.globalData.address,
      });
      return;
    }
    const res = await reqOrderAddress();
    this.setData({
      orderAddress: res.data,
    });
  },
  async getOrderInfo() {
    const { goodsId, blessing } = this.data;

    const { data: orderInfo } = goodsId
      ? await reqBuyNowGoods({ goodsId, blessing })
      : await reqOrderInfo();
    console.log(orderInfo);
    const orderGoods = orderInfo.cartVoList.find(
      (item) => item.blessing !== ""
    );
    console.log(orderGoods);
    this.setData({
      orderInfo,
      blessing: !orderGoods ? "" : orderGoods.blessing,
    });
  },
  onLoad(options) {
    console.log(options);
    this.setData({
      ...options,
    });
  },
  onShow() {
    this.getAddress();
    this.getOrderInfo();
  },
  onUnload() {
    app.globalData.address = {};
  },
});
