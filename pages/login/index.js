// pages/login/index.js
Page({

  handleGetUserInfo(e){
    //console.log(e)
    const {userInfo}=e.detail;
    //把个人信息保存到缓存中
    wx.setStorageSync('userInfo', userInfo);
    //返回
    wx.navigateBack({
      delta: 1
    });
  }
})