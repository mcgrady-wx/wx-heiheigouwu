// pages/auth/index.js
/**
 * 1、首先通过授权获得用户信息
 * 2、通过登录获得小程序登录成功后的code
 * 3、发送请求 获取用户的token
 * 4、保存token在缓存，跳转回支付页面
 */
import { request } from "../../request/index.js"; //引入封装的请求
import regeneratorRuntime from '../../lib/runtime/runtime'; //引入该文件才能使用async await来发送请求
import { login } from "../../utils/asyncWx.js";//使用promise形式封装的微信API
Page({
  async handleGetUserInfo(e){
    try {
      //console.log(e.detail)
      //获得所需的用户信息
      const {encryptedData,rawData,iv,signature} = e.detail
      //获得小程序登录成功后的code
      const {code}=await login()
      //发起请求获得token
      const {token}=await request({url:'/users/wxlogin',data:{encryptedData,rawData,iv,signature,code},method:"post"})
      //console.log(token)
      //保存token到缓存
      wx.setStorageSync('token', token);
      //返回支付界面
      wx.navigateBack({
        delta: 1
      });
      //由于使用的是测试账号，是肯定获取不到token的。必须是企业级的账号才能获取到正确的token
      //为了继续后面的业务，在错误里面模拟一个token，然后跳转回去
    } catch (error) {
      console.log(error)
      //模拟一个token，然后做后面的逻辑
      const token1="Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo"
      //保存token
      wx.setStorageSync('token', token1);
      //返回
      wx.navigateTo({
        url: '/pages/pay/index'
      });
    }
  }
  
})