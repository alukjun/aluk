const list = {
  url: '/role/admin/pageRole.do',
  method: 'get'
}

const update = {
  url: '/role/admin/updateRoleById.do',
  method: 'put'
}

const updateStatus = {
  url: '/role/admin/updateRoleStatusById.do',
  method: 'put'
}

const create = {
  url: '/role/admin/createRole.do',
  method: 'post'
}

const detail = {
  url: '/role/admin/selectRoleById.do',
  method: 'get'
}
export default {
  list,
  update,
  updateStatus,
  create,
  detail
}