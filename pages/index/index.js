//index.js

import {request} from '../../request/index.js' //引入封装的请求

Page({
  data: {
    SwiperList:[],
    cateList:[],
    floorList:[]
  },
  onLoad(){//生命周期钩子函数,页面加载时.因数据不会频繁变化,使用onLoad.如数据频繁变化使用onShow
    this.getSwiperList()
    this.getCateList()
    this.getFloorList()
  },
  //获取轮播图信息
  getSwiperList(){
    request({url:'/home/swiperdata'}).then(res=>{
      //console.log(res)
      const SwiperList=res
      this.setData({
        SwiperList
      })
    })
  },
  //获取分类导航
  getCateList(){
    request({url:'/home/catitems'}).then(res=>{
      const cateList=res
      this.setData({
        cateList
      })
    })
  },
  //获得楼层显示数据
  getFloorList(){
    request({url:'/home/floordata'}).then(res=>{
      const floorList=res
      this.setData({
        floorList
      })
    })
  }
  
})
