// pages/user/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    // 被收藏的商品的数量
    collectNums:0
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow(){
    //获取缓存中的个人信息
    const userInfo=wx.getStorageSync('userInfo');
    //获取缓存中收藏商品的数量
    const collectNums=wx.getStorageSync('collect').length;
    this.setData({
      userInfo,
      collectNums
    })
  },

})