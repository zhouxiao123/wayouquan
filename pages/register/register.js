// pages/register/register.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    name:'',
    password:'',
    repassword:'',
    invited:''
  
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
    } else if (this.data.password.length < 6) {
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
    } else {
      wx.showLoading({
        mask: true,
        title: '加载中'
      })
      wx.request({
        url: app.globalData.baseUrl + 'wx/mobile/reg_save',
        data: {
          phone: that.data.phone,
          name: that.data.name,
          password: that.data.password,
          invited: that.data.invited
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
            
            /*wx.navigateTo({
              url: '/pages/person/person',
            })*/
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