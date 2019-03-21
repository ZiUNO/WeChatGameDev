//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    longitude: 116.4965075,
    latitude: 40.006103,
    subkey: '5QOBZ-A3A3O-BTVWZ-SQQGW-MXASQ-L2FYF',
    markers: [
      {
        id: 'smub', //software multi-use building
        iconPath: "/image/setpoint_green.png",
        longitude: 121.813359,
        latitude: 39.08371,
        width: 30,
        height: 30,
        callout: {
          content: 50,
          display: 'BYCLICK',
          textAlign: 'center',
          borderWidth: 150,
          borderRadius: 10
        }
      }
    ]
  },
  //事件处理函数
  //页面加载中获取初始化坐标
  onLoad: function(){
    var that = this
    wx.getLocation({
      type: "gcj02",
      altitude: true,
      success: function(res) {
        var longitude = res.longitude
        var latitude = res.latitude
        that.setData({
          latitude: latitude,
          longitude: longitude
        })
      },
    })
  },
  //页面渲染过程中，获取mapCtx
  onReady: function(e){
    this.mapCtx = wx.createMapContext('usermap')
    this.mapCtx.moveToLocation()
  },
  //右侧按钮，视野返回到当前位置
  moveToLocation: function(){
      console.log('move to present location')
      this.mapCtx.moveToLocation()
  },
  //beat功能
  beat: function(){
    console.log('BEAT!')
    //添加beat功能
    console.log(app.globalData.userInfo)
  },  
  hiddenCallout: function(){
    console.log('hidden all callout')
  },
  toUserPage: function(){
    wx.navigateTo({
      url: '/pages/userpage/userpage',
    })
  }
})