//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    //地图信息
    map:{
      //地图用户信息
      userInfo: {
        longitude: 0,
        latitude: 0,
        avatarUrl: null
      },
      //地图内容信息
      subkey: '5QOBZ-A3A3O-BTVWZ-SQQGW-MXASQ-L2FYF',
      markers: [],
      circles: []
    },
    //用户头像边框颜色
    userBorder: "rgba(255, 255, 255, 0.3)",
  },
  //事件处理函数
  //页面加载中获取初始化坐标
  onLoad: function(){
    var that = this
    //设置头像框边缘颜色
    var userChoice = wx.getStorageSync('userChoice')
    if (userChoice == 'green'){
      that.setData({
        userBorder: "rgba(0, 255, 200, 0.3)"
      })
    }
    else if (userChoice == 'blue'){
      that.setData({
        userBorder: "rgba(0, 200, 255, 0.3)"
      })
    }
    //获取用户位置
    wx.getLocation({
      type: "gcj02",
      altitude: true,
      success: function(res) {
        var longitude = res.longitude
        var latitude = res.latitude
        that.setData({
          'map.userInfo.latitude': latitude,
          'map.userInfo.longitude': longitude
        })
      },
    })
    //设置头像图片url
    that.setData({
      'map.userInfo.avatarUrl': app.globalData.userInfo.avatarUrl
    })
  },
  //页面渲染过程中，获取mapCtx，初始设置
  onReady: function(e){
    this.mapCtx = wx.createMapContext('usermap')
    this.moveToLocation()
    var mapInfo = this.getMapInfo({
      'longitude': this.data.map.userInfo.longitude,
      'latitude': this.data.map.userInfo.latitude
    }, true)
    this.printMap(mapInfo)
  },
  //右侧按钮，视野返回到当前位置并更改经纬度数据值
  moveToLocation: function(){
    var that = this
    console.log('move to present location')
    this.mapCtx.moveToLocation()
    this.mapCtx.getCenterLocation({
      success: function (res) {
        that.setData({
          'map.userInfo.longitude': res.longitude,
          'map.userInfo.latitude': res.latitude
        })
      }
    })
  },
  //中间按键beat功能
  beat: function(){
    console.log('BEAT!')
    this.moveToLocation()
    var mapInfo = this.getMapInfo({
      'longitude': this.data.map.userInfo.longitude, 
      'latitude': this.data.map.userInfo.latitude})
    this.printMap(mapInfo)
  }, 
  //跳转到用户信息界面
  toUserPage: function(){
    wx.navigateTo({
      url: '../userpage/userpage',
    })
  },
  //向服务器发送指定信息，返回处理后数据
  getMapInfo: function(info, init=false){
    //需具体填充向服务器请求更改数据-----------------------------------------------------需补充向服务器获取数据代码，结合wx.getStorageSync(key)读取缓存区中session_id
    var circles = [{
        "id": 0,
        "latitude": 39.08371,
        "longitude": 121.813359,
        "color": '#CCF2FF',
        "fillColor": '#00ff7230',
        "radius": 50
    }]
    var markers = [{
      'id': 0,
      'iconPath': "/image/setpoint_green.png",
      'longitude': 121.813359,
      'latitude': 39.08371,
      'callout': {
        'content': '我是这个气泡',
        'bgColor': '#00ff7290'
      }
    }]
    return {'circles': circles, 'markers': markers} 
  },
  printMap: function(mapInfo){
    var that = this
    var circles = mapInfo['circles']
    var markers = mapInfo['markers']
    var tmp_info = {}
    var tmp_id = undefined
    for (let i = 0; i < circles.length; i ++){
      let circle = circles[i]
      let id = circle.id
      tmp_id = 'map.circles[' + id + ']'
      if (this.data.map.circles[id] == undefined){
        tmp_info = {
            id: id,
            latitude: 0,
            longitude: 0,
            color: 0,
            fillColor: 0,
            radius: 0
          }
      }
      else{
        tmp_info = this.data.map.circles[id]
      }
      for (let j in circle) {
        if (j == undefined || j == 'id')
          continue
        tmp_info[j] = circle[j]
      }
      that.setData({
        [tmp_id]: tmp_info
      })
    }
    // console.log(this.data.map.circles)
    for (let i = 0; i < markers.length; i ++){
      let marker = markers[i]
      let id = marker.id
      tmp_id = 'map.markers[' + id + ']'
      if (this.data.map.markers[id] == undefined){
        tmp_info = {
          id: id,
          iconPath: 0,
          longitude: 0,
          latitude: 0,
          width: 30,
          height: 30,
          callout: {
            content: 0,
            fontSize: 14,
            color: '#ffffff',
            bgColor: 0,
            padding: 8,
            borderRadius: 15,
          }
        }
      }
      else{
        tmp_info = this.data.map.markers[id]
      }
      for (let j in marker) {
        if (j == undefined || j == 'id')
          continue
        if (j == 'callout'){
          for (let k in marker[j]){
            if (k ==  undefined)
              continue
            tmp_info['callout'][k] = marker[j][k]
          }
        }
        else {
          tmp_info[j] = marker[j]
        }
      }
      that.setData({
        [tmp_id]: tmp_info
      })
    }
    // console.log(this.data.map.circles, this.data.map.markers)
  }
})