// pages/order/index.js
import { request } from "../../request/index.js"; //引入封装的请求
import regeneratorRuntime from '../../lib/runtime/runtime'; //引入该文件才能使用async await来发送请求
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "全部",
        isActive: true
      },
      {
        id: 1,
        value: "待付款",
        isActive: false
      },
      {
        id: 2,
        value: "待收货",
        isActive: false
      },
      {
        id: 3,
        value: "退款/退货",
        isActive: false
      }
    ],
    orders:[]
  },
  UserToken:'',
  /**
   * 生命周期函数--监听页面显示
   */
  onShow(){
    const token = wx.getStorageSync("token");
    //没有token就去到授权页面授权
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/index'
      });
      return;
    }
    //有token，得到参数发起请求
    //保存token
    this.UserToken=token
    //获得type的值
    const pages=getCurrentPages()
    const {type}=pages[pages.length-1].options
    //console.log(type)
    //打开显示对应的tabs选项
    this.changeTitleByIndex(type-1)
    //发起请求获得数据
    this.getOrders(type,token)

  },
  // 根据标题索引来激活选中 标题数组
  changeTitleByIndex(index){
    let {tabs}=this.data
    tabs.forEach((el,i) => {
      i===index?el.isActive=true:el.isActive=false
    });
    this.setData({
      tabs
    })
  },
  //发起请求获得数据
  async getOrders(type,token){
    //准备请求头参数
    const header = { Authorization: token };
    //发起请求
    const res=await request({url:'/my/orders/all',data:{type},header})
    console.log(res)
    this.setData({
      orders:res.orders.map(v=>({...v,create_time_cn:(new Date(v.create_time*1000).toLocaleString())}))
    })
  },
  /**
   * 自定义事件，接收子元素传递过来数据处理tabs
   */
  handleTabsItemChange(e){
    //console.log(e.detail)
    //取得id，再把tabs中对映id元素的isActive值改为true
    const {id}=e.detail
    let {tabs}=this.data
    tabs.forEach(el => {
      el.id===id?el.isActive=true:el.isActive=false
    });
    this.setData({
      tabs
    })
    //重新发起请求获得数据 id是0-3 type是1-4
    this.getOrders(id+1,this.UserToken)
  }
  
})