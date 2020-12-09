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

const del = {
  url: '/role/admin/deleteRoleById/[id]',
  method: 'delete'
}

const create = {
  url: '/role/admin/createRole',
  method: 'post'
}

export default {
  list,
  update,
  updateStatus,
  del,
  create
}