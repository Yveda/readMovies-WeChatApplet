var postsData = require('../../data/posts-data.js')
Page({
  data: {
    //小程序总是会读取data对象来做数据绑定，这个动作我们称为动作A
    // 而这个动作A的执行，是在onLoad函数执行之后发生的
  },
  onLoad: function () {
    // this.data.postList = postsData.postList
    //上面这种方法不行，但作者可以
    this.setData({
      postList: postsData.postList
    });
  },
  onPostTap:function(event){
    var postId = event.currentTarget.dataset.postid;
    console.log('on post id is:'+postId);
    wx.navigateTo({
      url: 'post-detail/post-detail?id='+postId,
    })
  },
  //  onSwiperItemTap: function (event) {
  //   var postId = event.currentTarget.dataset.postid;
  //   wx.navigateTo({
  //     url: 'post-detail/post-detail?id=' + postId,
  //   })
  // },
   onSwiperTap(event){//事件形参记得加，这里面的dataset含有postid，而currentTarget里面没有
     var postId = event.target.dataset.postid;
     wx.navigateTo({
       url: 'post-detail/post-detail?id=' + postId,
     })
   }
})