import request from '../utils/request'
// 获取全部频道列表
export const getAllLabelChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/channels'
  })
}
// 获取当前用户标签频道接口
export const getUserLabelChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/channels'
  })
}
// 获取当前频道的文章列表
export const getCurrentChannelList = params => {
  return request({
    url: '/app/v1_1/articles',
    method: 'GET',
    params
  })
}

// 添加用户频道
export const addUserChannel = (channel) => {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/channels',
    data: {
      channels: [channel]
    }
  })
}

// 删除用户频道
export const deleteUserChannel = channelId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/channels/${channelId}`
  })
}
