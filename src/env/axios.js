import apis from './apis'
import axios from 'axios'

axios.defaults.withCredentials = true

const service = axios.create({
    baseUrl: apis.baseUrl
})

service.interceptors.request.use( function( config ) {
    // if ( config.url.endsWith( '.json' ) ) {
    //     return config;
    // }
    return config;
} );


service.interceptors.response.use( res => {
    if ( res.data.code == 10041 ) {
      location.href = apis.baseUrl+"/screen_data/login/index?redirect=" + location.href;
      return {};
    }
  return res;
});

export default service
