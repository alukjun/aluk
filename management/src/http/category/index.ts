const list = {
  url: '/category/admin/pageCategory.do',
  method: 'get'
}

const update = {
  url: '/category/admin/updateCategoryById.do',
  method: 'put'
}

const updateStatus = {
  url: '/category/admin/updateCategoryStatusById.do',
  method: 'put'
}

// const del = {
//   url: '/menu/admin/deleteMenuById/[id]',
//   method: 'delete'
// }

const create = {
  url: '/category/admin/createCategory.do',
  method: 'post',
  type: 'upload'
}

export default {
  list,
  update,
  updateStatus,
  // del,
  create
}