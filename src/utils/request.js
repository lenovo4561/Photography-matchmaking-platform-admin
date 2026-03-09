import axios from "axios";
import { MessageBox, Message } from "element-ui";
import store from "@/store";
import { getToken } from "@/utils/auth";

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API || "http://localhost:7001", // 后端地址（生产环境使用域名）
  timeout: 10000,
});

// request interceptor
service.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (!res.success) {
      Message({
        message: res.message || "请求失败",
        type: "error",
        duration: 5 * 1000,
      });
      if (res.message && res.message.includes("token")) {
        MessageBox.confirm("登录已过期，请重新登录", "提示", {
          confirmButtonText: "重新登录",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          store.dispatch("user/resetToken").then(() => {
            location.reload();
          });
        });
      }
      return Promise.reject(new Error(res.message || "Error"));
    } else {
      return res;
    }
  },
  (error) => {
    const msg = error.response?.data?.message || error.message;
    Message({ message: msg, type: "error", duration: 5 * 1000 });
    return Promise.reject(error);
  }
);

export default service;
