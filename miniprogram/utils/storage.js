/**
 * @description 存储指定key到storage
 * @param {*} key 
 * @param {*} value 
 */
export const setStorage = (key, value) => {
  try {
    wx.setStorageSync(key, value)
  } catch (error) {
    console.error(`指定 ${key} 数据存储失败: `, error);
  }
}

/**
 * @description 从storage获取指定key的数据
 * @param {*} key 
 */
export const getStorage = (key) => {
  try {
    const val = wx.getStorageSync(key)
    if (val) {
      return val
    }
  } catch (error) {
    console.error(`指定 ${key} 数据获取失败: `, error);
  }
}

/**
 * @description 从storage移除指定key的数据
 * @param {*} key 
 */
export const removeStorage = (key) => {
  try {
    wx.removeStorageSync(key)
  } catch (error) {
    console.error(`移除指定 ${key} 数据失败: `, error);
  }
}

/**
 * @description 从storage移除所有数据
 * @param {*} key 
 */
export const clearStorage = () => {
  try {
    wx.clearStorageSync()
  } catch (error) {
    console.error(`移除所有数据失败: `, error);
  }
}

/**
 * @description 异步存储到storage
 * @param {*} key 本地缓存中指定的 key
 * @param {*} data 需要缓存的数据
 */
export const asyncSetStorage = (key, data) => {
  return new Promise((resolve) => {
    wx.setStorage({
      key,
      data,
      complete(res) {
        resolve(res)
      }
    })
  })
}

/**
 * @description 异步从本地读取数据
 * @param {*} key 
 */
export const asyncGetStorage = (key) => {
  return new Promise((resolve) => {
    wx.getStorage({
      key,
      complete(res) {
        resolve(res)
      }
    })
  })
}

/**
 * @description 异步从本地删除指定key的数据
 * @param {*} key 
 */
export const asyncRemoveStorage = (key) => {
  return new Promise((resolve) => {
    wx.removeStorage({
      key,
      complete(res) {
        resolve(res)
      }
    })
  })
}

/**
 * @description 异步从本地删除所有数据
 */
export const asyncClearStorage = () => {
  return new Promise((resolve) => {
    wx.clearStorage({
      complete(res) {
        resolve(res)
      }
    })
  })
}