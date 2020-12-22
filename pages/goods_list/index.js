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
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 2,
        value: "价格",
        isActive: false
      }
    ],
    goodsList:[]
  },
  //请求商品数据的参数对象
  paramsData:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10
  },
  //数组总页数
  totalPages:1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options)
    //把跳转url上面的参数赋值给参数对象paramsData
    this.paramsData.cid=options.cid || ''
    this.paramsData.query=options.query || ''
    this.getGoodsList()
  },
  //获取商品数据
  async getGoodsList(){
    const res=await request({url:'/goods/search',data:this.paramsData})
    //计算出商品总页数 总商品数/每页商品数量
    this.totalPages=Math.ceil(res.total/this.paramsData.pagesize)
    //console.log(res)
    this.setData({
      goodsList:[...this.data.goodsList,...res.goods]
    })
    //数据请求回来后，关闭下拉刷新效果
    wx.stopPullDownRefresh();
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
    //修改goodsList得数据，根据要求显示数据。这里就简单做重新请求一次数据
    this.setData({
      goodsList:[]
    })
    this.paramsData.pagenum=1
    this.getGoodsList()
  },
 
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    //下拉刷新重新获取数据
    //1、把当前数据置为空 2、把请求页码置为第1页 3、重新发起请求
    this.setData({
      goodsList:[]
    })
    this.paramsData.pagenum=1
    this.getGoodsList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //上拉加载更多，通过totalPages来判断是否还有数据
    if (this.paramsData.pagenum>=this.totalPages) {
      //没有数据了
      wx.showToast({
        title: '没有更多商品了',
        icon: 'none',
      });
    } else {
      //页码加1，再次请求数据
      this.paramsData.pagenum++
      this.getGoodsList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})