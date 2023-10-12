import { Send } from "../../utils/Http";
import { Toast } from "../../view/common";
// import { Toast } from "native-base";
let TaskApi = {};


TaskApi.startTask = () => { // 
    return new Promise((resolve, reject) => {
        Send(`api/System/DoTask`, {}, 'get')
        .then((res) => {
            resolve(res)
        })
        .catch((err) =>{
            reject(err)
            console.log('err', err)
        })
    })
}

TaskApi.quickenTask = () => { // 
    return new Promise((resolve, reject) => {
        Send(`api/System/QuickenTask`, {}, 'get')
        .then((res) => {
            resolve(res)
        })
        .catch((err) =>{
            reject(err)
            console.log('err', err)
        })
    })
}

TaskApi.lookDayVideo = (vId) => { // 
    return new Promise((resolve, reject) => {
        Send(`api/Ticket/LookTodayVideo?vId=${vId}`, {}, 'get')
        .then((res) => {
            resolve(res)
        })
        .catch((err) =>{
            reject(err)
            console.log('err', err)
        })
    })
}


TaskApi.vipDoTask = () => { 
    return new Promise((resolve, reject) => {
        Send(`api/Coin/VipDoTask`, {}, 'get')
        .then((res) => {
            if (res.code == 200) {
                resolve(res.data)
            }else{
                reject(res)
            }
        })
        .catch((err) =>{
            reject(err)
            console.log('err', err)
        })
    })
}




export default TaskApi