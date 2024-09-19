/**
 * @description 消息提示框
 * @param { Object } options
 */
const toast = ({
  title = "数据加载中...",
  icon = "none",
  duration = 2000,
  mask = true,
} = {}) => {
  wx.showToast({
    title,
    icon,
    duration,
    mask,
  });
};

/**
 * @description 消息提示框
 * @param { Object } options
 */
const modal = (options = {}) => {
  return new Promise((resolve) => {
    const defaultOpt = {
      title: "提示",
      content: "您确定执行该操作么？",
      confirmColor: "#f3514f"
    };
    // 合并
    const opts = Object.assign({}, defaultOpt, options)
    wx.showModal({
      ...opts,
      complete: ({ confirm, cancel }) => {
        confirm && resolve(true)
        cancel && resolve(false)
      }
    })

  });
};

wx.toast = toast;
wx.modal = modal;

export {
  toast, modal
};