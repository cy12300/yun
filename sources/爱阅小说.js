require('crypto-js')

const search = (key) => {
  let response = GET(`https://api.dgjiayuan.cn/v1/search/result?app_id=5&channel_id=default&platform_id=1&version=1.0.16&page=1&keyword=${encodeURI(key)}`)
  let a = response.substring(16)
  let v = response.substring(0,16)
  function decrypt(data) {
    let key = CryptoJS.enc.Utf8.parse('Shuew237HSFH242s')
    let iv = CryptoJS.enc.Utf8.parse(v)
    decrypted = CryptoJS.AES.decrypt(data, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    })
    return decrypted.toString(CryptoJS.enc.Base64)
}
  let n = decrypt(a)
  let $ = JSON.parse(ungzip(n))
  let array = []
  $.data.forEach((child) => {
    array.push({
      name: child.title,
      author: child.author,
      cover: `https://txtstore-1306798419.file.myqcloud.com/images//${child.cover}`,
      detail: `https://appstore-1306798419.file.myqcloud.com/v1/books/${child.id}/${child.v}.txt`,
    })
  })
  return JSON.stringify(array)
}


const detail = (url) => {
  let response = GET(url)
  let a = response.substring(16)
  let v = response.substring(0,16)
  function decrypt(data) {
    let key = CryptoJS.enc.Utf8.parse('Shuew237HSFH242s')
    let iv = CryptoJS.enc.Utf8.parse(v)
    decrypted = CryptoJS.AES.decrypt(data, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    })
    return decrypted.toString(CryptoJS.enc.Base64)
}
  let n = decrypt(a)
  let $ = JSON.parse(ungzip(n))
  let book = {
    summary: $.data.intro,
    status: $.data.state,
    category: $.data.category,
    words: $.data.words,
    update: $.data.last_at,
    lastChapter: $.data.last_chap,
    catalog: `https://appstore-1306798419.file.myqcloud.com/v1/chapters/${$.data.id}/${$.data.v}.txt`
  }
  return JSON.stringify(book)
}

const catalog = (url) => {
  let response = GET(url)
  let a = response.substring(16)
  let v = response.substring(0,16)
  function decrypt(data) {
    let key = CryptoJS.enc.Utf8.parse('Shuew237HSFH242s')
    let iv = CryptoJS.enc.Utf8.parse(v)
    decrypted = CryptoJS.AES.decrypt(data, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    })
    return decrypted.toString(CryptoJS.enc.Base64)
}
  let n = decrypt(a)
  let $ = JSON.parse(ungzip(n))
  let array = []
    $.data.map(chapter => {
        array.push({
            name: chapter.title,
            url: `https://appstore-1306798419.file.myqcloud.com/v1/contents/${chapter.id}/${chapter.v}.txt`
        })
    })

    return JSON.stringify(array)
}

const chapter = (url) => {
  let response = GET(url)
  let a = response.substring(16)
  let v = response.substring(0,16)
  function decrypt(data) {
    let key = CryptoJS.enc.Utf8.parse('Shuew237HSFH242s')
    let iv = CryptoJS.enc.Utf8.parse(v)
    decrypted = CryptoJS.AES.decrypt(data, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    })
    return decrypted.toString(CryptoJS.enc.Base64)
}
  let n = decrypt(a)
  let $ = JSON.parse(ungzip(n))
  return $.data
}


var bookSource = JSON.stringify({
    name: "爱阅小说",
    url: "api.dgjiayuan.cn",
    version: 100
})