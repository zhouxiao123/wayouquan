// pages/change_com/chang_com.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  cos:[],
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
    wx.showLoading({
      mask: true,
      title: '加载中'
    })
    wx.request({
      url: app.globalData.baseUrl + 'wx/mobile/change_commodity',
      data: {

      },
      success: function (res) {
        //console.log(res.data)
        for (var i in res.data.cos) {
          res.data.cos[i].path = res.data.cos[i].path.replace('.', '_S.')
        }

        that.setData({
          cos: res.data.cos 
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
      url: app.globalData.baseUrl + 'wx/mobile/change_commodity',
      data: {
        pageOffset: poff,
        pageSize: that.data.pageSize,
        
      },
      success: function (res) {
        //console.log(res.data)
        if (res.data.cos.length == 0) {
          that.setData({
            hasMore: false,
          })
        } else {

          for (var i in res.data.cos) {
            res.data.cos[i].path = res.data.cos[i].path.replace('.', '_S.')
            
          }

          that.data.cos = that.data.cos.concat(res.data.cos)
          that.setData({
            cos: that.data.cos,
            pageOffset: poff,
            opacityflag: 0
          })
        }
        wx.hideLoading()


      }
    })

  }, toDetail:function(e){
      wx.navigateTo({
        url: '/pages/change_com_detail/change_com_detail?id='+e.currentTarget.dataset.id,
      })
  }
})