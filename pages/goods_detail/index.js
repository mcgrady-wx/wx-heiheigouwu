/* 
1 发送请求获取数据 
2 点击轮播图 预览大图
  1 给轮播图绑定点击事件
  2 调用小程序的api  previewImage 
3 点击 加入购物车
  1 先绑定点击事件
  2 获取缓存中的购物车数据 数组格式 
  3 先判断 当前的商品是否已经存在于 购物车
  4 已经存在 修改商品数据  执行购物车数量++ 重新把购物车数组 填充回缓存中
  5 不存在于购物车的数组中 直接给购物车数组添加一个新元素 新元素 带上 购买数量属性 num  重新把购物车数组 填充回缓存中
  6 弹出提示
4 商品收藏
  1 页面onShow的时候  加载缓存中的商品收藏的数据
  2 判断当前商品是不是被收藏 
    1 是 改变页面的图标
    2 不是 。。
  3 点击商品收藏按钮 
    1 判断该商品是否存在于缓存数组中
    2 已经存在 把该商品删除
    3 没有存在 把商品添加到收藏数组中 存入到缓存中即可
 */
import { request } from "../../request/index.js"; //引入封装的请求
import regeneratorRuntime from '../../lib/runtime/runtime'; //引入该文件才能使用async await来发送请求
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {},
    // 商品是否被收藏
    isCollect:false
  },
  //商品完整详情
  goodsInfo:{},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //因页面频繁被调用，所以不使用onLoad，onShow 无法在形参上接收 options参数 中获取传递过来得参数
    //获取当前页面栈。数组中第一个元素为首页，最后一个元素为当前页面
    let page=getCurrentPages() 
    //console.log(page)
    let currentPage=page[page.length-1]
    let options = currentPage.options
    //console.log(options)
    const { goods_id } = options;
    this.getGoodsDetail(goods_id);
    //由于getGoodsDetail()方法是异步获取的，所以在onShow中无法获得全局变量goodsInfo的数据
    //就不能在onShow中来判断该商品是否已经被收藏过，只能在请求回所有数据后来判断，即在getGoodsDetail（）中判断

  },
  async getGoodsDetail(goods_id){
    let res=await request({url:'/goods/detail',data:{goods_id}})
    //console.log(res)
    //保存商品详情
    this.goodsInfo=res
    //获得缓存中的收藏数据，来判断该商品是否被收藏，确定收藏图标的样式
    let collect=wx.getStorageSync('collect') || [];
    let isCollect=collect.some(v=>v.goods_id===this.goodsInfo.goods_id)
    //获取需要在页面显示得数据
    this.setData({
      goodsObj: {
        goods_name: res.goods_name,
        goods_price: res.goods_price,
        // iphone部分手机 不识别 webp图片格式 
        // 最好找到后台 让他进行修改 
        // 临时自己改 确保后台存在 1.webp => 1.jpg 
        goods_introduce: res.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: res.pics
      },
      isCollect
    })
  },
  //点击图片显示大图
  handlePrevewImage(e){
    //获得当前点击图片得url
    const current = e.currentTarget.dataset.url;
    //获得所有图片得url
    let urls=this.goodsInfo.pics.map(v=>v.pics_mid)
    //console.log(current)
    //微信API 预览大图
    wx.previewImage({
      current, // 当前显示图片的http链接
      urls // 需要预览的图片http链接列表
    })
  },
  //点击添加到购物车
  handleCartAdd(){
    //添加到购物车缓存中
    this.addGood()
    //给用户提示添加成功
    wx.showToast({
      title: '添加成功',
      mask: true,
    });
  },
  //点击立即购买
  goBuy(){
    //获得商品信息，添加到购物车缓存中，再跳转到购物车页面
    this.addGood()
    //跳转到购物车页面
    wx.switchTab({
      url: '/pages/cart/index',
    });
  },
  //封装函数，用于把商品添加到购物车数据中
  addGood(){
    //获取缓存中购物车得数据
    let cart=wx.getStorageSync('cart') || [];
    //查询当前商品是否在购物车数据中
    let index=cart.findIndex(v=>v.goods_id===this.goodsInfo.goods_id)
    if (index===-1) {//不存在
      this.goodsInfo.num=1 //商品数量
      this.goodsInfo.checked=true //选中商品
      //添加到购物车数据中
      cart.push(this.goodsInfo)
    } else {//存在，就购买数量加1
      cart[index].num++
    }
    //重新保存到缓存
    wx.setStorageSync('cart', cart);
  },
  //需要botton的open-type="share"，用于转发分享事件
  onShareAppMessage(res){
    console.log(res)
  },
  //点击收藏
  handleCollect(){
    //获得缓存中的收藏数据，来判断该商品是否被收藏
    let collect=wx.getStorageSync('collect') || [];
    let index=collect.findIndex(v=>v.goods_id===this.goodsInfo.goods_id)
    //判断
    if (index !== -1) {
      //已经收藏，删除收藏列表中该商品、保存新的收藏列表到缓存、把isCollect置为false
      collect.splice(index,1)
      wx.setStorageSync('collect', collect);
      this.setData({
        isCollect:false
      })
      //弹窗提示
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: false,
      });
    } else {
      //没有收藏，添加该商品到收藏列表、保存新的收藏列表到缓存、把isCollect置为true
      collect.push(this.goodsInfo)
      wx.setStorageSync('collect', collect);
      this.setData({
        isCollect:true
      })
      //弹窗提示
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: false,
      });
    }
  }
  
})