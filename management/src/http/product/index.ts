
const list = {
    url: '/product/admin/pageProduct.do',
    method: 'get'
  }
  const update = {
    url: '/product/admin/updateProductById.do',
    method: 'put'
  }
  
  const updateStatus = {
    url: '/product/admin/updateCategoryStatusById.do',
    method: 'put'
  }
  const updateImage = {
    url: '/product/admin/updateProductImageById.do',
    method: 'put'
  }

  
  
  // const del = {
  //   url: '/menu/admin/deleteMenuById/[id]',
  //   method: 'delete'
  // }
  
  const create = {
    url: '/product/admin/createProduct.do',
    method: 'post',
    type: 'upload'
  }
  
  export default {
    list,
    update,
    updateStatus,
    // del,
    create,
    updateImage
  }