class WxRequest {
  // 默认配置
  defaults = {
    baseURL: "",
    url: "",
    data: null,
    method: "GET",
    header: {
      "Content-type": "application/json",
    },
    timeout: 60000,
    isLoading: true,
  };

  interceptors = {
    request(config) {
      return config;
    },
    response(config) {
      return config;
    },
  };

  queue = [];

  constructor(params = {}) {
    this.defaults = Object.assign({}, this.defaults, params);
  }

  // 请求
  request(options) {
    this.timerId && clearTimeout(this.timerId);
    // 合并路径
    options.url = this.defaults.baseURL + options.url;
    options = { ...this.defaults, ...options };

    if (options.isLoading && options.method !== "UPLOAD") {
      this.queue.length === 0 && wx.showLoading();
      this.queue.push("request");
    }
    // 发送前调用请求拦截器
    options = this.interceptors.request(options);

    return new Promise((resolve, reject) => {
      if (options.method === "UPLOAD") {
        wx.uploadFile({
          ...options,
          success: (res) => {
            console.log(res);
            res.data = JSON.parse(res.data);
            const mergeRes = Object.assign({}, res, {
              config: options,
              isSuccess: true,
            });
            resolve(this.interceptors.response(mergeRes));
          },
          fail: (err) => {
            res.data = JSON.parse(res.data);
            const mergeRes = Object.assign({}, err, {
              config: options,
              isSuccess: false,
            });
            reject(this.interceptors.response(mergeRes));
          },
        });
      } else {
        wx.request({
          ...options,
          // 无论成功还是失败 都要调用相应拦截器
          success: (res) => {
            const mergeRes = Object.assign({}, res, {
              config: options,
              isSuccess: true,
            });
            resolve(this.interceptors.response(mergeRes));
          },
          fail: (err) => {
            const mergeError = Object.assign({}, err, {
              config: options,
              isSuccess: false,
            });
            reject(this.interceptors.response(mergeError));
          },
          complete: () => {
            if (options.isLoading) {
              this.queue.pop();
              this.queue.length === 0 && this.queue.push("request");

              this.timeId = setTimeout(() => {
                this.queue.pop();
                this.queue.length === 0 && wx.hideLoading();
                clearTimeout(this.timeId);
              }, 1);
            }
          },
        });
      }
    });
  }

  // 封装 get
  get(url, data = {}, config = {}) {
    return this.request(Object.assign({ url, data, method: "GET" }, config));
  }

  // 封装 post
  post(url, data = {}, config = {}) {
    return this.request(Object.assign({ url, data, method: "POST" }, config));
  }

  // 封装 put
  put(url, data = {}, config = {}) {
    return this.request(Object.assign({ url, data, method: "PUT" }, config));
  }

  // 封装 delete
  delete(url, data = {}, config = {}) {
    return this.request(Object.assign({ url, data, method: "DELETE" }, config));
  }

  // 并发请求
  all(...promise) {
    return Promise.all(promise);
  }

  // 对wx.uploadFile 进行封装
  upload(url, filePath, name = "file", config = {}) {
    return this.request(
      Object.assign({ url, filePath, name, method: "UPLOAD" }, config)
    );
  }
}

export default WxRequest;
