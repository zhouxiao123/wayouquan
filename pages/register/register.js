// pages/register/register.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    name:'',
    invited:'',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    oid:''
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =this
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
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      
    } else if (this.data.canIUse) {
      
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
//console.log(that.data.oid)

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
  
  },setPhone:function(e){
    this.setData({
      phone:e.detail.value
    })
  }, setName: function (e) {
    this.setData({
      name: e.detail.value
    })
  }, setPassword: function (e) {
    this.setData({
      password: e.detail.value
    })
  }, setRePassword: function (e) {
    this.setData({
      repassword: e.detail.value
    })
  }, setInvited: function (e) {
    this.setData({
      invited: e.detail.value
    })
  }, register: function (e) {
    var that= this
    if (!validatePhone(this.data.phone)){
      wx.showModal({
        title: '提示',
        content: '请输入正确的手机号',
        showCancel: false,
        success: function (res) {

        }
      })
    } else if (this.data.name.length == 0){
      wx.showModal({
        title: '提示',
        content: '姓名不可为空',
        showCancel: false,
        success: function (res) {

        }
      })
    }/* else if (this.data.password.length < 6) {
      wx.showModal({
        title: '提示',
        content: '密码至少为6位',
        showCancel: false,
        success: function (res) {

        }
      })
    } else if (this.data.repassword != this.data.password) {
      wx.showModal({
        title: '提示',
        content: '两次输入的密码不一致',
        showCancel: false,
        success: function (res) {

        }
      })
    }*/ else {
      wx.showLoading({
        mask: true,
        title: '加载中'
      })
      wx.request({
        url: app.globalData.baseUrl + 'wx/mobile/bind_oid',
        data: {
          phone: that.data.phone,
          name: that.data.name,
          invited: that.data.invited,
          oid:that.data.oid,
          head: that.data.userInfo.avatarUrl,
          nickname: that.data.userInfo.nickName
        },
        method: 'POST',
        header: {
          //设置参数内容类型为json
          "content-type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          wx.hideLoading()
          //console.log(res.data)
          if(res.data.info != "ok"){
            wx.showModal({
              title: '提示',
              content: res.data.info,
              showCancel: false,
              success: function (res) {

              }
            })
          } else {

            if (getCurrentPages().length == 1) {
              wx.redirectTo({
                url: '/pages/index/index',
              })
            } else {
              wx.navigateBack()
              
            }
            

          }
        }
      })
    }

  }
})
function validatePhone(phone) {

  var reg = /^1[3|4|5|7|8][0-9]{9}$/; //验证规则

  var flag = reg.test(phone); //true
  /*if(phone.length == "0" || phone.length != "11"){
    return false;
  }*/
  return flag
}