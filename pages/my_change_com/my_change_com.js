// pages/my_change_com/my_change_com.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oid:'',
    cos: [],
    //下拉加载
    hasMore: true,
    pageOffset: 0,
    pageSize: 10,
    opacityflag: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    /*that.setData({
      id: options.id
    })*/
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
      url: app.globalData.baseUrl + 'wx/mobile/my_commodity',
      data: {
oid:that.data.oid
      },
      success: function (res) {
        //console.log(res.data)
        if (res.data.info=="not"){
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
        }else {
          for (var i in res.data.os) {
            res.data.os[i].co_path = res.data.os[i].co_path.replace('.', '_S.')

          }

          that.setData({
            cos:res.data.os
          })
        }


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

  },// 上拉加载回调接口
  onReachBottom: function () {
    // 我们用total和count来控制分页，total代表已请求数据的总数，count代表每次请求的个数。
    // 上拉时需把total在原来的基础上加上count，代表从count条后的数据开始请求。
    var that = this
    that.setData({
      hasMore: true,
      opacityflag: 1
    })

    wx.showLoading({
      mask: true,
      title: '加载中'
    })
    var poff = parseInt(that.data.pageOffset) + parseInt(that.data.pageSize);
    wx.request({
      url: app.globalData.baseUrl + 'wx/mobile/my_commodity',
      data: {
        pageOffset: poff,
        pageSize: that.data.pageSize,
        oid:that.data.oid
      },
      success: function (res) {
        //console.log(res.data)
        if (res.data.os.length == 0) {
          that.setData({
            hasMore: false,
          })
        } else {

          for (var i in res.data.os) {
            res.data.os[i].co_path = res.data.os[i].co_path.replace('.', '_S.')

          }

          that.data.cos = that.data.cos.concat(res.data.os)
          that.setData({
            cos: that.data.os,
            pageOffset: poff,
            opacityflag: 0
          })
        }
        wx.hideLoading()


      }
    })

  }, toDetail: function (e) {
    wx.navigateTo({
      url: '/pages/my_change_com_detail/my_change_com_detail?id=' + e.currentTarget.dataset.id,
    })
  }
})