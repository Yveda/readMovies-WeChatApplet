var app = getApp()//引入全局变量
var util = require('../../../utils/util.js')
Page({
  data: {
    movies:{},
    navigateTitle: "",
    requestUrl:"",
    totalCount:0,
    isEmpty: true//movies为空
  },
  onLoad(options) {
    var category = options.category;
    this.data.navigateTitle = category;
    var dataUrl = "";
    switch (category) {
      case "正在热映":
        dataUrl = app.globalData.doubanBase +
          "/v2/movie/in_theaters";
        break;
      case "即将上映":
        dataUrl = app.globalData.doubanBase +
          "/v2/movie/coming_soon";
        break;
      case "豆瓣Top250":
        dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
        break;
    }
    this.data.requestUrl = dataUrl;
    util.http(dataUrl, this.processDoubanData);//调用公共的request请求函数
  },
  onReachBottom(event){//触底再刷新20条数据
    var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
    util.http(nextUrl, this.processDoubanData);
    wx.showNavigationBarLoading()
  },
  onPullDownRefresh(){//下拉刷新数据
    var refreshUrl = this.data.requestUrl + "?star=0&count=20";
    this.data.movies= {};//将数据置空
    this.data.totalCount=0;// 设置为0，下一次才能从0开始加载
    this.data.isEmpty = true;//此时因为没有数据所以应为true
    util.http(refreshUrl,this.processDoubanData);//发送请求，第二个参数是回调函数，用于处理请求数据
    wx.showNavigationBarLoading()//刷新的时候开启loading
  },
  processDoubanData(moviesDouban){//提取url我们需要的数据
      var movies = [];//用一个数组来作为记录我们处理完数据的容器
      for (var idx in moviesDouban.subjects) {//for循环来遍历一下我们要处理的数据数组
        var subject = moviesDouban.subjects[idx];
        var title = subject.title;
        if (title.length >= 6) {//电影名字判断一下，太长了截取下来
          title = title.substring(0, 6) + "...";
        }
        // [1,1,1,1,1] [1,1,1,0,0]数组就是这样一种形式
        var temp = {//把所有元素放到temp里面，然后在push到 数组movies里面，让他成为一个数据绑定的变量
          stars: util.convertToStarsArray(subject.rating.stars),
          title: title,
          average: subject.rating.average,//综合评分
          coverageUrl: subject.images.large,//封面海报
          movieId: subject.id//方便我们跳转到电影详情里面
        }
        movies.push(temp)
      }
      var totalMovies ={}//总的 movies
      if(!this.data.isEmpty){//如果要绑定新加载的数据，那么需要同旧有的数据合并在一起
        totalMovies = this.data.movies.concat(movies);
      }
      else{
        totalMovies = movies;
        this.data.isEmpty = false;
      }
      this.setData({
        movies: totalMovies
      });
      this.data.totalCount += 20;
      wx.hideNavigationBarLoading();//关闭触底再请求20条数据
      wx.stopPullDownRefresh();//关闭下拉刷新数据
  },
  onReady(event) {
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle,
      success() {

      }
    })
  },
    onMovieTap: function (event) {//跳转到电影详情里面去
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + movieId
    })
  },
})