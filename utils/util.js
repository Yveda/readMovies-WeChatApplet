function convertToStarsArray(stars) {
  var num = stars.toString().substring(0, 1);
  var array = [];
  for (var i = 1; i <= 5; i++) {
    if (i <= num) {
      array.push(1);
    }
    else {
      array.push(0);
    }
  }
  return array;
}
function http(url,callback){//发请求的基本习惯叫http,这是个异步函数
  wx.request({
    url: url,
    method: "GET",
    header: {
      'Content-Type': ''
    },
    success(res) {
      callback(res.data)
    },
    fail(error) {
      console.log(error)
    }
  })
}
function convertToCastString(casts) {//把演员的名字用斜杠拼接起来
  var castsjoin = "";
  for (var idx in casts) {
    castsjoin = castsjoin + casts[idx].name + " / ";
  }
  return castsjoin.substring(0, castsjoin.length - 2);
}
function convertToCastInfos(casts) {//演员的名字和图片
  var castsArray = []
  for (var idx in casts) {
    var cast = {
      img: casts[idx].avatars ? casts[idx].avatars.large : "",
      name: casts[idx].name
    }
    castsArray.push(cast);
  }
  return castsArray;
}
module.exports = {
  convertToStarsArray: convertToStarsArray,
  http:http,
  convertToCastString: convertToCastString,
  convertToCastInfos: convertToCastInfos
}