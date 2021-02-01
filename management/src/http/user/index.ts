const loginServer = {
  url: '/user/admin/login.do',
  method: 'post'
}

const list = {
  url: '/user/admin/pageUser.do',
  method: 'get'
}

const create = {
  url: '/user/admin/createUser.do',
  method: 'post'
}

const update = {
  url: '/user/admin/updateUserById.do',
  method: 'put',
}

// const del = {
//   url: '/user/admin/deleteUserById.do/[id]',
//   method: 'delete'
// }

const updateStatus = {
  url: '/user/admin/updateUserStatusById.do',
  method: 'put',
  atherUrl: null
}

const detail = {
  url: '/user/admin/selectUserById.do',
  method: 'get'
}

export default {
  loginServer,
  list,
  create,
  update,
  // del,
  updateStatus,
  detail
}