import { AxiosInstance } from "Axios";
import Axios from "Axios";

//全局配置Axios
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $Axios: AxiosInstance;
  }
}
import router from "../router";

Axios.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8'
const service = Axios.create({
  baseURL: 'api',
  // 超时
  timeout: 30000
})

// request拦截器
service.interceptors.request.use(
  config => {
    const autelToken = localStorage.getItem('token')
    if (autelToken) {
      config.headers['Authorization'] = autelToken
    }
    return config
  },
  error => {
    router.push('/login')
    Promise.reject(error)
  }
);

service.interceptors.response.use((response) => {
	return response.data
},(err) => {
  console.log(err)
});

export default {
  service
}