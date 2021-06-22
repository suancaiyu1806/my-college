//index.js
const app = getApp()

Page({
  data: {
    provinces: [{ text: '山东省', value: 0 }, { text: '山西省', value: 1 }, { text: '辽宁省', value: 2 }, { text: '吉林省', value: 3 }, { text: '黑龙江省', value: 4 }, { text: '江苏省', value: 5 }, { text: '浙江省', value: 6 }, { text: '安徽省', value: 7 }, { text: '福建省', value: 8 }, { text: '江西省', value: 9 }, { text: '河北省', value: 10 }, { text: '河南省', value: 11 }, { text: '湖北省', value: 12 }, { text: '湖南省', value: 13 }, { text: '广东省', value: 14 }, { text: '海南省', value: 15 }, { text: '四川省', value: 16 }, { text: '贵州省', value: 17 }, { text: '云南省', value: 18 }, { text: '陕西省', value: 19 }, { text: '甘肃省', value: 20 }, { text: '青海省', value: 21 }, { text: '台湾省', value: 22 }],
    value1: 0,
    schools:[{"school": {
      "sort": [9223372036854776000],
      "type": "doc",
      "source": {
        "money": "4880",
        "image": "https://static-data.eol.cn/upload/logo/885.jpg",
        "renqizhi": "人气值",
        "daxue": "大学",
        "subject": {
          "list": [
            {
              "score": "455",
              "pici": "普通类二段",
              "name": "综合",
              "fencha": "305"
            }
          ]
        },
        "city": "北京",
        "subject1": {
          "list1": [
            {
              "name1": "综合",
              "fencha1": "305",
              "score1": "455",
              "pici1": "普通类二段"
            }
          ]
        },
        "zhuanketype": "双高院校;国家级示范;现代学徒制试点院校",
        "location": "山东",
        "type": "985;211;强基计划;双一流",
        "pcurl": "https://gkcx.eol.cn/school/885?fromcoop=sougou",
        "province": "北京",
        "hit": "高考锦囊",
        "nature": "公办",
        "company": "",
        "renqizhirange": "1211",
        "updatetime": "2021-06-21 11:57:05",
        "key": "北京工业职业技术学院山东",
        "leixing": "理工类",
        "school": "北京工业职业技术学院",
        "level": "普通类二段",
        "url": "http://vr.ftp.sogou/ftpdata/vrmaker/gaokao2021/selectschool/selectschool107.xml",
        "work": "",
        "url": "https://g.eol.cn/school/885?fromcoop=sougou",
        "levelmingzhong": "专科批"
      },
      "score": null,
      "index": "gaoxiao702317002",
      "id": "7cf9a0cab7f7bfb5a7937907916405bb"
    }}]
  },

  onLoad: function () {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true,
      })
    }
  },

  getUserProfile() {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setData({
          avatarUrl: res.userInfo.avatarUrl,
          userInfo: res.userInfo,
          hasUserInfo: true,
        })
      }
    })
  },

  onGetUserInfo: function (e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo,
        hasUserInfo: true,
      })
    }
  },

  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]

        // 上传图片
        const cloudPath = `my-image${filePath.match(/\.[^.]+?$/)[0]}`
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath

            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })
      },
      fail: e => {
        console.error(e)
      }
    })
  },

})
