Page({
  onContainerTap:function(event){
    // wx.navigateTo({
    //   url: '../posts/post',
    // })
    wx.redirectTo({
      url: '../posts/post',
    })
  }
})