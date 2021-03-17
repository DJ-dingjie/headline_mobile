// 这是与用户相关的接口文件
// 导入axios 配置文件
import request from '../utils/request'

// 登陆接口，按需导出
export const login = params => {
  return request({
    method: 'POST',
    url: '/app/v1_0/authorizations',
    // 携带的参数
    data: params
  })
}
// 获取验证码的接口
export const getCode = mobile => {
  return request({
    method: 'GET',
    url: `/app/v1_0/sms/codes/${mobile}`
  })
}

export const getUserinfo = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user'
  })
}
//  关注用户
export const followUser = userId => {
  return request({
    url: '/app/v1_0/user/followings',
    method: 'POST',
    data: {
      target: userId
    }
  })
}
// 取消关注用户
export const cancelFollowUser = userId => {
  return request({
    url: `/app/v1_0/user/followings/${userId}`,
    method: 'DELETE'
  })
}

// 获取用户个人资料
export const getPersonalData = target => {
  return request({
    url: '/app/v1_0/user/profile',
    method: 'GET',
    params: {
      target
    }
  })
}
// 更新用户资料
export const updatePersonalData = data => {
  return request({
    url: '/app/v1_0/user/profile',
    method: 'PATCH',
    data
  })
}
/**
 * 更新用户照片资料
 */
export const updateUserPhoto = data => {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/photo',
    data
  })
}
