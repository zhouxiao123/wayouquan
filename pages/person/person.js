// pages/person/person.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disflag1:'none',
    disflag2:'none',
    oid:'',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    user:{}
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
        wx.hideLoading()
        //console.log(res.data)
        if(res.data.info == "ok"){
          that.setData({
            user:res.data.user
          })
          wx.request({
            url: app.globalData.baseUrl + 'wx/updateUser',
            data: {
              oid: that.data.oid,
              head: that.data.userInfo.avatarUrl,
              nickname: that.data.userInfo.nickName
            },
            method: 'POST',
            header: {
              //设置参数内容类型为json
              "content-type": "application/x-www-form-urlencoded"
            },
            success: function (res) {

            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '请先绑定信息',
            showCancel: false,
            success: function (res) {
              wx.redirectTo({
                url: '/pages/register/register'
              })
            }
          })
        }
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
 },toRank:function(){
   wx.navigateTo({
     url: '/pages/rank/rank',
   })
 }, myCollect:function(){
   wx.navigateTo({
     url: '/pages/mycollect/mycollect',
   })
 }, myExcavator:function(){
   wx.navigateTo({
     url: '/pages/my_excavator/my_excavator',
   })
 }, onShareAppMessage: function (res) {
   var that = this
   wx.showLoading({
     mask: true,
     title: '加载中'
   })

   return {
     title: '您的好友邀请您加入挖友圈',
     path: '/pages/register/register?invited=' + that.data.user.cell_phone,
     imageUrl:'https://app.wayouquan.com/newexcavator/assets/images/wyqLogo.png',
     success: function (res) {
       // 转发成功
       wx.hideLoading()
     },
     fail: function (res) {
       // 转发失败
       wx.hideLoading()
     }
   }
 }
})