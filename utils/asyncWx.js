/**
 * promise 形式  login
 */

export const login=()=>{
    return new Promise((resolve,reject)=>{
        wx.login({
            timeout:10000,
            success: (result)=>{
                resolve(result)
            },
            fail: (err)=>{
                reject(err)
            },
            complete: ()=>{}
        });
    })
}

/**
 * promise 形式  requestPayment
 */

export const requestPayment=(pay)=>{
    return new Promise((resolve,reject)=>{
        wx.requestPayment({
            ...pay,
            success: (result)=>{
                resolve(result)
            },
            fail: (err)=>{
                reject(err)
            },
            complete: ()=>{}
        });
    })
}