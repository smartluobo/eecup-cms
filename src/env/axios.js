import apis from './apis';
import axios from 'axios';
import router from './router'

axios.defaults.withCredentials = true

const service = axios.create({
    baseUrl: apis.baseUrl
})

service.interceptors.request.use( function( config ) {
    // if ( config.url.endsWith( '.json' ) ) {
    //     return config;
    // }
    // console.log('config', config)
    return config;
} );


service.interceptors.response.use( res => {
    if ( res.data.code == 10045 ) {
      location.href = apis.baseUrl+"/screen_data/login/index?redirect=" + location.href;
      return {};
    }
    if ( res.data.code == 100009 ) {
      router.push('login') // 增加重定向
      return {};
    }
  return res;
});

export default service
