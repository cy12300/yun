require('crypto-js')

const decrypt = function (data) {
    let key = CryptoJS.enc.Utf8.parse('bQRKwYYkR0IDqRKC')
    let iv = CryptoJS.enc.Utf8.parse('0123456789abcdef')
    decrypted = CryptoJS.AES.decrypt(data, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    })
    return decrypted.toString(CryptoJS.enc.Utf8)
}

const headers = ["User-Agent:okhttp/4.9.2","client-device:4cc5cd0c6df09ab4f832ac3e104ac725","client-brand:MI PAD 4","client-version:1.7.0","client-source:android","Authorization:bearereyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkuYW53YWJlbi5jb21cL2F1dGhcL3RoaXJkIiwiaWF0IjoxNjQ0OTAwMjY1LCJleHAiOjE3MzgyMTIyNjUsIm5iZiI6MTY0NDkwMDI2NSwianRpIjoieXNYTjdxcG12ZlBwbWxBQSIsInN1YiI6MzIyOCwicHJ2IjoiYTFjYjAzNzE4MDI5NmM2YTE5MzhlZjMwYjQzNzk0NjcyZGQwMTZjNSJ9.PyUgkd2Rd0d5x8Ngy8kL5dqN-FI14fqddkE7B8sD13g"]

//搜索
const search = (key) => {
  let response = GET(`http://api.anwaben.com/search?keyword=${encodeURI(key)}&page=1`,{headers})
  let array = []
  let $ = JSON.parse(response)
  $.data.forEach((child) => {
    array.push({
      name: child.novelName,
      author: child.authorName,
      cover: child.cover,
      detail: `http://api.anwaben.com/novel/${child.novelId}?isSearch=1`,
    })
  })
  return JSON.stringify(array)
}

//详情
const detail = (url) => {
  let response = GET(url,{headers})
  let $ = JSON.parse(response).data
  let book = {
    summary: $.summary,
    status: $.status == 1 ? '连载' : '完结',
    category: $.categoryNames[0].className,
    words: $.wordNum,
    update: $.lastChapter.decTime,
    lastChapter: $.lastChapter.chapterName,
    catalog: `http://api.anwaben.com/novel/${$.novelId}/chapters?readNum=1`
  }
  return JSON.stringify(book)
}

//目录
const catalog = (url) => {
  let response = GET(url,{headers})
  let $ = JSON.parse(response)
  let array = []
  $.data.forEach(chapter => {
      array.push({
        name: chapter.chapterName,
        url: decrypt(chapter.path)
      })
    })
  return JSON.stringify(array)
}

//章节
const chapter = (url) => {
    let $ = JSON.parse(GET(url,{headers}))
  return $.content
}

var bookSource = JSON.stringify({
  name: "猫眼看书",
  url: "api.anwaben.com",
  version: 103
})