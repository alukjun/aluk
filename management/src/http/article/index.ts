const list = {
  url: '/introduce/admin/pageIntroduce.do',
  method: 'get'
}

const update = {
  url: '/introduce/admin/updateIntroduceById.do',
  method: 'put'
}

const updateStatus = {
  url: '/introduce/admin/deleteIntroduceById.do',
  method: 'put'
}

const create = {
  url: '/introduce/admin/createIntroduce.do',
  method: 'post',
  type: 'upload'
}

const updateImage = {
  url: '/introduce/admin/updateIntroduceImageById.do',
  method: 'put'
}

export default {
  list,
  update,
  updateStatus,
  create,
  updateImage
}