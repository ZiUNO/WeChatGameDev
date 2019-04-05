const app = getApp()
Page({
  data:{

  },
  //注销用户信息
  destroy: function(){
    //向服务器发送消除该用户信息的请求
    var make_sure = false
    wx.showModal({
      title: '注销',
      content: '您确定注销当前用户信息？\r\n若注销您在一个星期之内将无法再次注销',
      success(res){
        make_sure = res.confirm
        if (res.confirm == true && make_sure){
          wx.showLoading({
            title: '注销中',
          })
          wx.request({//------------------------------------------------------更改request内容向服务器请求注销用户信息
            url: 'http://localhost:8080/logout',//-----------------------域名自定义
            data:{
              sessionId:wx.getStorageSync('sessionId'),
              destroy:'destroy'

            },
            success(res) {
              if (res.data.status == 'SUCCESS') {
                wx.showToast({
                  title: '已注销',
                })
                wx.reLaunch({
                  url: '../lead/lead',
                })
              }
              else {
                wx.showModal({
                  title: '注销失败',
                  content: '注销周期未满一个星期\r\n无法注销',
                  showCancel: false,
                  complete(){
                    return
                  }
                })
              }
            },
            fail(){
              wx.showModal({
                title: '注销失败',
                content: '网路连接失败\r\n请检查网络连接状态',
                showCancel: false,
                success(res){
                  return
                }
              })
            },
            complete(){
              wx.hideLoading()
            }
          })
        }
      }
    })
  },
  //显示开发者信息
  getApeInfo: function(){
    wx.showModal({
      title: '关于我们',
      content: '团队名称：\r\n豆浆油条\r\n团队成员：\r\nZiUNO+月老+小明同学+白\r\n联系邮箱：\r\nUKG@126.com',
      showCancel: false
    })
  }
}
)