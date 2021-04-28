import server from '../http/api'
function http(params: any) {
  return new Promise((resolve, reject) => {
    let body = {}
    if (params.url.indexOf('[') > 0) {
      let path = params.url
      for (let k in params.data) {
        path = path.replace(`[${k}]`, params.data[k])
      }
      params.url = path
    }
    console.log(params.data)
    if (params.method === 'get') {
      body = {
        method: params.method,
        url: params.url,
        params: params.data,
      }
    } else if (params.type === 'upload') {
      body = {
        method: params.method,
        url: params.url,
        data: params.data,
      }
    } else {
      body = {
        method: params.method,
        url: params.url,
        data: params.data,
      }
    }
    server.service({...body}).then(res => {
      console.log(res)
        resolve(res.data);
      })
      .catch(err =>{
          reject(err.data)
      })
  });
}

export default {
  http
}