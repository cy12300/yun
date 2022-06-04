require('crypto-js')

const sign_key='d3dGiJc651gSQ8w1'

let headers={'app-version':'51110','platform':'android','reg':'0','AUTHORIZATION':'','application-id':'com.****.reader','net-env':'1','channel':'unknown','qm-params':''}

const header = ["app-version:51110","platform:android","reg:0","AUTHORIZATION: ","application-id:com.****.reader","net-env:1","qm-params: ","channel:unknown",`sign:${String(CryptoJS.MD5(Object.keys(headers).sort().reduce((pre,n)=>pre+n+'='+headers[n],'')+sign_key))}`]

//搜索
const search = (key) => {
  let ke = `${key}`
  let params ={'gender':'3','imei_ip':'2937357107','page':'1','wd':ke}
  let sign = String(CryptoJS.MD5(Object.keys(params).sort().reduce((pre,n)=>pre+n+'='+params[n],'')+sign_key))
  let response = GET(`https://api-bc.wtzw.com/api/v5/search/words?gender=3&imei_ip=2937357107&page=1&wd=${key}&sign=`+sign,{headers:header})
  let array = []
  let $ = JSON.parse(response)
  $.data.books.forEach((child) => {
    array.push({
      name: child.original_title,
      author: child.original_author,
      cover: child.image_link,
      detail:child.id ,
    })
  })
  return JSON.stringify(array)
}

//详情
const detail = (url) => {
  let pe = `${url}`
  let params ={'id':pe,'imei_ip':'2937357107','teeny_mode':0}
  let sign = String(CryptoJS.MD5(Object.keys(params).sort().reduce((pre,n)=>pre+n+'='+params[n],'')+sign_key))
  let response = GET(`https://api-bc.wtzw.com/api/v4/book/detail?id=${url}&imei_ip=2937357107&teeny_mode=0&sign=`+sign,{headers:header})
  let $ = JSON.parse(response).data.book
  let book = {
    summary: $.intro,
    status: $.chapter_list_desc,
    words: $.words_num,
    category: $.category1_name,
    update: timestampToTime($.update_time),
    lastChapter: $.latest_chapter_title,
    catalog: $.id
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
  let ce =`${url}`
  let params={'id':ce}
  let sign = String(CryptoJS.MD5(Object.keys(params).sort().reduce((pre,n)=>pre+n+'='+params[n],'')+sign_key))
  let response = GET(`https://api-ks.wtzw.com/api/v1/chapter/chapter-list?id=${url}&sign=`+sign,{headers:header})
  let $ = JSON.parse(response).data
  let array = []
  $.chapter_lists.forEach(chapter => {
      array.push({
        name: chapter.title,
        url: `https://api-ks.wtzw.com/api/v1/chapter/content?id=${url}&chapterId=${chapter.id}`
      })
    })
  return JSON.stringify(array)
}

//章节
const chapter = (url) => {
  let we = `${url.query("id")}`
  let ye = `${url.query("chapterId")}`
  let params={'id':we,'chapterId':ye}
  let sign = String(CryptoJS.MD5(Object.keys(params).sort().reduce((pre,n)=>pre+n+'='+params[n],'')+sign_key))
  let response = GET(`https://api-ks.wtzw.com/api/v1/chapter/content?id=`+we+`&chapterId=`+ye+`&sign=`+sign,{headers:header})
  let p = JSON.parse(response).data.content
  let n = CryptoJS.enc.Base64.parse(p).toString()
  let decrypt = function (data) {
    let key = CryptoJS.enc.Hex.parse('32343263636238323330643730396531')
    let iv = CryptoJS.enc.Hex.parse(localStorage.getItem('iv'))
    let Hex = CryptoJS.enc.Hex.parse(data)
    let Base64 = CryptoJS.enc.Base64.stringify(Hex)
    let decrypted = CryptoJS.AES.decrypt(Base64, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    })
    return decrypted.toString(CryptoJS.enc.Utf8)
}
localStorage.setItem('iv', n.slice(0,32))
return decrypt(n.slice(32)).trim()
}


var bookSource = JSON.stringify({
  name: "七猫小说",
  url: "api-ks.wtzw.com",
  version: 100
})
