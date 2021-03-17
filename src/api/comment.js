import request from '../utils/request'
//  获取评论列表
export const getCommentsList = params => {
  return request({
    url: '/app/v1_0/comments',
    method: 'GET',
    params
  })
}
//  对评论或者回复点赞
export const likeComment = target => {
  return request({
    url: '/app/v1_0/comment/likings',
    method: 'POST',
    data: {
      target
    }
  })
}

// 取消对评论或者回复点赞
export const cancelLikeComment = target => {
  return request({
    url: `/app/v1_0/comment/likings/${target}`,
    method: 'DELETE'
  })
}

// 对文章评论
export const commentArticle = data => {
  return request({
    url: '/app/v1_0/comments',
    method: 'POST',
    data
  })
}
