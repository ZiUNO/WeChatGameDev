//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    longitude: 116.4965075,
    latitude: 40.006103,
    markers: [
      {
        id: 'smub', //software multi-use building
        iconPath: "/image/setpoint_green.png",
        longitude: 121.813359,
        latitude: 39.08371,
        width: 30,
        height: 30,
        callout: {
          content: "综合楼",
          display: 'BYCLICK',
          textAlign: 'center',
          borderWidth: 150,
          borderRadius: 10
        }
      }
    ],
    controls:[
      {
        id: 'location',
        iconPath: "/image/location_green.png",
        position:{
          left: app.globalData.scWidth - 100,
          top: app.globalData.scHeight - 100,
          width: 50,
          height: 50
        },
        clickable: true
      }
    ]
  },
  //事件处理函数
  //页面渲染过程中，获取mapCtx
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
  onReady: function(e){
    this.mapCtx = wx.createMapContext('usermap')
    this.mapCtx.moveToLocation()
  },
  controltap: function(e){
    switch(e.controlId){
      case 'location':
      console.log('move to present location');
      this.mapCtx.moveToLocation()
    }
  }
})