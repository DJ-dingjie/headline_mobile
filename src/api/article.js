import request from '../utils/request'
import JSONBig from 'json-bigint'
// 获取文章详情
export const getArticleDetails = id => {
  return request({
    url: `/app/v1_0/articles/${id}`,
    method: 'GET'
  })
}
// 对文章点赞
export const likeArticle = id => {
  return request({
    url: '/app/v1_0/article/likings',
    method: 'POST',
    data: {
      target: JSONBig.parse(id) ? JSONBig.parse(id) : id
    }
  })
}

// 取消文章的点赞

export const cancelLike = id => {
  id = JSONBig.parse(id) ? JSONBig.parse(id) : id
  return request({
    url: `/app/v1_0/article/likings/${id}`,
    method: 'DELETE'
  })
}

// 收藏文章
export const collectArticle = id => {
  return request({
    url: '/app/v1_0/article/collections',
    method: 'POST',
    data: {
      target: JSONBig.parse(id) ? JSONBig.parse(id) : id
    }
  })
}

// 取消文章收藏
export const cancelCollectArticle = id => {
  id = JSONBig.parse(id) ? JSONBig.parse(id) : id
  return request({
    url: `/app/v1_0/article/collections/${id}`,
    method: 'DELETE'
  })
}
