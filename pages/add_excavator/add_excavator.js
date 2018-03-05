// pages/add_excavator/add_excavator.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    brand_value:0,
    version_value: 0,
    et_id:0,
    et_name:'',
    et:[],
    cs_id: 0,
    cs_name: '',
    cs:[],
    brand_id: 0,
    brand_name: '',
    brandList:[],
    version_id: 0,
    version_name: '',
    versionList:[]
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
      url: app.globalData.baseUrl + 'wx/mobile/add',
      data: {

      },
      success: function (res) {
        //console.log(res.data)
        that.setData({
          et: res.data.et,
          cs: res.data.cs
        })
        that.bindTypeChange({detail:{value:0}})
        wx.hideLoading()
      }
    })
  }, bindTypeChange:function(e){
    //console.log(e)
    var that = this
    that.setData({
      et_id: that.data.et[e.detail.value].id,
      et_name: that.data.et[e.detail.value].name
    })
    wx.request({
      url: app.globalData.baseUrl + 'mobile/getBrand',
      data: {
        id: that.data.et[e.detail.value].id
      },
      success: function (res) {
        //console.log(res.data)
        that.setData({
          brandList: res.data,
          brand_id: res.data[0].id,
          brand_name: res.data[0].name,
          brand_value: 0
        })
        wx.request({
          url: app.globalData.baseUrl + 'mobile/getVersion',
          data: {
            tid: that.data.et[e.detail.value].id,
            bid: res.data[0].id
          },
          success: function (res) {
            //console.log(res.data)
            that.setData({
              versionList: res.data,
              version_id: res.data[0].id,
              version_name: res.data[0].name,
              version_value: 0
            })
          }
        })
      }
    })
  }, bindBrandChange: function (e) {
    //console.log(e)
    var that = this
    that.setData({
      brand_id: that.data.brandList[e.detail.value].id,
      brand_name: that.data.brandList[e.detail.value].name,
      brand_value: e.detail.value
    })
        wx.request({
          url: app.globalData.baseUrl + 'mobile/getVersion',
          data: {
            tid: that.data.et_id,
            bid: that.data.brandList[e.detail.value].id
          },
          success: function (res) {
            //console.log(res.data)
            that.setData({
              versionList: res.data,
              version_id: res.data[0].id,
              version_name: res.data[0].name,
              version_value: 0
            })
          }
        })
  },bindVersionChange(e){
    var that = this
    that.setData({
      version_id: that.data.versionList[e.detail.value].id,
      version_name: that.data.versionList[e.detail.value].name,
      version_value: e.detail.value
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})