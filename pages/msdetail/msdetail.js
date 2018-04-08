// pages/msdetail/msdetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  id:0,
  type:0,
  adv:{},
  m:{},
  coflag:1,
  oid:'',
  fromtag: 0,
  own:0,
  askList:[],
  user: {},
  urlList:[],
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
    that.setData({
      id: options.id,
      type: options.type
    })

    if(options.from=="user"){
      that.setData({
        fromtag:1
      })
    }
    if (options.from == "own") {
      that.setData({
        fromtag: 1,
        own:1
      })
    }
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

    wx.request({
      url: app.globalData.baseUrl + 'wx/getUserDetail',
      data: {
        oid: that.data.oid
      },
      success: function (res) {
        wx.hideLoading()
        //console.log(res.data)
        if (res.data.info == "ok") {
          that.setData({
            user: res.data.user
          })
        }
      }
    })
    //console.log(that.data.id + "------" + that.data.type)
    wx.showLoading({
      mask: true,
      title: '加载中'
    })
    wx.request({
      url: app.globalData.baseUrl + 'wx/mobile/detail',
      data: {
        id: that.data.id,
        type: that.data.type
      },
      success: function (res) {
        //console.log(transDate(res.data.m.buy_date, true))
        //console.log(res.data.m.create_time)
        if (res.data.m.buy_date == null){
          res.data.m.buy_date = '未知'
        } else {
          res.data.m.buy_date = transDate(res.data.m.buy_date, false)
        }
        //res.data.m.buy_date == null ? '未知' : transDate(res.data.m.buy_date,true)
        res.data.m.create_time = transDate(res.data.m.create_time, true)
        var imgurl = [];
        for (var i in res.data.m.mp) {
          imgurl.push('https://app.wayouquan.com/newexcavator/img/'+res.data.m.mp[i].path)
          res.data.m.mp[i].path = res.data.m.mp[i].path.replace('.', '_S.')
        }
        that.setData({
          adv: res.data.adv,
          m: res.data.m,
          urlList:imgurl
        })

        wx.request({
          url: app.globalData.baseUrl + 'wx/is_collect_machine',
          data: {
            mid: that.data.id,
            oid: that.data.oid
          },
          success: function (res) {
            if (res.data.result=="ok"){

              that.setData({
                coflag:2
              })

            }
            

            wx.hideLoading()
          }
        })
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
    wx.showLoading({
      mask: true,
      title: '加载中'
    })
    //console.log(e.detail.value)
    var that = this;
    wx.request({
      url: app.globalData.baseUrl + 'wx/mobile/ask_list',
      data: {
        m_id:that.data.id
      },
      success: function (res) {
        //console.log(res.data);
       wx.hideLoading()
       for (var i in res.data.askList) {
    
         res.data.askList[i].createtime = transDate(res.data.askList[i].createtime,true)
       }
          that.setData({
            askList: res.data.askList
          })

      }
    })
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
  delAsk:function(e){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否确认删除',
      showCancel: true,
      success: function (res) {
        if(res.confirm){
          wx.showLoading({
            mask: true,
            title: '加载中'
          })
          //console.log(e.detail.value)
          
          wx.request({
            url: app.globalData.baseUrl + 'wx/mobile/ask_delete',
            data: {
              id: e.currentTarget.dataset.id
            },
            success: function (res) {
              wx.hideLoading()
              //console.log(res.data);
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 1000
              }) 
              wx.request({
                url: app.globalData.baseUrl + 'wx/mobile/ask_list',
                data: {
                  m_id: that.data.id
                },
                success: function (res) {
                  //console.log(res.data);

                  
                  for (var i in res.data.askList) {

                    res.data.askList[i].createtime = transDate(res.data.askList[i].createtime, true)
                  }
                  that.setData({
                    askList: res.data.askList
                  })

                }
              })
              


            }
          })
        }
      }
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
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
      url: app.globalData.baseUrl + 'wx/mobile/ask_list',
      data: {
        pageOffset: poff,
        pageSize: that.data.pageSize,
        m_id: that.data.id
      },
      success: function (res) {
        //console.log(res.data)
        if (res.data.askList==null || res.data.askList.length == 0) {
          that.setData({
            hasMore: false,
          })
        } else {

          for (var i in res.data.askList) {

            res.data.askList[i].createtime = transDate(res.data.askList[i].createtime, true)
          }

          that.data.askList = that.data.askList.concat(res.data.askList)
          that.setData({
            askList: that.data.askList,
            pageOffset: poff,
            opacityflag: 0
          })
        }
        wx.hideLoading()


      }
    })
  },
  makePhone:function(e){
    var that = this
    wx.makePhoneCall({
      phoneNumber: that.data.m.phone,
    })
  },
  toHome: function () {
    wx.reLaunch({
      url: '/pages/home/home',
    })
  }, toPerson:function(){
    wx.navigateTo({
      url: '/pages/person/person',
    })
  }, cobutton:function(e){
    //console.log("----")
    var that = this
    if (this.data.coflag==1){
      wx.showLoading({
        mask: true,
        title: '加载中'
      })
      wx.request({
        url: app.globalData.baseUrl + 'wx/collect_machine',
        data: {
          mid: that.data.id,
          oid: that.data.oid
        },
        success: function (res) {
          wx.hideLoading()
          if (res.data.result == "ok") {

            that.setData({
              coflag: 2
            })
            wx.showToast({
              title: '收藏成功',
              icon: 'success',
              duration: 1000
            })          
          } else if (res.data.result == "not"){
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
            that.setData({
              coflag: 1
            })
            wx.showToast({
              title: '收藏失败',
              icon: 'none',
              duration: 1000
            }) 
        }
        }
      })

    } else {
      wx.showLoading({
        mask: true,
        title: '加载中'
      })
      wx.request({
        url: app.globalData.baseUrl + 'wx/cancel_collect_machine',
        data: {
          mid: that.data.id,
          oid: that.data.oid
        },
        success: function (res) {
          wx.hideLoading()
          if (res.data.result == "ok") {

            that.setData({
              coflag: 1
            })
            wx.showToast({
              title: '取消收藏',
              icon: 'success',
              duration: 1000
            })
          } else if (res.data.result == "not") {
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
            that.setData({
              coflag: 2
            })
            wx.showToast({
              title: '取消收藏失败',
              icon: 'none',
              duration: 1000
            })
          }
        }
      })


    }
  },
  jubao:function(){
    wx.navigateTo({
      url: '/pages/jubao/jubao?id='+this.data.m.id
    })
  }
  ,
  ask: function () {
    wx.navigateTo({
      url: '/pages/ask/ask?id=' + this.data.m.id
    })
  }
  , ask_detail:function(e){
    //console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/ask_detail/ask_detail?id=' + e.currentTarget.dataset.id
    })
  },
  onShareAppMessage: function (res) {
    var that = this
    wx.showLoading({
      mask: true,
      title: '加载中'
    })
    if (res.from === 'button') {
      // 来自页面内转发按钮
      //console.log(res.target)
    }
    return {
      success: function (res) {
        // 转发成功
        wx.hideLoading()
      },
      fail: function (res) {
        // 转发失败
        wx.hideLoading()
      }
    }
  },
  bigImg:function(e){
    //console.log(this.data.urlList)
    wx.previewImage({
      current: this.data.urlList[e.currentTarget.dataset.current], // 当前显示图片的http链接
      urls: this.data.urlList // 需要预览的图片http链接列表
    })
  }
})
function transDate(mescStr,flag) {
  var n = mescStr;
  var date = new Date(n);
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  if(flag){
    return (Y + M + D + ' ' + hour + ':' + minute)
  } else {
    return (Y + M + D)
  }
}