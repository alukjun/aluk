const list = {
  url: '/menu/admin/pageMenu',
  method: 'get'
}

const update = {
  url: '/menu/admin/updateMenuById',
  method: 'put'
}

const updateStatus = {
  url: '/menu/admin/updateMenuStatusById',
  method: 'put'
}

// const del = {
//   url: '/menu/admin/deleteMenuById/[id]',
//   method: 'delete'
// }

const create = {
  url: '/menu/admin/createMenu',
  method: 'post'
}

export default {
  list,
  update,
  updateStatus,
  // del,
  create
}