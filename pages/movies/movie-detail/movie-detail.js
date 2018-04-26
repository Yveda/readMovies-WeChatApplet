var util = require('../../../utils/util.js');
var app =getApp();
Page({
  data: {
    movie:{}//初始化
  },
  onLoad: function (options) {
    //页面初始化 options为页面跳转所带来的参数
    console.log(options)
    var movieId = options.id;
    var url = app.globalData.doubanBase +'/v2/movie/subject/' + movieId;
    console.log(movieId);
    util.http(url,this.processDoubanData);
  },
  processDoubanData(data) {
    if(!data){//如果数据为空则返回，返回在data里面定义的movie:{}
        return;
    }
    var director = {//第一部分处理director数据
      avatar: "",
      name: "",
      id: ""
    }
    if (data.directors[0] != null) {
      if (data.directors[0].avatars != null) {
        director.avatar = data.directors[0].avatars.large
      }
      director.name = data.directors[0].name;
      director.id = data.directors[0].id;
    }
    var movie = {//第二部分，对绑定的movie变量做一个填充
      movieImg: data.images ? data.images.large : "",//电影海报
      country: data.countries[0],
      title: data.title,
      originalTitle: data.original_title,//别名
      wishCount: data.wish_count,//多少人想看
      commentCount: data.comments_count,//多少人评论
      year: data.year,
      generes: data.genres.join("、"),//把一个数组转化成一个字符串
      stars: util.convertToStarsArray(data.rating.stars),//重点看星星数量
      score: data.rating.average,
      director: director,
      casts: util.convertToCastString(data.casts),
      castsInfo: util.convertToCastInfos(data.casts),//演员的名字和图片
      summary: data.summary
    }
    this.setData({//第三部分：更新数据绑定变量
      movie:movie
    })
  },
    /*查看图片*/
  viewMoviePostImg: function (e) {
    var src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src] // 需要预览的图片http链接列表
    })
  },
})