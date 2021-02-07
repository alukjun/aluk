
const list = {
    url: '/product/admin/pageProduct',
    method: 'get'
  }
  const update = {
    url: '/product/admin/updateProductById',
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
    url: '/product/admin/createProduct',
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