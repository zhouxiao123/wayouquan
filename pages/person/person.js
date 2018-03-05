// pages/person/person.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disflag1:'none',
    disflag2:'none'
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

 downMenue:function(e){
   if(e.currentTarget.dataset.type=="1"){
    if(this.data.disflag1=='none')
      this.setData({
        disflag1:'block'
      })
    else
      this.setData({
         disflag1: 'none'
      })
   } else {
     if (this.data.disflag2 == 'none')
       this.setData({
         disflag2: 'block'
       })
     else
       this.setData({
         disflag2: 'none'
       })

   }
 },addExcavator:function(){
   wx.navigateTo({
     url: '/pages/add_excavator/add_excavator',
   })
 }
})