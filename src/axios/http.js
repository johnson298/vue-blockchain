import axios from 'axios';

let pending = [];
const cancelToken = axios.CancelToken;
const removePending = (config) => {
  pending.forEach((d, index) => {
    if (d.url === `${config.url}&${config.method}`) {
      d.cancel();
      pending.splice(index, 1);
    }
  });
};
// 添加请求拦截器
axios.interceptors.request.use(config => {
  removePending(config);
  config.cancelToken = new cancelToken((c) => {
    pending.push({url: `${config.url}&${config.method}`, cancel: c});
  });
  return config;
}, error => {
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(response => {
  removePending(response.config);
  const code = Number(response.data.code);
  if (code !== 0) {
    // this.$message.success('');
  }
  return response.data;
}, error => {
  console.log(new Error(error));
  return {data: {}};
});

export const Ajax = (method, url, params) => {
  return new Promise((resolve, reject) => {
    if (params) {
      for (const field of Object.keys(params)) {
        if (params[field] === '' || params[field] === null) {
          delete params[field];
        }
      }
    }
    if (method === 'GET' && params) {
      let _data = '';
      for (let key in params) {
        _data += (_data ? ('&' + key + '=' + params[key]) : (key + '=' + params[key]));
      }
      url = url + '?' + _data;
    }
    axios({
      method,
      url,
      data: params,
      headers: {
        ContentType: 'application/json',
      }
    }).then(res => {
      if (res) {
        resolve(res);
      }
    }).catch(err => {
      reject(err);
    });
  });
};
