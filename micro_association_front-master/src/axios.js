import axios from 'axios'
import Vue from 'vue'

const instance = axios.create({
    baseURL: 'http://' + location.hostname + ':8080',
    timeout: 5000
})

import { Loading } from 'element-ui'
var loading
var loadingNum = 0

function startLoading() {
    if (loadingNum == 0) {
        loading = Loading.service({
            lock: true,
            // text: '拼命加载中...',
            background: 'rgba(255,255,255,0.5)',
        })
    }
    //请求数量加1
    loadingNum++
}

function endLoading() {
    //请求数量减1
    loadingNum--
    if (loadingNum <= 0) {
        loading.close()
    }
}

instance.interceptors.request.use(function(config) {
    // 在发送请求之前做些什么
    startLoading()
    config.headers.Authorization = localStorage.getItem('token')
    config.headers.session = sessionStorage.getItem('session')
    return config;
}, function(error) {
    // 对请求错误做些什么
    endLoading()
    return Promise.reject(error);
});

instance.interceptors.response.use(
    response => {
        //拦截响应，做统一处理 
        endLoading()
        if (response.data.hasOwnProperty('globalErrorMessage')) {
            var handleConfirm = () => {}
            if (response.data.globalErrorCode == 0) {
                handleConfirm = () => {
                    localStorage.removeItem('token')
                    window.location.href = 'http://152.136.97.240:60000/#/login'
                }
            }

            Vue.prototype.$alert(response.data.globalErrorMessage, '出错啦！', {
                confirmButtonText: '确认',
                callback: handleConfirm
            })
        }
        if (response.data.hasOwnProperty('_anti_csrf')) {
            sessionStorage.setItem('session', response.data._anti_csrf)
            console.log("get session" + response.data._anti_csrf)
        }
        return response
    },
    //接口错误状态处理，也就是说无响应时的处理
    error => {
        endLoading()
        return Promise.reject(error.response.status) // 返回接口返回的错误信息
    })

export default instance