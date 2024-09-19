import QQMapWX from "../../../lib/qqmap-wx-jssdk.min";
import Schema from "async-validator";
import {
  reqAddAddress,
  reqAddressInfo,
  reqUpdateAddress,
} from "../../../api/address.js";

Page({
  // 页面的初始数据
  data: {
    name: "", //收货人
    phone: "", //手机号码
    provinceName: "", //省
    provinceCode: "", //省编码
    cityName: "", //市
    cityCode: "", //市编码
    districtName: "", //区
    districtCode: "", //市编码
    address: "", //详细地址
    fullAddress: "", //完整地址
    isDefault: false, // 设为默认地址
  },

  // 保存收货地址
  async saveAddrssForm(event) {
    const {
      provinceName,
      cityName,
      districtName,
      address,
      isDefault,
    } = this.data;
    const params = {
      ...this.data,
      fullAddress: provinceName + cityName + districtName + address,
      isDefault: isDefault ? 1 : 0,
    };
    const { valid } = await this.validateAddress(params);
    if (!valid) return;
    const res = this.addressId
      ? await reqUpdateAddress(params)
      : await reqAddAddress(params);
    if (res.code === 200) {
      wx.navigateBack();
      wx.navigateBack({
        success: () => {
          wx.toast({
            title: this.addressId ? "更新收货地址成功" : "新增收货地址成功",
          });
        },
      });
    }
  },

  validateAddress(params) {
    // 验证收货人，是否只包含大小写字母、数字和中文字符
    const nameRegExp = "^[a-zA-Z\\d\\u4e00-\\u9fa5]+$";

    // 验证手机号
    const phoneReg =
      "^1(?:3\\d|4[4-9]|5[0-35-9]|6[67]|7[0-8]|8\\d|9\\d)\\d{8}$";

    const rules = {
      name: [
        { required: true, message: "请输入收货人姓名" },
        { pattern: nameRegExp, message: "收货人姓名不合法" },
      ],
      phone: [
        { required: true, message: "请输入收货人手机号" },
        { pattern: phoneReg, message: "手机号不合法" },
      ],
      provinceName: { required: true, message: "请选择收货人所在地区" },
      address: { required: true, message: "请输入详细地址" },
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

  // 省市区选择
  onAddressChange(event) {
    console.log(event);
    const [provinceName, cityName, districtName] = event.detail.value;
    const [provinceCode, cityCode, districtCode] = event.detail.code;
    this.setData({
      provinceName,
      cityName,
      districtName,
      provinceCode,
      cityCode,
      districtCode,
    });
  },
  // 获取地理位置信息
  async onLocation() {
    const { latitude, longitude, name } = await wx.chooseLocation();
    this.qqmapsdk.reverseGeocoder({
      location: {
        latitude,
        longitude,
      },
      success: (res) => {
        console.log(res);
        const { adcode, province, city, district } = res.result.ad_info;
        const { street, street_number } = res.result.address_component;
        const { standard_address } = res.result.formatted_addresses;
        this.setData({
          provinceName: province, //省
          provinceCode: adcode.replace(adcode.substring(2, 6), "0000"), //省编码
          cityName: city, //市
          cityCode: adcode.replace(adcode.substring(4, 6), "00"), //市编码
          districtName: district, //区
          districtCode: district && adcode, //市编码
          address: street + street_number + name, //详细地址
          fullAddress: standard_address + name, //完整地址
        });
      },
    });
  },
  async showAddressInfo(id) {
    if (!id) return;
    this.addressId = id;
    wx.setNavigationBarTitle({
      title: "更新收货地址",
    });
    const { data } = await reqAddressInfo(id);
    this.setData(data);
  },
  onLoad(options) {
    this.qqmapsdk = new QQMapWX({
      key: "A7LBZ-PDQCU-QKAVC-GHVZJ-W2M4Z-SUFSG",
    });
    this.showAddressInfo(options.id);
  },
});
