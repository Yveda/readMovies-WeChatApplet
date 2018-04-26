var util = require('../../utils/util.js')
var app = getApp();//这样就拿到全局的所有变量。
Page({
  data:{
    inTheaters:{},
    comingSoon:{},
    top250:{},
    containerShow:true,//电影页面显示是否
    searchPanelShow:false,//搜索页面显示是否
    searchResult:{}//查询结果
  },
  onLoad(event){
    var inTheatersUrl = app.globalData.doubanBase+"/v2/movie/in_theaters"+"?start=0&count=3";
    var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?start=0&count=3";
    var top250Url = app.globalData.doubanBase + "/v2/movie/top250" + "?start=0&count=3";
    this.getMovieListData(inTheatersUrl, "inTheaters","正在热映");//正在热映,后面的参数作为一个key存在
    this.getMovieListData(comingSoonUrl, "comingSoon","即将上映");//即将上映
    this.getMovieListData(top250Url, "top250","Top250");//top250
  },
  onMoreTap(event){//跳转到更多页面去
    var category = event.currentTarget.dataset.category;
    console.log(category)
    wx.navigateTo({
      url: 'more-movie/more-movie?category='+category,
    })
  },
  onMovieTap(event){//跳转到电影详情里面去
  var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id='+movieId,
    })
  },
  getMovieListData(url, settedKey, categoryTitle){//发请求
    var that = this;
    wx.request({
      url: url,
      method: "GET",
      header: {
        'Content-Type': ''
      },
      success(res) {
        that.processDoubanData(res.data, settedKey, categoryTitle);
      },
      fail(error) {
        console.log(error)
      }
    })
  },
  onCancelImgTap(event){
    this.setData({
      containerShow:true,
      searchPanelShow:false,
      searchResult:{}//当图片关闭的时候，上次匹配到的数据置空
    })
  },
  onBindFocus(event){//聚焦事件
    this.setData({
      containerShow:false,
      searchPanelShow:true
    })
  },
  onBindBlur(event){
    var text = event.detail.value;//获取输入框里面的值
    var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text;
    this.getMovieListData(searchUrl,"searchResult","")//发请求
  },
  processDoubanData(moviesDouban, settedKey, categoryTitle){
    var movies = [];//用一个数组来作为记录我们处理完数据的容器
    for (var idx in moviesDouban.subjects) {//for循环来遍历一下我们要处理的数据数组
        var subject = moviesDouban.subjects[idx];
        var title = subject.title;
        if (title.length >= 6) {//电影名字判断一下，太长了截取下来
          title = title.substring(0,6)+ "...";
        }
        // [1,1,1,1,1] [1,1,1,0,0]数组就是这样一种形式
        var temp={//把所有元素放到temp里面，然后在push到 数组movies里面，让他成为一个数据绑定的变量
          stars: util.convertToStarsArray(subject.rating.stars),
          title:title,
          average: subject.rating.average,//综合评分
          coverageUrl: subject.images.large,//封面海报
          movieId: subject.id//方便我们跳转到电影详情里面
        }
        movies.push(temp)
      }
      // this.setData({//数据绑定
      //   movies:movies
      // })
      var readyData={};
      readyData[settedKey] = {
        categoryTitle: categoryTitle,
        movies: movies//每个类型下面都有一个movies 这样的一个属性值
      };
      this.setData(readyData);
   }
})
