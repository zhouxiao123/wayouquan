// pages/change_com_detail/change_com_detail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oid: '',
    user: {},
    id:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  //console.log(options.id)
  var that = this
  that.setData({
    id:options.id
  })
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
        user: res.data.user
      })
      wx.request({
        url: app.globalData.baseUrl + 'wx/mobile/commodity_detail',
        data: {
            id:that.data.id,
            oid:that.data.oid
        },
        success: function (res) {
          //console.log(res.data)
          if (res.data.info == "not") {
            wx.showModal({
              title: '提示',
              content: '请先绑定信息',
              showCancel: false,
              success: function (res) {
                wx.navigateTo({
                  url: '/pages/register/register'
                })
              }
            })
          } else {

            that.setData({
              co: res.data.co
            })
          }

          wx.hideLoading()
        }
      })

    }
  })
  },
formSubmit: function (e) {
    var that = this
    //console.log(this.data.files)
    var value = e.detail.value
    //console.log()
    if (value.name.length <= 0) {
      wx.showModal({
        title: '提示',
        content: '请输入姓名',
        showCancel: false,
        success: function (res) {
        }
      })

    } else if (value.phone.length <= 0) {
      wx.showModal({
        title: '提示',
        content: '请输入联系电话',
        showCancel: false,
        success: function (res) {
        }
      })

    } else if (value.address.length <= 0) {
      wx.showModal({
        title: '提示',
        content: '请输入收货地址',
        showCancel: false,
        success: function (res) {
        }
      })

    } else{
      wx.showLoading({
        mask: true,
        title: '加载中'
      })
      wx.request({
        url: app.globalData.baseUrl + 'wx/mobile/commodity_change_save',
        method: 'POST',
        header: {
          //设置参数内容类型为json
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          id:that.data.id,
          user_id:that.data.user.id,
          name:value.name,
          phone:value.phone,
          address:value.address,
        },
        success: function (res) {
          wx.hideLoading()
          console.log(res.data)
          if (res.data.error == 1) {
            wx.showModal({
              title: '提示',
              content: '积分不足',
              showCancel: false,
              success: function (res) {
              }
            })
          } else {
            wx.showModal({
              title: '提示',
              content: '兑换成功',
              showCancel: false,
              success: function (res) {
                wx.navigateBack({
                  
                })
              }
            })
          }
        }
      })
    }
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