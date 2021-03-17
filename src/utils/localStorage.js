// 存储数据
export const setItem = (key, value) => {
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(key, value)
}
// 获取数据
export const getItem = key => {
  const value = window.localStorage.getItem(key)
  // 使用 try catch 来判断数据是否可以 转换为对象
  try {
    return JSON.parse(value)
  } catch (error) {
    return value
  }
}
// 删除数据
//  1. 删除指定数据
export const removeItem = key => {
  window.localStorage.removeItem(key)
}
// 2. 删除所有数据
export const clear = () => {
  window.localStorage.clear()
}
