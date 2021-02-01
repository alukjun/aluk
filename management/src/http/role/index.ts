const list = {
  url: '/role/admin/pageRole',
  method: 'get'
}

const update = {
  url: '/role/admin/updateRoleById',
  method: 'put'
}

const updateStatus = {
  url: '/role/admin/updateRoleStatusById',
  method: 'put'
}

// const del = {
//   url: '/role/admin/deleteRoleById/[id]',
//   method: 'delete'
// }

const create = {
  url: '/role/admin/createRole',
  method: 'post'
}

const detail = {
  url: '/role/admin/selectRoleById',
  method: 'get'
}
export default {
  list,
  update,
  updateStatus,
  // del,
  create,
  detail
}