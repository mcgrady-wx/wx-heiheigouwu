import { request } from "../../request/index.js"; //引入封装的请求
import regeneratorRuntime from '../../lib/runtime/runtime'; //引入该文件才能使用async await来发送请求


Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧的菜单数据
    leftMenuList: [],
    // 右侧的商品数据
    rightContent: [],
    // 被点击的左侧的菜单
    currentIndex: 0,
    // 右侧内容的滚动条距离顶部的距离
    scrollTop: 0
  },
  //保存请求下来的所有数据
  Cates:[],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    /**
     * 由于数据很大,把数据保存到缓存中,通过判断缓存和缓存有效时间来发起数据
     */
    //获取本地数据
    const cates=wx.getStorageSync("cates");
    if (!cates) {
       // 不存在  发送请求获取数据
       this.getCates();
    } else {
      //存在,判断有效时间 这设置有效期为5分钟
      if (Date.now()-cates.time>1000*60*5) {
        //超时了,重新发起请求
        this.getCates();
      } else {
        //使用缓存的数据
        this.Cates = cates.data;
        let leftMenuList=this.Cates.map(v=>v.cat_name)
        let rightContent=this.Cates[0].children
        //赋值
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }

  },
  //获取数据
  async getCates(){
    //发起请求获得数据
    const res=await request({url:"/categories"})
    //console.log(res)
    this.Cates=res
    //保存到缓存中
    wx.setStorageSync("cates", {data:this.Cates,time:Date.now()});
    //把获得的数据拆分成左右两块
    let leftMenuList=this.Cates.map(v=>v.cat_name)
    let rightContent=this.Cates[0].children
    //赋值
    this.setData({
      leftMenuList,
      rightContent
    })
  },
  //点击切换分类列表
  handleChangeItem(e){
    //console.log(e.currentTarget.dataset)
    const {index}=e.currentTarget.dataset
    //右侧显示内容更换
    let rightContent=this.Cates[index].children
    this.setData({
      currentIndex:index,
      rightContent,
      // 重新设置 右侧内容的scroll-view标签的距离顶部的距离
      scrollTop: 0
    })
  }

  
})