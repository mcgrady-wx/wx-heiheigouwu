// components/Tabs/Tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs:{
      type:Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    //点击切换标签事件
    handleItemTap(e){
      //获得点击的标签id
      const {id}=e.currentTarget.dataset;
      //通过调用父元素的自定事件把参数传递给父元素
      this.triggerEvent('tabsItemChange',{id})
    }
  }
})
