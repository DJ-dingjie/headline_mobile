import request from '../utils/request'
// 获取用户搜索的历史
export const getSearchHistory = () => {
  return request({
    url: '/app/v1_0/search/histories',
    method: 'GET'
  })
}
// 删除用户搜索历史
export const delSearchHistory = () => {
  return request({
    url: '/app/v1_0/search/histories',
    method: 'DELETE'
  })
}

// 获取搜索的建议
export const getSearchSuggestions = (q) => {
  return request({
    url: '/app/v1_0/suggestion',
    method: 'GET',
    params: {
      q
    }
  })
}

// 获取搜索的结果
export const getSearchRes = (query) => {
  return request({
    url: '/app/v1_0/search',
    method: 'GET',
    params: query
  })
}
