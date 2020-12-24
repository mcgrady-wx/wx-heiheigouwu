// pages/pay/index.js
import { request } from "../../request/index.js"; //引入封装的请求
import regeneratorRuntime from '../../lib/runtime/runtime'; //引入该文件才能使用async await来发送请求
import { requestPayment } from "../../utils/asyncWx.js";//使用promise形式封装的微信API
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart:[],
    totalPrice:0,
    totalNum:0
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //获取缓存中的收货地址
    const address=wx.getStorageSync('address')
    //获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart")
    //通过checked的属性值筛选出为true的产品
    cart=cart.filter(v=>v.checked)
    //计算总价和总数
    let totalPrice=0
    let totalNum=0
    cart.forEach(element => {     
      totalNum+=element.num
      totalPrice+=element.num*element.goods_price  
    });  
    this.setData({
      cart,
      totalNum,
      totalPrice,
      address
    })
  },
  
  //点击支付
  async handlePay(){
    /**
     * 支付思路
     * 1 先判断缓存中有没有token
      2 没有 跳转到授权页面 进行获取token 
      3 有token 。。。
      4 创建订单 获取订单编号，通过订单编号获得预支付接口，最后通过预支付接口的返回值通过wx.requestPayment调起微信支付的接口
      5 已经完成了微信支付
      6 手动删除缓存中 已经被选中了的商品 
      7 删除后的购物车数据 填充回缓存
      8 再跳转页面 
     */
    try {
      //判断缓存中是否有token
      const token = wx.getStorageSync("token");
      if (!token) {//没有
        wx.navigateTo({
          url: '/pages/auth/index'
        });
        return;
      }
      //有token，创建订单
      //准备请求头参数
      const header = { Authorization: token };
      //准备请求体参数
      const order_price=this.data.totalPrice
      const consignee_addr=this.data.address.all
      let goods = []
      const cart=this.data.cart
      cart.forEach(v=>{
        goods.push({
          goods_id: v.goods_id,
          goods_number: v.num,
          goods_price: v.goods_price
        })
      })
      //发起请求,获得订单编号
      const {order_number}=await request({url:'/my/orders/create',data:{order_price,consignee_addr,goods},method: "POST",header})
      //通过获得的order_number再发起支付请求获得pay
      const {pay}=await request({url:'/my/orders/req_unifiedorder',data:{order_number},method: "POST",header})
      //console.log(pay)
      //调起微信支付的API接口
      await requestPayment(pay)
      //正常流程，付款后查询后台 订单状态
      const res=await request({url:'/my/orders/chkOrder',data:{order_number},method: "POST",header})
      //弹窗提示支付成功
      wx.showToast({
        title: '支付成功',
        icon: 'none',
        duration: 1500,
        mask: false,
      });
      //删除缓存中cart中被选中了的商品 ，再重新保存到缓存
      let newCart=wx.getStorageSync('cart');
      newCart=newCart.filter(v=>!v.checked)
      wx.setStorageSync('cart', newCart);
      //跳转到订单页面
      wx.redirectTo({
        url: '/pages/order/index'
      });
      //由于是测试所以支付不会成功，为了模拟真实环境，在错误后执行请求获得订单状态之后的流程
    } catch (error) {
      // //弹窗提示支付失败
      // wx.showToast({
      //   title: '支付失败',
      //   icon: 'none',
      //   duration: 1500,
      //   mask: false,
      // });
      // console.log(error)
      wx.showToast({
        title: '支付成功',
        icon: 'none',
        duration: 1500,
        mask: false,
      });
      //删除缓存中cart中被选中了的商品 ，再重新保存到缓存
      let newCart=wx.getStorageSync('cart');
      newCart=newCart.filter(v=>!v.checked)
      wx.setStorageSync('cart', newCart);
      //跳转到订单页面
      wx.redirectTo({
        url: '/pages/order/index'
      });
    }
  }
  
})