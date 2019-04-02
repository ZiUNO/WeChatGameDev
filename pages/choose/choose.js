// pages/choose/choose.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    images:{
      blue_ori: '/image/circle_blue_ori.png',
      green_ori: '/image/circle_green_ori.png'
    },
    choice: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //需更改该处-------------------------------------------------------------------------------更改为选择阵营
    // wx.redirectTo({
    //   url: '/pages/index/index',
    // })
  },
  chooseBlue: function(){
    var that = this
    that.setData({
      choice: 1,
      images: {
        green_ori: '/image/circle_green_ori.png',
        blue_ori: '/image/circle_blue.png',
      }
    })
  },
  chooseGreen: function () {
    var that = this
    that.setData({
      choice: 2,
      images: {
        green_ori: '/image/circle_green.png',
        blue_ori: '/image/circle_blue_ori.png',
      }
    })
  },
  submit: function(){
    wx.setStorageSync('userChoice', this.data.choice)
    wx.redirectTo({
      url: '/pages/index/index',
    })
  }
})