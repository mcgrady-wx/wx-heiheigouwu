// pages/collect/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "商品收藏",
        isActive: true
      },
      {
        id: 1,
        value: "品牌收藏",
        isActive: false
      },
      {
        id: 2,
        value: "店铺收藏",
        isActive: false
      },
      {
        id: 3,
        value: "浏览器足迹",
        isActive: false
      }
    ],
    titles: [
      {
        id: 0,
        value: "全部",
        isActive: true
      },
      {
        id: 1,
        value: "正在热卖",
        isActive: false
      },
      {
        id: 2,
        value: "即将上线",
        isActive: false
      }
    ],
    collect:[]
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow(){
    //获取到缓存中收藏商品的信息
    const collect=wx.getStorageSync('collect') || [];
    this.setData({
      collect
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
  },
  //切换
  changItem(e){
    const {id}=e.currentTarget.dataset
    const {titles}=this.data
    titles.forEach(v=>v.id===id?v.isActive=true:v.isActive=false)
    this.setData({
      titles
    })
  }
  
})