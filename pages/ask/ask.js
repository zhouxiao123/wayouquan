// pages/ask/ask.js
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
    oid: '',
    id:0,
    preid: 0,
    askList: [],
    search_name: '',
    //下拉加载
    hasMore: true,
    pageOffset: 0,
    pageSize: 20,
    opacityflag: 0

  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: "留言" })

    var that = this

      that.setData({
        id: options.id
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


    
  }
  
  ,
  formSubmit: function (e) {
    //console.log('form发生了submit事件，携带数据为：', e.detail.value.text.length)
    if (e.detail.value.content.length == "0") {
      wx.showModal({
        title: '提示',
        content: '留言内容不可为空',
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
    }
    wx.showLoading({
      mask: true,
      title: '加载中'
    })
    //console.log(e.detail.value)
    var that = this;
    wx.request({
      url: app.globalData.baseUrl + 'wx/mobile/ask_save',
      data: e.detail.value,
      method: 'POST',
      header: {
        //设置参数内容类型为json
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        //console.log(res.data);
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
            content: '留言成功',
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
})

function transDate(mescStr) {
  var n = mescStr;
  var date = new Date(n);
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  return (Y + M + D + ' ' + hour + ':' + minute)
}