//lead.js
//获取应用实例
const app = getApp()
Page({
  data:{
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad(){
    wx.showLoading({
      title: '初始化中',
    })
    //查看是否授权
    wx.getSetting({
      success(res){
        if (res.authSetting['scope.userInfo']){
          //已经授权，可以直接调用getUserInfo获取头像昵称
          wx.getUserInfo({
            success(res){
              console.log('successfully get user info')
              app.globalData.userInfo =  res.userInfo
            }
          })
        }
      }
    })
  },
  onShow(){
    wx.hideLoading()
  },
  bindGetUserInfo(e){
    console.log(e.detail.userInfo)
    // wx.showLoading({
    //   title: '加载中',
    // })
    app.globalData.userInfo = e.detail.userInfo
    wx.redirectTo({
      url: '/pages/index/index',
    }) 
    
  },
  quit: function(){
    wx.navigateBack({
      delta: 1
    })
  }
})
