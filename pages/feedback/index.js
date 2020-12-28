// pages/feedback/index.js
/* 
1 点击 “+” 触发tap点击事件
  1 调用小程序内置的 选择图片的 api chooseImage
  2 获取到 图片的路径  数组
  3 把图片路径 存到 data的变量中
  4 页面就可以根据 图片数组 进行循环显示 
2 点击删除图片
  1 获取被点击的元素的索引
  2 获取 data中的图片数组
  3 根据索引 数组中删除对应的元素
  4 把数组重新设置回data中
3 点击 “提交”
  1 获取文本域的内容 类似 输入框的获取
    1 data中定义变量 表示 输入框内容
    2 文本域 绑定 输入事件 事件触发的时候 把输入框的值 存入到变量中 
  2 对这些内容 合法性验证
  3 验证通过 用户选择的图片 上传到专门的图片的服务器 返回图片外网的链接 uploadFile
    1 遍历图片数组 
    2 挨个上传
    3 自己再维护图片数组 存放 图片上传后的外网的链接
  4 文本域 和 外网的图片的路径 一起提交到服务器 前端的模拟 不会发送请求到后台。。。 
  5 清空当前页面
  6 返回上一页 
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "体验问题",
        isActive: true
      },
      {
        id: 1,
        value: "商品、商家投诉",
        isActive: false
      }
    ],
    feedbacks: [
      {
        id: 0,
        value: "功能建议",
        isActive: true
      },
      {
        id: 1,
        value: "购买遇到问题",
        isActive: false
      },
      {
        id: 2,
        value: "性能问题",
        isActive: false
      },
      {
        id: 3,
        value: "其他",
        isActive: false
      }
    ],
    // 上传的图片路径 数组
    chooseImgs: [],
    //文本输入内容
    textVal:'',
  },
  //上传图片外网地址数组
  UpLoadImgs:[],
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
  //点击选择问题类型
  changItem(e){
    //console.log(e.currentTarget.dataset)
    const {id}=e.currentTarget.dataset
    const {feedbacks}=this.data
    feedbacks.forEach(v=>v.id===id?v.isActive=true:v.isActive=false)
    this.setData({
      feedbacks
    })
  },
  //文本输入
  handleTextInput(e){
    //console.log(e.detail.value)
    this.setData({
      textVal:e.detail.value
    })
  },
  //点击加号，上传图片
  handleChooseImg(){
    //使用内置API上传图片
    wx.chooseImage({
      count: 9,
      sizeType: ['original','compressed'],
      sourceType: ['album','camera'],
      success: (result)=>{
        //console.log(result.tempFiles)
        this.setData({
          chooseImgs:[...this.data.chooseImgs, ...result.tempFilePaths]
        })
      },
    });
  },
  //删除上传的图片
  handleRemoveImg(e){
    //console.log(e.currentTarget.dataset)
    //获得要删除图片的下标
    const {index}=e.currentTarget.dataset
    //获得要上传图片地址数组
    const {chooseImgs}=this.data
    //删除点击的图片
    chooseImgs.splice(index,1)
    //更新数组
    this.setData({
      chooseImgs
    })
  },
  //提交到后台
  handleFormSubmit(){
    //获取文本域的内容 图片数组
    const { textVal, chooseImgs } = this.data;
    //判断是否有文本内容，没有弹窗提示
    if (!textVal.trim()) {
      // 没有内容
      wx.showToast({
        title: '请描述一下您的问题',
        icon: 'none',
        mask: true
      });
      return;
    }
    // 显示正在等待提交
    wx.showLoading({
      title: "正在提交中",
      mask: true
    });
    //判断是否有上传的图片，如果有就准备上传图片 到专门的图片服务器，没有就直接发送请求提交文本
    if (chooseImgs.length!=0) {//有要上传的图片
      // 准备上传图片 到专门的图片服务器 ，上传文件的 api uploadFile不支持多个文件同时上传  解决方法遍历数组 挨个上传
      chooseImgs.forEach((v,i)=>{
        wx.uploadFile({
          // 图片要上传到哪里
          url: 'https://images.ac.cn/Home/Index/UploadAction/',
          // 被上传的文件的路径
          filePath: v,
          // 上传的文件的名称 后台来获取文件  file
          name: 'file',
          // 顺带的文本信息
          formData: {},
          success: (result)=>{
            //console.log(result)
            //let url = JSON.parse(result.data).url;
            this.UpLoadImgs.push(result);
            //上传图片的大小不一样，完成时间不同。所以判断是否最后一个上传完成，完成后进行下一步
            if (i===chooseImgs.length-1) {
              //所有的图片都上传完毕了
              //关闭提示
              wx.hideLoading();
              //重置文本内容
              this.setData({
                textVal:'',
                chooseImgs:[]
              })
              console.log("把文本的内容和外网的图片数组 提交到后台中");
              //返回
              wx.navigateBack({
                delta: 1
              });  
            }
          },
          fail: ()=>{},
          complete: ()=>{}
        });
      })

    } else {//没有图片
      //延时模拟提交后台
      setTimeout(() => {
        //关闭提示
        wx.hideLoading();
        //重置文本内容
        this.setData({
          textVal:''
        })
        console.log("只是提交了文本");
        //返回
        wx.navigateBack({
          delta: 1
        });
      }, 1000);
    }  
  }
  
})