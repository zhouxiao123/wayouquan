// pages/person_info/person_info.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oid: '',
    user:{},
    name:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var value = wx.getStorageSync('oid')

    if (value) {
      that.data.oid = value;
    } else {
      wx.login({
        success: function (res) {
          if (res.code) {
            //发起网络请求
            wx.request({
              url: app.globalData.baseUrl + 'wx/login',
              data: {
                code: res.code
              },
              success: function (res) {
                if (res.data == "") {
                  wx.showModal({
                    title: '提示',
                    content: '获取用户登录信息失败',
                    showCancel: false,
                    success: function (res) {
                      if (res.confirm) {
                        console.log('用户点击确定')
                      } else if (res.cancel) {
                        console.log('用户点击取消')
                      }
                    }
                  })
                }
                wx.setStorageSync('oid', res.data.oid)
                //继续处理上面的
                that.data.oid = res.data.oid;
              }
            })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
            wx.showModal({
              title: '提示',
              content: '获取用户登录状态失败',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
        }
      })
    }


    wx.showLoading({
      mask: true,
      title: '加载中'
    })
    wx.request({
      url: app.globalData.baseUrl + 'wx/getUserDetail',
      data: {
        oid: that.data.oid
      },
      success: function (res) {
        that.setData({
          user:res.data.user,
          name:res.data.user.name
        })
        wx.hideLoading()
      }
    })
  },
saveUser:function(){
  var that = this
  wx.showLoading({
    mask: true,
    title: '加载中'
  })
  wx.request({
    url: app.globalData.baseUrl + 'wx/mobile/user_update',
    data: {
      id: that.data.user.id,
      name:that.data.name,
      username:that.data.user.username,
    },
    method: 'POST',
    header: {
      //设置参数内容类型为json
      "content-type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      if(res.data.info=="ok"){
        wx.showModal({
          title: '提示',
          content: '修改成功',
          showCancel: false,
          success: function (res) {
            wx.navigateBack({
              
            })
          }
        })
      }
      wx.hideLoading()
    }
  })
  },
  setValue: function (event) {
    this.setData({
      name: event.detail.value
    });
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
  
  }
})