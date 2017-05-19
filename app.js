//app.js
var Bmob = require('utils/bmob.js')
Bmob.initialize("11d92d40963ca7c69518ba0dacc8304e", "25a5c6e97543e95352a7afa47b0c8b1c");

App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据是否有登陆信息 有就从缓存中取
    var openid = wx.getStorageSync('openid');
    if(!!openid) return;
    var secret = 'af933b490903b3583d278f65ca76c526';
    var appid = 'wx4a87cdaf12f387fe';
    wx.login({
      success: function (res) {
        //执行云端逻辑获取openid以及sessionKey
        Bmob.Cloud.run('getWxOpenId', { "code": res.code, 'secret': secret,'appid':appid }, {
          success: function (result) {
            console.log(JSON.parse(result));
          },
          error: function (error) {
            console.log(error)
          }
        })
      }
    });

  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function (result) {
          console.log(result.code);
          wx.getUserInfo({
            success: function (res) {
              console.log(res);
              that.globalData.userInfo = res.userInfo
             //将用户信息保存在内存中
              wx.setStorageSync('userInfo',res.userInfo);
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData:{
    userInfo:null
  }
})