//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    timestamp: 0,
    //地图信息
    map:{
      //地图用户信息
      userInfo: {
        longitude: 38.91377,
        latitude: 31.614565,
        avatarUrl: null,
        //用户视野范围
        field:{
          southwest: null,
          northeast: null,
        }
      },
      //地图内容信息
      subkey: '5QOBZ-A3A3O-BTVWZ-SQQGW-MXASQ-L2FYF',
      markers: [],
      circles: [],
    },
    //用户头像边框颜色
    userBorder: "rgba(255, 255, 255, 0.8)",
    logo: undefined,
    location: undefined,
  },
  //事件处理函数
  //页面加载中获取初始化坐标
  onLoad: function(){
    var that = this
    //设置头像图片url
    that.setData({
      'map.userInfo.avatarUrl': app.globalData.userInfo.avatarUrl,
    })
    //设置头像框边缘颜色
    var userChoice = wx.getStorageSync('userChoice')
    if (userChoice == 'green'){
      that.setData({
        userBorder: "rgba(0, 255, 200, 0.8)",
        logo: '../../image/logo_green.png',
        location: '../../image/location_green.png',
      })
    }
    else if (userChoice == 'blue'){
      that.setData({
        userBorder: "rgba(0, 200, 255, 0.8)",
        logo: '../../image/logo_blue.png',
        location: '../../image/location_blue.png',
      })
    }
    wx.getLocation({
      type: 'gcj02',
      altitude: true,
      success: function (res) {
        that.setData({
          'map.userInfo.latitude': res.latitude,
          'map.userInfo.longitude': res.longitude,
        })
      },
    })
  },
  //页面渲染过程中，获取mapCtx，初始设置
  onReady: function(e){
    this.mapCtx = wx.createMapContext('usermap')
    this.moveToLocation()
    //当移动到当前位置时因为视野发生变化自动调用regionChange函数刷新当前地图
    //显示提示教程
    if (wx.getStorageSync('firstTime')){
      wx.showModal({
        title: '使用提示',
        content: '←左侧按钮：用户界面\r\n↓中间按钮：攻击当前所在圈\r\n（一小时限一次）\r\n→右侧按钮：回到当前位置',
        showCancel: false,
      })
      wx.setStorageSync('firstTime', false)
    }
  },
  //右侧按钮，视野返回到当前位置
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
    var field = this.getRegion()
    // this.moveToLocation()
    var that = this
    var mapInfo = this.getMapInfo({
      'latitude': that.data.map.userInfo.latitude,
      'longitude': that.data.map.userInfo.longitude,
      'northeast': field.northeast,
      'southwest': field.southwest})
    if (!mapInfo){
      wx.showToast({
        title: 'BEAT SUCCESS!',
      })
    }
    else {
      wx.showModal({
        title: 'BEAT FAILED',
        content: '您未在范围内或未满点击周期',
        showCancel: false,
      })
    }
  }, 
  //跳转到用户信息界面
  toUserPage: function(){
    wx.navigateTo({
      url: '../userpage/userpage',
    })
  },

  //向服务器发送指定信息，返回处理后数据
  getMapInfo: function(info, init=false){
    var circles = []
    var markers = []
    var raw_markers = []
    var ok = false
    var that = this
    // console.log('info:', info)
    wx.request({
      // url: 'http://localhost:8080/map',
      url: 'http://10.6.113.10:8080/ssm/map/',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        init: init,
        sessionId: wx.getStorageSync('sessionId'),
        latitude: info.latitude,
        longitude: info.longitude,
        swlongitude: info.southwest.longitude,
        swlatitude: info.southwest.latitude,
        nelatitude: info.northeast.latitude,
        nelongitude: info.northeast.longitude,
      },
      success(res) {
        // console.log(res.data)
        raw_markers = res.data
        // console.log('raw_markers:', raw_markers)
        for (let i = 0; i < raw_markers.length; i++) {
          let raw_marker = raw_markers[i]
          let id = raw_marker['id']
          let longitude = raw_marker['longitude']
          let latitude = raw_marker['latitude']
          let content = raw_marker['content']
          let color = raw_marker['color'] == 'white' ? '#ffffff' : raw_marker['color'] == 'blue' ? '#00c8ff' : '#00ffc8'
          let marker = {}
          let circle = {}
          let callout = {}
          circle['id'] = id
          marker['id'] = id
          circle['longitude'] = longitude
          marker['longitude'] = longitude
          circle['latitude'] = 
          marker['latitude'] = latitude
          circle['color'] = color
          circle['fillColor'] = color + '30'
          circle['radius'] = Number(content)
          circles[i] = circle
          marker['id'] = id
          marker['iconPath'] = color == '#ffffff' ? '../../image/setpoint_white.png' : color == '#00c8ff' ? '../../image/setpoint_blue.png' : '../../image/setpoint_green.png'
          callout['content'] = content
          callout['bgColor'] = color + '90'
          marker['callout'] = callout
          markers[i] = marker
        }
        // console.log({ 'circles': circles, 'markers': markers })
        ok = that.printMap({ 'circles': circles, 'markers': markers })
      }
    })
    return ok
  },
  //设置图中markers和circles数据
  printMap: function(mapInfo){
    var that = this
    var circles = mapInfo['circles']
    var markers = mapInfo['markers']
    var tmp_info = {}
    var tmp_id = undefined
    console.log(circles)
    for (let i = 0; i < circles.length; i ++){
      let circle = circles[i]
      let id = circle.id
      tmp_id = 'map.circles[' + id + ']'
      if (this.data.map.circles[id] == undefined){
        tmp_info = {
          id: id,
          latitude: 0,
          longitude: 0, 
            color: '#123456',
            fillColor: '#123456',
            radius: 100,//需修改
          }
      }
      else{
        tmp_info = this.data.map.circles[id]
      }
      for (let j in circle) {
        if (j == undefined || j == 'radius' || j == 'color' || j == 'fillColor')
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
            color: '#000000',
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
        if (j == undefined)
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
    // that.setData({
    //   'map.circles['
    // })
    console.log(this.data.map.circles, this.data.map.markers)
    return !(circles.length == 0)
  },
  //当视野变化的时候动态的请求新视野下的markers和circles信息
  regionChange: function () {
    console.log('region change')
    var that = this
    if (this.data.timestamp == 0) {
      that.setData({
        'timestamp': Date.parse(new Date()) / 1000,
      })
      return
    }
    if (Date.parse(new Date()) / 1000 - this.data.timestamp < 2){
      return
    }
    else{
      that.setData({
        'timestamp': Date.parse(new Date()) / 1000,
      })
    }
    var field = this.getRegion()
    this.mapCtx.getCenterLocation({
      success: function (res) {
        console.log(res)
        var mapInfo = that.getMapInfo({
          'longitude': res.longitude,
          'latitude': res.latitude,
          'southwest': field.southwest,
          'northeast': field.northeast,
        }, true)
      }
    })
  },
  //获取当前视野范围
  getRegion: function(){
    var that = this
    var region = {}
    region['northeast'] = { longitude: this.data.map.userInfo.longitude + 0.01, latitude: this.data.map.userInfo.latitude + 0.01} 
    region['southwest'] = { longitude: this.data.map.userInfo.longitude - 0.01, latitude: this.data.map.userInfo.latitude - 0.01}
    // this.mapCtx.getRegion({
    //   success: function (res) {
    //     region.northeast = res.northeast
    //     region.southwest = res.southwest
    //     that.setData({
    //       'map.userInfo.field.southwest': region.southwest,
    //       'map.userInfo.field.northeast': region.northeast,
    //     })
    //   }
    // })
    console.log('region: ', region)
    return region
  },
})