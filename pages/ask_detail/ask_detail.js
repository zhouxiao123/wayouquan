// pages/ask_detail/ask_detail.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,
    oid:'',
    user:{},
    askDetail:{},
    answer:[],
    msg: '', 
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
      id:options.id
    })
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

    wx.showLoading({
      mask: true,
      title: '加载中'
    })
    wx.request({
      url: app.globalData.baseUrl + 'wx/mobile/ask_detail',
      data: {
        id: that.data.id
      },
      success: function (res) {
        
        res.data.ask.createtime = transDate(res.data.ask.createtime, true)
        
        that.setData({
          askDetail:res.data.ask
        })
        wx.request({
          url: app.globalData.baseUrl + 'wx/mobile/answer_list',
          data: {
            ask_id: that.data.id
          },
          success: function (res) {
            if (res.data.info == "ok") {
              for (var i in res.data.answerList){
                res.data.answerList[i].createtime = transDate(res.data.answerList[i].createtime, true)
              }
              that.setData({
                answer:res.data.answerList
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
  delAnswer:function (e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否确认删除',
      showCancel: true,
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            mask: true,
            title: '加载中'
          })
          //console.log(e.detail.value)

          wx.request({
            url: app.globalData.baseUrl + 'wx/mobile/answer_delete',
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
                url: app.globalData.baseUrl + 'wx/mobile/answer_list',
                data: {
                  ask_id: that.data.id
                },
                success: function (res) {
                  if (res.data.info == "ok") {
                    for (var i in res.data.answerList) {
                      res.data.answerList[i].createtime = transDate(res.data.answerList[i].createtime, true)
                    }
                    that.setData({
                      answer: res.data.answerList
                    })


                  }

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
      url: app.globalData.baseUrl + 'wx/mobile/answer_list',
      data: {
        pageOffset: poff,
        pageSize: that.data.pageSize,
        ask_id: that.data.id
      },
      success: function (res) {
        //console.log(res.data)
        if (res.data.answerList.length == 0) {
          that.setData({
            hasMore: false,
          })
        } else {

          for (var i in res.data.answerList) {
            res.data.answerList[i].createtime = transDate(res.data.answerList[i].createtime, true)
          }

          that.data.answer = that.data.answer.concat(res.data.answerList)
          that.setData({
            answer: that.data.answer,
            pageOffset: poff,
            opacityflag: 0
          })
        }
        wx.hideLoading()


      }
    })
  },
  sendMsg: function (event) {
    //console.log(this.data.search_name)

    var that = this
    if (that.data.msg.length == "0") {
      wx.showModal({
        title: '提示',
        content: '请输入回复内容',
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
        url: app.globalData.baseUrl + 'wx/mobile/answer_save',
        data: {
          oid: this.data.oid,
          content: this.data.msg,
          ask_id: this.data.id
        },
        method: 'POST',
        header: {
          //设置参数内容类型为json
          "content-type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          //console.log(res.data)
          if (res.data.info == "ok") {
            wx.showModal({
              title: '提示',
              content: '回复成功',
              showCancel: false,
              success: function (res) {
                that.setData({
                  msg: ''
                });


                wx.request({
                  url: app.globalData.baseUrl + 'wx/mobile/answer_list',
                  data: {
                    ask_id: that.data.id
                  },
                  success: function (res) {
                    if (res.data.info == "ok") {
                      for (var i in res.data.answerList) {
                        res.data.answerList[i].createtime = transDate(res.data.answerList[i].createtime, true)
                      }
                      that.setData({
                        answer: res.data.answerList
                      })


                    }


                    wx.hideLoading()
                  }
                })
              }
            })
          } else if (res.data.info == "not") {
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
          }
          wx.hideLoading()
        }
      })
    }

  }, setValue: function (event) {

    this.setData({
      msg: event.detail.value
    });
  }
})
function transDate(mescStr, flag) {
  var n = mescStr;
  var date = new Date(n);
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  if (flag) {
    return (Y + M + D + ' ' + hour + ':' + minute)
  } else {
    return (Y + M + D)
  }
}
