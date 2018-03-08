// pages/msdetail/msdetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  id:0,
  type:0,
  adv:{},
  m:{},
  coflag:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      id: options.id,
      type: options.type
    })
    //console.log(that.data.id + "------" + that.data.type)
    wx.showLoading({
      mask: true,
      title: '加载中'
    })
    wx.request({
      url: app.globalData.baseUrl + 'wx/mobile/detail',
      data: {
        id: that.data.id,
        type: that.data.type
      },
      success: function (res) {
        //console.log(transDate(res.data.m.buy_date, true))
        //console.log(res.data.m.create_time)
        if (res.data.m.buy_date == null){
          res.data.m.buy_date = '未知'
        } else {
          res.data.m.buy_date = transDate(res.data.m.buy_date, false)
        }
        //res.data.m.buy_date == null ? '未知' : transDate(res.data.m.buy_date,true)
        res.data.m.create_time = transDate(res.data.m.create_time, true)

        for (var i in res.data.m.mp) {
          res.data.m.mp[i].path = res.data.m.mp[i].path.replace('.', '_S.')
        }
        that.setData({
          adv: res.data.adv,
          m: res.data.m
        })

        wx.hideLoading()
      }
    })
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
  makePhone:function(e){
    var that = this
    wx.makePhoneCall({
      phoneNumber: that.data.m.phone,
    })
  },
  toHome: function () {
    wx.reLaunch({
      url: '/pages/home/home',
    })
  }, toPerson:function(){
    wx.navigateTo({
      url: '/pages/person/person',
    })
  }, cobutton:function(e){
    //console.log("----")
    if (this.data.coflag==1){
      this.setData({
        coflag:2
      })
    } else {
      this.setData({
        coflag: 1
      })
    }
  }
})
function transDate(mescStr,flag) {
  var n = mescStr;
  var date = new Date(n);
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  if(flag){
    return (Y + M + D + ' ' + hour + ':' + minute)
  } else {
    return (Y + M + D)
  }
}