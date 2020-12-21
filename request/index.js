/* 
*使用Promise封装微信的异步请求
*因很多地方都要请求数据所有把请求数据时候的等待效果直接封装进去,实现请求数据的时候显示加载,请求结束关闭
*存在一个小BUG,当一个页面存在多个请求的时候应该当最后一个请求结束后才关闭加载效果,解决办法是用一个变量保存请求次数,当请求结束后变量为0在关闭效果
*/

// 同时发送异步代码的次数
let ajaxTimes=0;
export const request=(params)=>{
    //没请求一次ajaxTimes++
    ajaxTimes++
    //请求数据之前显示加载中效果
    wx.showLoading({
        title: "加载中",
        mask: true
    });
    //定义公共地址
    const baseUrl ="https://api-hmugo-web.itheima.net/api/public/v1";
    return new Promise((resolve,reject)=>{
        var reqTask = wx.request({
            ...params,
            url: baseUrl+params.url,
            success: (result)=>{
                resolve(result.data.message)
            },
            fail: (error)=>{
                reject(error)
            },
            complete: ()=>{
                //请求结束后
                ajaxTimes--
                //当请求的次数为0,关闭加载中效果
                if (ajaxTimes===0) {
                    //不管数据请求成功还是失败,最后关闭加载中效果
                    wx.hideLoading();
                }    
            }
        });
    })
}