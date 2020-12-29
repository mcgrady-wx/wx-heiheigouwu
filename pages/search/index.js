/* 
1 输入框绑定 值改变事件 input事件
  1 获取到输入框的值
  2 合法性判断 
  3 检验通过 把输入框的值 发送到后台
  4 返回的数据打印到页面上
2 防抖 （防止抖动） 定时器  节流 
  0 防抖 一般 输入框中 防止重复输入 重复发送请求
  1 节流 一般是用在页面下拉和上拉 
  1 定义全局的定时器id
 */
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods:[],
    // 取消 按钮 是否显示
    isFocus:false,
    // 输入框的值
    inpValue:""
  },
  //用于保存计时器ID
  TimeId:-1,
  //输入框输入事件
  handleInput(e){
    //console.log(e)
    //获得输入的内容
    const {value}=e.detail;
    //判断输入内容的合法性
    if(!value.trim()){
      this.setData({
        goods:[],
        isFocus:false
      })
      // 值不合法
      return;
    }
    //值合法，显示取消按钮
    this.setData({
      isFocus:true
    })
    //防抖处理
    //每当输入变化都会执行该函数，为了防止每次变化都去请求数据，就使用计时器
    //原理，当执行该函数时候首先清理掉上一次计时器，然后启动一个计时器延迟发送请求数据。每当输入的间隔时间小于计时器的延迟时间的时候，都会先清理计时器，那么就不会发送请求。实现了防抖，节约了请求次数
    clearTimeout(this.TimeId)
    this.TimeId=setTimeout(() => {
      //发起请求获得数据
      this.qsearch(value);
    }, 1000);
    
  },
  //请求搜索数据
  async qsearch(value){
    const res=await request({url:'/goods/qsearch',data:{query:value}})
    //console.log(res)
    this.setData({
      goods:res
    })
  },
  //点击取消
  handleCancel(){
    //清空data中的数据，隐藏按钮
    this.setData({
      goods:[],   
      isFocus:false,
      inpValue:""
    })
  },
})