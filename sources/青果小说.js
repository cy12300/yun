require('crypto-js')

const header = ["user-agent:okhttp/4.7.2","version: 1.0.3","x-token: eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMDA3ODI5LCJ0eXBlIjoiZ3Vlc3QiLCJjcmVhdGVkQXQiOjE2NDYyODg2OTh9.M4C_eWFdepcw0SvKBaMfUH5xJGPbalMwH34aadIT_Myd-Y1IHf3ieCZIHPQDd0P9rffbgnexys95PJwZUwMFsthIG3pM43PYtjryjB0czX1our9X92yd3VWXkC-OtTm_vRI-BmRqIV-6CsGR53cMNcE83uKu2nCEq5zMlEQy9F0"]

//搜索
const search = (key) => {
  let data =`{"pageSize":20,"keyword":"${key}","pageNum":1}`
  let response = POST(`https://qingking.hyhyn.com/api/v1/article/search`,{data,headers:header})
  let array = []
  let $ = JSON.parse(response).data  
  $.list.forEach((child) => {
    array.push({
      name: child.articleName,
      author: child.author,
      cover: child.cover,
      detail: `https://qingking.hyhyn.com/api/v1/article/queryById?articleId=${child.articleId}`,
    })
  })
  return JSON.stringify(array)
}

//详情
const detail = (url) => {
  let response = GET(url,{headers:header})
  let $ = JSON.parse(response).data
  let book = {
    summary: $.intro,
    status: $.statusName,
    category: $.categoryName,
    words: $.size,
    update: timestampToTime($.lastChapterUpdateTime),
    lastChapter: $.lastChapterName,
    catalog: $.chapterUrl
  }
  return JSON.stringify(book)
}

//转换更新时间 时间戳
function timestampToTime(timestamp) {
  var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1):date.getMonth()+1) + '-';
  var D = (date.getDate()< 10 ? '0'+date.getDate():date.getDate())+ ' ';
  var h = (date.getHours() < 10 ? '0'+date.getHours():date.getHours())+ ':';
  var m = (date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()) + ':';
  var s = date.getSeconds() < 10 ? '0'+date.getSeconds():date.getSeconds();
  return Y+M+D+h+m+s;
}
//目录
const catalog = (url) => {
  let response = GET(url,{headers:header})
  let $ = JSON.parse(response)
  let array = []
  $.chapters.forEach(chapter => {
      array.push({
        name: chapter[1],
        url: `${url.replace(/index\.json/,"")}${chapter[0]}.json`
      })
    })
  return JSON.stringify(array)
}

//章节
const chapter = (url) => {
  let response = GET(url,{headers:header})
  let p = JSON.parse(response).content
  var v = JSON.parse(response).iv
  function decode(word) {
    let key = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse("kanshujsontest\u0000\u0000"));
    let bkey = CryptoJS.enc.Base64.parse(key); 
    let iv = CryptoJS.enc.Base64.parse(v);   
    str = CryptoJS.AES.decrypt(word, bkey, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    })
    return str.toString(CryptoJS.enc.Utf8)
}
  let s = decode(p)
  return CryptoJS.enc.Base64.parse(s).toString(CryptoJS.enc.Utf8);
}

var bookSource = JSON.stringify({
  name: "青果小说",
  url: "qingking.hyhyn.com",
  version: 100
})
