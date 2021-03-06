// pages/add_excavator/add_excavator.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    brand_value:0,
    version_value: 0,
    city_value: 0,
    et_id:0,
    et_name:'',
    et:[],
    cs_id: 0,
    cs_name: '',
    cs:[],
    city_id: 0,
    city_name: '',
    cityList: [],
    brand_id: 0,
    brand_name: '',
    brandList:[],
    version_id: 0,
    version_name: '',
    versionList:[],
    ol_id: 0,
    ol_name: '较好',
    ol: [{ id: 0, name: "较好" }, { id: 1, name: "类似新车" }, { id: 2, name: "一般" }, { id: 3, name: "良好" }],
    use_id: 0,
    use_name: '自用设备',
    use: [{ id: 0, name: "自用设备" }, { id: 1, name: "租赁设备" }, { id: 2, name: "用途不确定" }, { id: 3, name: "厂家测试机" }],
    cus_id: 0,
    cus_name: '停用待售',
    cus: [{ id: 0, name: "停用待售" }, { id: 1, name: "正在施工" }, { id: 2, name: "不清楚" }],
    disflag1:'block',
    disflag2: 'none',
    disflag3: 'none',
    date:'',
    files:[],
    filenames:[],
    used_time:-1,
    price:0,
    tag:0,
    inwidth:0,
    user: {},
    oid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //测试
    /*this.setData({
      disflag1: 'none',
      disflag2: 'none',
      disflag3: 'block',
    })*/
//------------------------
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
      url: app.globalData.baseUrl + 'wx/mobile/add',
      data: {

      },
      success: function (res) {
        //console.log(res.data)
        that.setData({
          et: res.data.et,
          cs: res.data.cs,
          date: transDate(new Date(),2)
        })
        that.bindTypeChange({detail:{value:0}})
        that.bindProvinceChange({ detail: { value: 22 } })
        wx.hideLoading()
      }
    })
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
        if (res.data.info == "ok") {
          that.setData({
            user: res.data.user
          })
        } else {
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
  }, bindProvinceChange:function (e) {
    //console.log(e)
    var that = this
    that.setData({
      cs_id: that.data.cs[e.detail.value].id,
      cs_name: that.data.cs[e.detail.value].name
    })
    wx.request({
      url: app.globalData.baseUrl + 'mobile/getCity',
      data: {
        cid: that.data.cs[e.detail.value].id
      },
      success: function (res) {
        //console.log(res.data)
        that.setData({
          cityList: res.data,
          city_id: res.data[0].id,
          city_name: res.data[0].name,
          city_value: 0
        })
        
      }
    })
  }, bindCityChange(e) {
    var that = this
    that.setData({
      city_id: that.data.cityList[e.detail.value].id,
      city_name: that.data.cityList[e.detail.value].name,
      city_value: e.detail.value
    })
  }, bindDateChange:function(e){
    this.setData({
      date: e.detail.value
    })
  },
  bindOldLevelChange:function(e){
    var that = this
    this.setData({
      ol_id: that.data.ol[e.detail.value].id,
      ol_name: that.data.ol[e.detail.value].name,
    })
  }, bindUseChange: function (e) {
    var that = this
    this.setData({
      use_id: that.data.use[e.detail.value].id,
      use_name: that.data.use[e.detail.value].name,
    })
  }, bindCurrentStatusChange: function (e) {
    var that = this
    this.setData({
      cus_id: that.data.cus[e.detail.value].id,
      cus_name: that.data.cus[e.detail.value].name,
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
  
  },nextStep:function(){
    if (this.data.used_time == -1){
      wx.showModal({
        title: '提示',
        content: '使用时间不可为空',
        showCancel: false,
        success: function (res) {
        }
      })
    }else if(this.data.price == 0){
      wx.showModal({
        title: '提示',
        content: '出售价格不可为空',
        showCancel: false,
        success: function (res) {
        }
      })
    } else {
      this.setData({
        disflag1:'none',
        disflag2: 'block',
      })
    }
  }, nextStep2: function () {
    this.setData({
      disflag2: 'none',
      disflag3: 'block',
    })
  }, preStep: function () {
    this.setData({
      disflag2: 'none',
      disflag1: 'block',
    })
  }, preStep2: function () {
    this.setData({
      disflag3: 'none',
      disflag2: 'block',
    })
  }, setUsedTime:function(e){
    this.setData({
      used_time: e.detail.value
    });
  }, setPrice: function (e) {
    this.setData({
      price: e.detail.value
    });
  },formSubmit: function (e) {
    var that = this
//console.log(this.data.files)
    var value = e.detail.value
    //console.log()
    if (that.data.filenames.length < 5){
      wx.showModal({
        title: '提示',
        content: '至少上传5张照片',
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
      url: app.globalData.baseUrl + 'wx/mobile/save',
      method: 'POST',
      header: {
        //设置参数内容类型为json
        "content-type": "application/x-www-form-urlencoded"
      },
      data:{
        excavator_type:that.data.et_id,
        big_type:1,
        excavator_brand:that.data.brand_id,
        excavator_version: that.data.version_id,
        used_time: e.detail.value.used_time,
        price: e.detail.value.price,
        change_price: e.detail.value.change_price,
        province: that.data.cs_id,
        city:that.data.city_id,
        imported: e.detail.value.imported,
        qualified: e.detail.value.qualified,
        receipt: e.detail.value.receipt,
        production_date: e.detail.value.production_date,
        buy_date: e.detail.value.buy_date,
        code_no: e.detail.value.code_no,
        modified: e.detail.value.modified,
        fixed: e.detail.value.fixed,
        old_level:that.data.ol_id,
        use:that.data.use_id,
        current_status:that.data.cus_id,
        description: e.detail.value.description,
        link_name: e.detail.value.link_name,
        phone: e.detail.value.phone,
        oid:that.data.oid,
        filename: that.data.filenames,
        first_num:that.data.tag
      },
      success: function (res) {
        wx.hideLoading()
        console.log(res.data)
        if (res.data.info == "ok") {
          wx.showModal({
            title: '提示',
            content: '发布成功',
            showCancel: false,
            success: function (res) {
              wx.navigateBack({
              })
            }
          })
        } else {
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
      }
    })
    }
  }, delImg:function(e){
    var that = this
    wx.showModal({
      title: '提示',
      content: '是否确定删除该图片?',
      showCancel: true,
      success: function (res) {
        if(res.confirm){
          if (that.data.files.length == 1) {
            that.setData({
              files: [],
              filenames:[]
            })
          } else {
            that.data.files.splice(e.currentTarget.dataset.index, 1)
            that.data.filenames.splice(e.currentTarget.dataset.index, 1)
            if (e.currentTarget.dataset.index == that.data.tag) {
              that.setData({
                tag: 0
              })
            } else if (e.currentTarget.dataset.index < that.data.tag) {
              that.setData({
                tag: (that.data.tag - 1)
              })
            }
            that.setData({
              files: that.data.files,
              filenames:that.data.filenames
            })
          }
        }
      }
    })

  }, setFirst:function(e){
    
      this.setData({
        tag:e.currentTarget.dataset.index
      })
  }, chooseImg:function(){
    var that = this
    var count = 10 - that.data.files.length
    console.log(count)
    if(count==0){
      wx.showModal({
        title: '提示',
        content: '最多上传十张图片',
        showCancel: false,
        success: function (res) {
        }
      })
    } else {
    wx.chooseImage({
      count: count, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        that.setData({
          inwidth: 0
        })
        wx.showLoading({
          mask: true,
          title: '加载中'
        })
        var ignor = 0
        var countA = 0
        for (var i in tempFilePaths){
          const uploadTask = wx.uploadFile({
          url: app.globalData.baseUrl + 'wx/mobile/uploadFile',
          filePath: tempFilePaths[i],
          name: 'file',
          success: function (res) {
            if(res.data.length==0){
              ignor++
              wx.showModal({
                title: '提示',
                content: '仅支持JPG/JPEG格式',
                showCancel: false,
                success: function (res) {
                }
              })
            } else{
              countA++
              that.data.files.push(app.globalData.baseUrl + "img/temp/" + res.data.replace(".","_S."))
              that.data.filenames.push(res.data)
              console.log(that.data.filenames)
              that.setData({
                files: that.data.files,
                filenames: that.data.filenames
              })
            }
            if ((countA + ignor) == tempFilePaths.length){
              wx.hideLoading()
            }
          }
        })
          uploadTask.onProgressUpdate((res) => {
            //console.log("进度"+res.progress)
             that.setData({
               inwidth: res.progress
             })
          })
        }
        

      }
    })
    }
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