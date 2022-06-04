require('crypto-js')

const decrypt = function (data) {
    let key = CryptoJS.enc.Utf8.parse('ZKYm5vSUhvcG9IbXNZTG1pb2')
    let iv = CryptoJS.enc.Utf8.parse('01234567')
    data = data.replaceAll("\n","")
    decrypted = CryptoJS.TripleDES.decrypt(data, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    })
    return decrypted.toString(CryptoJS.enc.Utf8)
}

const header = ["Version-Name:2.0.0","Version-Code:20000","appid:bishugexs","Channel:vivo"]

//搜索
const search = (key) => {
  let response = POST(`http://m.damaoli.com/search/book/result`,{data:`kw=${encodeURI(key)}&pn=1&is_author=0`,headers:header})
  let r = decrypt(JSON.parse(response).data)
  let $ = JSON.parse(r)
  let array = []
  $.result.forEach((child) => {
    array.push({
      name: child.book_name,
      author: child.author_name,
      cover: child.book_cover,
      detail: `http://s.damaoli.com/api/book/detail/${parseInt(child.book_id.toString()/1000)}/${child.book_id}.json`,
    })
  })
  return JSON.stringify(array)
}

//详情
const detail = (url) => {
  let response = GET(url,{headers:header})
  let r = decrypt(JSON.parse(response).data)
  let $ = JSON.parse(r).result
  let book = {
    summary: $.book_brief,
    status: $.is_free == 0 ? '连载' : '完结',
    category: $.category_name,
    words: $.book_word_num,
    update: timestampToTime($.update_time),
    lastChapter: $.chapter_new_name,
    catalog:$.book_id
  }
  return JSON.stringify(book)
}

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
  let response = GET(`http://s.damaoli.com/api/book/chapter/${parseInt(url.toString()/1000)}/${url}/list.json?t=27569019`,{headers:header})
  let r = decrypt(JSON.parse(response).data)
  let $ = JSON.parse(r)
  let array = []
  $.result.forEach(chapter => {
    array.push({
      name: chapter.chapter_name,
      url: `http://m.damaoli.com/api/chapter/content?book_id=${url}&chapter_id=${chapter._id}`
    })
  })
  return JSON.stringify(array)
}

//章节
const chapter = (url) => {
  let response = GET(url,{headers:header})
  return JSON.parse(decrypt(JSON.parse(response).data)).content.trim()
}

var bookSource = JSON.stringify({
  name: "笔书阁",
  url: "m.damaoli.com",
  version: 100
})
