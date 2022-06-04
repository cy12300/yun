require('crypto-js')

const decrypt = function (data) {
    let key = CryptoJS.enc.Utf8.parse('NOVELS2019031200')
    decrypted = CryptoJS.AES.decrypt(data, key,{
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    })
    return decrypted.toString(CryptoJS.enc.Utf8)
}

const header = ["user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36"]

//搜索
const search = (key) => {
  let response = GET(`https://api.whcon.net/api2/search_book/search?key=${encodeURI(key)}&page=1`,{headers:header})
  let array = []
  let p = JSON.parse(response).data
  let $ = JSON.parse(decrypt(p))  
  $.forEach((child) => {
    array.push({
      name: child.book_title,
      author: child.book_author,
      cover: `https://fengmiantu.cdn.bcebos.com${child.book_img}`,
      detail: `https://api.whcon.net/s/book_info2/${parseInt(child.book_id.toString()%1000)}/${child.book_id}/${child.book_id}.txt`,
    })
  })
  return JSON.stringify(array)
}

//详情
const detail = (url) => {
  let response = GET(url,{headers:header})
  let p = JSON.parse(response).data
  let $ = JSON.parse(decrypt(p))
  let book = {
    summary: $.book_desc,
    status: $.book_status == 1 ? '连载' : '完结',
    category: $.book_type,
    update: timestampToTime($.update_time),
    lastChapter: $.new_chapter,
    catalog: `https://api.whcon.net/s/book_chapter_list2/${parseInt($.book_id.toString()%1000)}/${$.book_id}/${$.book_id}.txt`
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
  let p = JSON.parse(response).data
  let $ = JSON.parse(decrypt(p))
  let array = []
  $.forEach(chapter => {
      array.push({
        name: chapter.chapter_name,
        url: `https://api.whcon.net/s/book_chapter_info2${url.match(/book_chapter_list2(\/\d+\/\d+)/)[1]}/${chapter.chapter_id}.txt`
      })
    })
  return JSON.stringify(array)
}

//章节
const chapter = (url) => {
  let response = GET(url,{headers:header})
  let p = JSON.parse(response).data
  return decrypt(p).trim()
}


var bookSource = JSON.stringify({
  name: "阅民小说",
  url: "api.whcon.net",
  version: 100
})
