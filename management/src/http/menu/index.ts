const list = {
  url: '/menu/admin/pageMenu.do',
  method: 'get'
}

const update = {
  url: '/menu/admin/updateMenuById.do',
  method: 'put'
}

const updateStatus = {
  url: '/menu/admin/updateMenuStatusById.do',
  method: 'put'
}

const create = {
  url: '/menu/admin/createMenu.do',
  method: 'post'
}

export default {
  list,
  update,
  updateStatus,
  create
}