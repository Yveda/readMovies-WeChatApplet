var postsData = require('../../../data/posts-data.js')
var app = getApp();
console.log(app)
Page({
  data:{
    isPlayingMusic:false,
  },
  onLoad: function (option) {
    var postId = option.id;
    console.log(postId);
    this.data.currentPostId = postId
    var postData = postsData.postList[postId];
    // this.data.postData = postData;//这个推荐的方法又不行
    this.setData({
      postData: postData
    })

    var postsCollected = wx.getStorageSync('posts_collected')
    if (postsCollected){
      var postCollected= postsCollected[postId]
      this.setData({
        collected: postCollected
      })
    }else{
      var postsCollected = {}
      postsCollected[postId] = false;
      wx.setStorageSync('posts_collected', postsCollected)
    }
   
    if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId){//如果全局变量为真，则播放状态为true，默认为false不用去改变
      //this.data.isPlayingMusic=true;
      this.setData({//数据绑定的；写法
        isPlayingMusic:true
      })
    }
    this.setMusicMonitor();//把他提取出去，让onload函数看起来更加简洁
  },
  setMusicMonitor(){
    var that = this;
    wx.onBackgroundAudioPlay(function () {//监听音乐开始
      that.setData({
        isPlayingMusic: true
      })
      app.globalData.g_isPlayingMusic = true;//如果音乐播放了，就把全局变量设置为true
      app.globalData.g_currentMusicPostId = that.data.currentPostId;//设置全局变量g_currentMusicPostId等于当前的currentPostId
    })
    wx.onBackgroundAudioPause(function () {//监听音乐暂停
      that.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false;//如果音乐暂停了，就把全局变量设置为false
      app.globalData.g_currentMusicPostId = null;//音乐暂停之后，就设置为null
    })
    wx.onBackgroundAudioStop(function () {//监听音乐停止
      that.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false;//如果音乐暂停了，就把全局变量设置为false
      app.globalData.g_currentMusicPostId = null;//音乐暂停之后，就设置为null
    })
  },
    onCollectionTap(event){ 
    var postsCollected = wx.getStorageSync('posts_collected');
    var postCollected = postsCollected[this.data.currentPostId];
    postCollected = !postCollected;
    //收藏变未收藏，收藏变未收藏
    postsCollected[this.data.currentPostId] = postCollected;
    this.showModal(postsCollected,postCollected);//this指的是page这个对象，相当于调用了page下面的showModal方法
  },
  showModal(postsCollected, postCollected){
    var that = this;
    wx.showModal({
      title: '收藏',
      content: postCollected?'收藏该文章?':'取消收藏该文章？',
      showCancel: 'true',
      cancelText: '取消',
      cancelColor: '#333',
      confirmText: '确认',
      confirmColor: '#405f80',
      success(res){
        if(res.confirm){
          //更新文章是否有缓存值
          wx.setStorageSync('posts_collected', postsCollected);
          //更新数据绑定变量，从而实现切换图片
          console.log(this)
          that.setData({
            collected: postCollected
          })
          
        }
      }
    })
  },
  showToast(postsCollected, postCollected) {
    //更新文章是否有缓存值
    wx.setStorageSync('posts_collected', postsCollected);
    //更新数据绑定变量，从而实现切换图片
    this.setData({
      collected: postCollected
    })
    wx.showToast({
      title: postCollected ? "收藏成功" : "取消收藏",
      duration: 1000,
      icon: 'success'
    })
  },
  onShareTap(event){
      var itemList=[
        "分享给微信好友",
        "分享到朋友圈",    
        "分享到QQ",
        "分享到微博"
      ];
        wx.showActionSheet({
         itemList:itemList,
         itemColor:"#405f80",
         success(res){
            //res.cancel 用户是不是点击了取消
            //res.tapIndex 数组元素的序号，从0开始
            wx.showModal({
              title: '用户'+itemList[res.tapIndex],
              content: '用户是否取消？'+res.cancel+'现在无法实现分享功能，什么时候能支持呢',
            })
         }
    })
  },
  onMusicTap(event){
    var currentPostId = this.data.currentPostId;
    var postData = postsData.postList[currentPostId];//简化书写
    var isPlayingMusic = this.data.isPlayingMusic;
    if (isPlayingMusic){//为真
        wx.pauseBackgroundAudio()
        this.setData({
          isPlayingMusic : false  
        })
    }else{
      wx.playBackgroundAudio({
        title: postData.music.title,
        coverImgUrl: postData.music.coverImg,
        dataUrl: postData.music.url
      })
      this.setData({
        isPlayingMusic :true
      })
    }    
  }
})  