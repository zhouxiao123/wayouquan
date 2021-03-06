// pages/jubao/jubao.js
var app = getApp()
Page({
  data: {
    disflag: 'none',
    showLecturer: "none",
    slideflag: 'none',
    img_url: [
      'yy@2x2.png',
      'yy@2x2.png'
    ],
    def_img_url: [
      'yy@2x2.png',
      'yy@2x2.png'
    ],
    animationData: {},
    lecturer: {},
    lecturerList: [],
    tag: 0,
    id:0,
    oid: '',
    preid: 0,
    askList: [],
    search_name: ''
  },
  onLoad: function (options) {
    
    wx.setNavigationBarTitle({ title: "举报" })
    var animation = wx.createAnimation({
      duration: 100,
      timingFunction: 'ease',
    })
    this.animation = animation

    var that = this

    that.setData({
      id:options.id
    })

    var value = wx.getStorageSync('oid')
    //console.log(value)
    if (value) {
      that.setData({ oid: value })
    } else {
      wx.login({
        success: function (res) {
          if (res.code) {
            //console.log(res);
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
                wx.setStorageSync('oid', res.data)
                //继续处理上面的
                that.setData({ oid: res.data })
              }
            })
          } else {
            //console.log('获取用户登录态失败！' + res.errMsg)
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




  },
  formSubmit: function (e) {
    //console.log('form发生了submit事件，携带数据为：', e.detail.value.text.length)
    var that = this
    if (e.detail.value.content.length == "0") {
      wx.showModal({
        title: '提示',
        content: '举报内容不可为空',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')

          }
        }
      })
      return false;
    } else if (e.detail.value.id==0){
      wx.showModal({
        title: '提示',
        content: '举报出错,请退出重试',
        showCancel: false,
        success: function (res) {
        }
      })
      return false;
    }
    wx.showLoading({
      mask: true,
      title: '加载中'
    })
    //console.log(e.detail.value)
    var that = this;
    wx.request({
      url: app.globalData.baseUrl + 'wx/mobile/jubao_save',
      data: e.detail.value,
      method: 'POST',
      header: {
        //设置参数内容类型为json
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        wx.hideLoading()
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
          wx.showModal({
            title: '提示',
            content: '举报已收到，我们将会尽快处理',
            showCancel: false,
            success: function (res) {
              wx.navigateBack()
            }
          })
        }
      }


    })
  }




})