// pages/cart/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart:[],
    allChecked:false,
    totalPrice:0,
    totalNum:0
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //获取缓存中的收货地址
    const address=wx.getStorageSync('address') || {}
    this.setData({
      address,
    })
    //获取缓存中的购物车数据
    const cart = wx.getStorageSync("cart") || [];
    //处理数据
    this.setCart(cart)
  },
  //点击添加地址
  handleChooseAddress(){
    /**
     * 1、因为当我们调取chooseAddress()的时候用户可能会点击取消。所有本来最开始应该使用getSetting()来获取到权限的状态，如果权限是false就使用openSetting()来打开权限
     * 再使用chooseAddress()
     * 2、但新版本微信取消了通讯地址项授权，所有上面的方法就不用了，直接使用chooseAddress()来获取用户通讯地址
   */
    let address={}
    //调用API获得用户的通讯地址信息
    wx.chooseAddress({
      success: (result)=>{
        address=result
        //拼接一个完整的地址
        address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo
        // 5 存入到缓存中
        wx.setStorageSync("address", address);
      },
      fail: ()=>{},
      complete: ()=>{}
    });
   
  },
  //商品点击复选框
  handeItemChange(e){
    //  获取被修改的商品的id
    const goods_id = e.currentTarget.dataset.id;
    //  获取购物车数组 
    let { cart } = this.data;
    //找到选中的商品
    let index=cart.findIndex(v=>v.goods_id===goods_id)
    //把选中的商品的checked取反
    cart[index].checked=!cart[index].checked
    //处理修改后的cart数据
    this.setCart(cart)
  },
  //点击增加减少
  handleItemNumEdit(e){
    //console.log(e.currentTarget.dataset)
    const {id,operation}=e.currentTarget.dataset
    //获得购物车数据
    let { cart } = this.data
    //找到选中商品，然后修改购买数量
    let index=cart.findIndex(v=>v.goods_id===id)
    if (cart[index].num<=1 && operation===-1) {//当商品数为1且点击减的时候，提示用户是否要删除商品
      //由于调用API，是异步处理，所有this指向存在问题。解决方法使用箭头函数
      wx.showModal({
        title: '提示',
        content: '您是否要删除？',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: (result) => {
          if (result.confirm) {
            //console.log('用户点击确定')
            //删除该商品
            cart.splice(index,1)
            //处理新的购物车数据
            this.setCart(cart)
          } else if (result.cancel) {
            console.log('用户点击取消')
          }
        },
      });
    } else {
      cart[index].num+=operation
      //处理新的购物车数据
      this.setCart(cart)
    }   
  },
  //全选复选框点击
  handleItemAllCheck(){
    //  获取购物车数组和当前复选框状态 
    let { cart,allChecked } = this.data;
    //把所有商品的checked状态改成!allChecked
    cart.forEach(v=>v.checked=!allChecked)
    //处理数据
    this.setCart(cart)
  },
  //自定义一个函数处理cart数据
  setCart(cart){
    //通过cart的值来判断allChecked、totalPrice、totalNum
    let totalPrice=0
    let totalNum=0
    let allChecked=cart.length===0?false:true //如果没有商品全选复选框就为false，如果有商品先默认勾选状态
    cart.forEach(element => {
      if (element.checked) {//选中状态
        totalNum+=element.num
        totalPrice+=element.num*element.goods_price
      } else {//有没选中状态，那么全选复选框为false
        allChecked=false
      }
    });
    //处理完数据，保存
    this.setData({
      cart,
      totalNum,
      totalPrice,
      allChecked
    })
    wx.setStorageSync('cart', cart);
  },
  //点击结算
  handlePay(){
    const {address,totalNum}=this.data;
    //首先判断收货地址是否获取到
    if (!address.userName) {
      wx.showToast({
        title: '请添加收货地址',
        icon: 'none',      
        mask: true,
      });
      return
    }
    //判断是否勾选了购买的商品
    if (totalNum===0) {
      wx.showToast({
        title: '还没有商品被选中',
        icon: 'none',      
        mask: true,
      });
      return
    }
    //跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index'
    });
  }
  
})