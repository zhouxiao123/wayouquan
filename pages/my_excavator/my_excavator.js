// pages/my_excavator/my_excavator.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tag: -1,
    typelist: [{ id: 0, name: '全部' }, { id: 1, name: '挖掘机' }, { id: 2, name: '装载机' }],
    type_name: '',
    type_id: 0,
    brand: [],
    brand_name: '',
    brand_id: 0,
    city: [],
    city_name: '',
    city_id: 0,
    data: {},
    oid:'',
    //下拉加载
    hasMore: true,
    pageOffset: 0,
    pageSize: 10,
    opacityflag: 0,
    animationData: {},
    search_name: '',
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


 
    wx.showLoading({
      mask: true,
      title: '加载中'
    })
    wx.request({
      url: app.globalData.baseUrl + 'wx/mobile/publicList',
      data: {
        oid: that.data.oid
      },
      success: function (res) {
        //console.log(transDate(res.data.m.buy_date, true))
        //console.log(res.data.m.create_time)
        if(res.data.info=="ok"){
        for (var i in res.data.ms) {
          res.data.ms[i].cover_path = res.data.ms[i].cover_path.replace('.', '_S.')
          res.data.ms[i].buy_date == null ? res.data.ms[i].buy_date = '未知' : res.data.ms[i].buy_date = transDate(res.data.ms[i].buy_date, 1)
          res.data.ms[i].create_time = fromNowToDate(res.data.ms[i].create_time)
        }

        

        
        that.setData({
          data: res.data
        })
        }
        wx.hideLoading()
      }
    })
  },
  toDetail: function (e) {
    wx.navigateTo({
      url: '../msdetail/msdetail?id=' + e.currentTarget.dataset.id +"&from=own",
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

  }, bindTypeChange: function (e) {
    this.setData({
      type_name: this.data.typelist[e.detail.value].name,
      type_id: this.data.typelist[e.detail.value].id,
      tag: -1
    })
    this.search();
  }, bindCityChange: function (e) {
    this.setData({
      city_name: this.data.city[e.detail.value].name,
      city_id: this.data.city[e.detail.value].id,
      tag: -1
    })
    this.search();
  }, bindBrandChange: function (e) {
    this.setData({
      brand_name: this.data.brand[e.detail.value].name,
      brand_id: this.data.brand[e.detail.value].id,
      tag: -1
    })
    this.search();
  },
  setValue: function (event) {
    this.setData({
      search_name: event.detail.value
    });
  },
  /*search: function (event) {
    //console.log(this.data.search_name)
    var that = this
    wx.showLoading({
      mask: true,
      title: '加载中'
    })
    wx.request({
      url: app.globalData.baseUrl + 'wx/mobile/list',

      data: {
        search_name: this.data.search_name,
        type: this.data.type_id,
        city_name: this.data.city_name,
        city_id: this.data.city_id,
        exb_name: this.data.brand_name,
        exb_id: this.data.brand_id
      },
      success: function (res) {
        //console.log(res.data)
        for (var i in res.data.ms) {
          res.data.ms[i].cover_path = res.data.ms[i].cover_path.replace('.', '_S.')
          res.data.ms[i].buy_date == null ? res.data.ms[i].buy_date = '未知' : res.data.ms[i].buy_date = transDate(res.data.ms[i].buy_date, 1)
          res.data.ms[i].create_time = fromNowToDate(res.data.ms[i].create_time)
        }
        that.setData({
          data: res.data,
          pageOffset: 0
        })
        wx.hideLoading()
      }
    })
  },*/

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
      url: app.globalData.baseUrl + 'wx/mobile/publicList',
      data: {
        pageOffset: poff,
        pageSize: that.data.pageSize,
        oid:that.data.oid
      },
      success: function (res) {
        //console.log(res.data)
        if (res.data.ms.length == 0) {
          that.setData({
            hasMore: false,
          })
        } else {

          for (var i in res.data.ms) {
            res.data.ms[i].cover_path = res.data.ms[i].cover_path.replace('.', '_S.')
            res.data.ms[i].buy_date == null ? res.data.ms[i].buy_date = '未知' : res.data.ms[i].buy_date = transDate(res.data.ms[i].buy_date, 1)
            res.data.ms[i].create_time = fromNowToDate(res.data.ms[i].create_time)
          }

          that.data.data.ms = that.data.data.ms.concat(res.data.ms)
          that.setData({
            data: that.data.data,
            pageOffset: poff,
            opacityflag: 0
          })
        }
        wx.hideLoading()


      }
    })

  },
  swichNav: function (event) {

    if (this.data.tag == event.currentTarget.dataset.current) {
      return false;
    } else {
      this.setData({
        tag: event.currentTarget.dataset.current
      })
    }


  },
  toHome: function () {
    wx.reLaunch({
      url: '/pages/home/home',
    })
  }, toPerson: function () {
    wx.navigateTo({
      url: '/pages/person/person',
    })
  }, changClose:function(e){
    var that=this
    wx.showModal({
      title: '提示',
      content: '是否确认修改',
      showCancel: true,
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            mask: true,
            title: '加载中'
          })
          wx.request({
            url: app.globalData.baseUrl + 'wx/mobile/change_close',
            data: {
              id: e.currentTarget.dataset.id,
              close: (e.currentTarget.dataset.close + 1) % 2
            },
            success: function (res) {
              //console.log(res.data)
              if(res.data.change==1){
                wx.showModal({
                  title: '提示',
                  content: '修改成功',
                  showCancel: false,
                  success: function (res) {
                    if (res.confirm) {
                        that.onLoad()
                    }
                  }
                })
              }
              wx.hideLoading()
            }
          })
        }
      }
    })
    
  }
})
function transDate(mescStr, flag) {
  var n = mescStr;
  var date = new Date(n);
  if (flag == 1) {
    return date.getFullYear()
  }
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  if (flag == 2) {
    return (Y + M + D)
  }
  return (Y + M + D + ' ' + hour + ':' + minute)
}
function fromNowToDate(mescStr) {
  var n = mescStr;
  var date = new Date(n);
  var now = new Date();
  var time = now.getTime() - date.getTime();
  //Calendar cal = Calendar.getInstance();
  //cal.setTimeInMillis(time);
  //Integer i = cal.get(Calendar.DAY_OF_YEAR);
  time = time / 1000;
  var m = time / 60;
  var h = m / 60;
  var d = h / 24;
  //System.out.println("------"+d);
  if (parseInt(d) == 0) {
    //System.out.println("+++++"+h);
    if (parseInt(h) == 0) {
      //Integer m = cal.get(Calendar.MINUTE);
      //System.out.println("======"+m);
      return parseInt(m) + "分钟以前发布";
    } else {
      return parseInt(h) + "小时以前发布";
    }
  } else if (parseInt(d) == 1) {
    return "昨天发布";
  } else {
    return transDate(date, 2) + " 发布";
  }
}