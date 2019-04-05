//lead.js
const app = getApp()
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    plain: true,
  },
  onLoad() {
    wx.setStorageSync('userChoice', 0)
    //查看是否登陆
    if (!wx.getStorageSync('session_id')){
      wx.login({
        success(res) {
          if (res.code) {
            wx.request({
              url: 'http://服务器网址.com',//-----------------------------------------------------------------------------此处需要修改为具体的login专用的网址
              data: {
                code: res.code
              },
              success(res) {
                //将session_id保存在缓存中，具体名称需修改,同时需要存储用户的阵营的选择-------------------------------------------------------------需修改具体名称
                // wx.setStorageSync('sessionId', res.data.sessionId)
                // wx.setStorageSync('userChoice', res.data.userChoice)
              }
            })
          }
          else {
            console.log('登录失败:' + res.errMsg)
          }
        }
      })
    }
    // wx.setStorageSync('userChoice', 1) //-----------------------------------------------------------------------------修改上面success函数后删掉该强制赋值
    //查看是否授权
    if (app.globalData.userInfo != null)
      return
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success(res) {
              app.globalData.userInfo = res.userInfo
            }
          })
        }
      }
    })
  },
  bindGetUserInfo(e) {
    if (app.globalData.userInfo == null){
      app.globalData.userInfo = e.detail.userInfo
    }
    if (wx.getStorageSync('userChoice') == 0){
      wx.redirectTo({
        url: '/pages/choose/choose',
      })
    }
    else{
      wx.navigateTo({
        url: '/pages/index/index'
      })
    }
  }
})