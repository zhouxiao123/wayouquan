// pages/home/home.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    tag: 0,
    ms1: [],
    ms2: [],
    search_name:'',

  },
  //事件处理函数
  bindViewTap: function () {
    /*wx.request({
      url: 'https://app.wayouquan.com', //仅为示例，并非真实的接口地址

      
      success: function (res) {
        console.log(res.data)
      }
    })*/
  },
  onLoad: function () {
    var that = this

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
      url: app.globalData.baseUrl + 'wx/mobile',
      data: {

      },
      success: function (res) {
        //console.log(res.data)
        for (var i in res.data.ms1) {
          res.data.ms1[i].cover_path = res.data.ms1[i].cover_path.replace('.', '_S.')
        }
        for (var i in res.data.ms2) {
          res.data.ms2[i].cover_path = res.data.ms2[i].cover_path.replace('.', '_S.')
        }
        that.setData({
          adv: res.data.advertisement,
          ms1: res.data.ms1,
          ms2: res.data.ms2
        })

        wx.hideLoading()
      }
    })

  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  swichNav: function (event) {

    if (this.data.tag == event.target.dataset.current) {
      return false;
    } else {
      this.setData({
        tag: event.target.dataset.current
      })
    }


  },
  more: function (e) {
    wx.navigateTo({
      url: '../more/more?type=' + e.currentTarget.dataset.type,
    })
  },
  toDetail: function (e) {
    wx.navigateTo({
      url: '../msdetail/msdetail?type=' + e.currentTarget.dataset.type + "&id=" + e.currentTarget.dataset.id,
    })
  },
  toIndex: function () {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  setValue: function (event) {
    this.setData({
      search_name: event.detail.value
    });
  },
  search: function (event) {
    wx.navigateTo({
      url: '/pages/more/more?type='+(parseInt(this.data.tag)+1)+'&search_name='+this.data.search_name,
    })
  }, toPerson: function () {
    wx.navigateTo({
      url: '/pages/person/person',
    })
  }
})