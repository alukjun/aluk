import { createApp } from "vue";
import router from "/@/router";
import store from "/@/store";

import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";

import App from "/@/App.vue";
import "/@/styles/index.scss";
import md5 from "js-md5";
import server from '/@/http/api';
import axiosMethod from '/@/utils/axiosMethod';

let app= createApp(App);
app.config.globalProperties.$axios= server.service;
app.config.globalProperties.$md5 = md5;
app.config.globalProperties.$http = axiosMethod.http;
app.use(router);
app.use(store);
app.use(Antd);
app.mount("#app");