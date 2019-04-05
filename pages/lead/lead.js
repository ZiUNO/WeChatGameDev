//lead.js
const app = getApp()
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    plain: true,
    userBoxShadow: "rgba(255, 255, 255, 0.7)",
    begin_image: '../../image/begin_white.svg'
  },
  onLoad() {
    wx.setStorageSync('userChoice', 'white')
    //查看是否登陆
    if (!wx.getStorageSync('session_id')){
      wx.login({
        success(res) {
          if (res.code) {
            console.log("-------------\n")
            console.log(res.code)
            console.log("\n-------------\n")
            wx.request({
              url: 'http://localhost:8080/login',//-----------------------------------------------------------------------------此处需要修改为具体的login专用的网址
              data: {
                code: res.code
              },
              success(res) {
                console.log("-------------\n")
                console.log(res.data.sessionId)
                console.log("\n-------------\n")

                
                //将session_id保存在缓存中，具体名称需修改,同时需要存储用户的阵营的选择，userChoice的取值为'green'或'blue'-------------------------------------------------------------需修改具体名称
                wx.setStorageSync('sessionId', res.data.sessionId)
                wx.setStorageSync('userChoice', res.data.userChoice)
              }
            })
          }
          else {
            console.log('登录失败:' + res.errMsg)
          }
        }
      })
    }
    // wx.setStorageSync('userChoice', 'blue') //-----------------------------------------------------------------------------修改上面success函数后删掉该强制赋值
    // wx.setStorageSync('userChoice', 'green')
    //设置头像边框
    var that = this
    var choice = wx.getStorageSync('userChoice') 
    if (choice == 'blue'){
      that.setData({
        userBoxShadow: "rgba(0, 200, 255, 0.7)",
        begin_image: '../../image/begin_blue.svg',
      })
    }
    else if(choice == 'green'){
      that.setData({
        userBoxShadow: "rgba(0, 255, 200, 0.7)",
        begin_image: '../../image/begin_green.svg'
      })
    }
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
    var loadTitle = 'LOGGING IN'
    if (wx.getStorageSync('userChoice') == 'white')
      loadTitle = 'TO CHOOSE CAMP'
    wx.showLoading({
      title: loadTitle,
    })
    //保存用户详细数据
    if (app.globalData.userInfo == null){
      app.globalData.userInfo = e.detail.userInfo
    }
    //未选择状态进入选择界面
    wx.hideLoading()
    if (wx.getStorageSync('userChoice') == 'white'){
      wx.setStorageSync('firstTime', true)
      wx.redirectTo({
        url: '../choose/choose',
      })
    } 
    else{
      wx.setStorageSync('firstTime', false)
      wx.navigateTo({
        url: '../index/index'
      })
    }
  }
})