//lead.js
const app = getApp()
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    plain: true,
  },
  onLoad() {
    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success(res) {
              console.log(res.userInfo)
              app.globalData.userInfo = res.userInfo
            }
          })
        }
      }
    })
  },
  bindGetUserInfo(e) {
    app.globalData.userInfo = e.detail.userInfo
    wx.navigateTo({
      url: '/pages/index/index'
    })
  }
})