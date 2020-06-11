//1）、导入axios模块
import axios from 'axios'

//2）、创建axios实例，初始化属性（baseUrl、超时时间）
const service = axios.create({
    baseURL : 'http://localhost:5000',
    timeout : 5000
})

//3）、请求拦截器

//4）、响应拦截器
service.interceptors.response.use(response=>{
    const res = response.data

    if(res.code!=1000){
        return Promise.reject(new Error(res.message || 'Error'))
    }else{
        return res
    }

},error=>{
    console.log('err：'+error);

    return Promise.reject(error)
})

//5）、暴露出axios对象
export default service
