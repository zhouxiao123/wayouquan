// pages/more/more.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tag:-1,
    typelist:['全部','挖掘机','装载机'],
    type_name:'',
    brand:[],
    city:[],
    data:{}
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
      url: app.globalData.baseUrl + 'wx/mobile/list',
      data: {
        type: options.type
      },
      success: function (res) {
        //console.log(transDate(res.data.m.buy_date, true))
        //console.log(res.data.m.create_time)
        for (var i in res.data.ms) {
          res.data.ms[i].cover_path = res.data.ms[i].cover_path.replace('.', '_S.')
          res.data.ms[i].buy_date == null ? res.data.ms[i].buy_date = '未知' : res.data.ms[i].buy_date = transDate(res.data.ms[i].buy_date,1)
          res.data.ms[i].create_time = fromNowToDate(res.data.ms[i].create_time)
        }

        that.setData({
          data: res.data,
          city:res.data.cs,
          brand:res.data.bs,
          type_name: options.type == null ? '全部机械' : options.type == 1 ? '挖掘机' : '装载机',
          city_name: res.data.city_name != null ? res.data.city_name : '全部地区',
          brand_name: res.data.exb_name != null ? res.data.exb_name : '全部品牌'
        })

        wx.hideLoading()
      }
    })
  },
  toDetail:function (e) {
    wx.navigateTo({
      url: '../msdetail/msdetail?id=' + e.currentTarget.dataset.id,
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
  swichNav: function (event) {
    
    if (this.data.tag == event.currentTarget.dataset.current) {
      return false;
    } else {
      this.setData({
        tag: event.currentTarget.dataset.current
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
    return transDate(date,2)+" 发布";
  }
}