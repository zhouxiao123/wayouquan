// pages/forgetpass/forgetpass.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  username:'',
  time: 60,
  disflag: ''
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
  setUsername:function(e){
    this.setData({
      username:e.detail.value
    })
  }, getCode:function(){
      //console.log(this.data.username)
      var that = this
      if(that.data.username.length==0){
        wx.showModal({
          title: '提示',
          content: '手机号不可为空',
          showCancel: false,
          success: function (res) {

          }
        })
      } else {
        wx.showLoading({
          mask: true,
          title: '加载中'
        })
        wx.request({
          url: app.globalData.baseUrl + 'wx/mobile/getvalidate',
          data: {
            username: that.data.username,
            type: "mod"
          },
          method: 'POST',
          header: {
            //设置参数内容类型为json
            "content-type": "application/x-www-form-urlencoded"
          },
          success: function (res) {

            wx.hideLoading()
            if (res.data.info != "ok") {
              wx.showModal({
                title: '提示',
                content: res.data.info,
                showCancel: false,
                success: function (res) {

                }
              })
            } else {
              that.setData({
                disflag: 'true',
                time: 60
              })
              showTime(that)
              wx.showModal({
                title: '提示',
                content: '发送成功',
                showCancel: false,
                success: function (res) {

                }
              })
            }
          }
        })




      }
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
  
  }, findPass:function(){
    
  }
})

function showTime(that) {
  that.data.time -= 1;
  that.setData({
    time: that.data.time
  })
  if (that.data.time == 0) {
    that.setData({
      time:60,
      disflag:''
    })
    return;
  }
  //每秒执行一次,showTime()  
  setTimeout(function () {showTime(that)}, 1000);
}