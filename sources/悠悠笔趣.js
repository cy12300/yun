require('crypto-js')

const baseUrl = "https://app.lbiqu.com"

//搜索
const search = (key) => {
  let response = GET(`${baseUrl}/json/api_search.php?searchkey=${encodeURI(key)}&token=${CryptoJS.MD5('auth_shipsay_941376'+(new Date).getMinutes().toString())}`)
  let array = []
  let $ = JSON.parse(response)
  $.result_rows.forEach((child) => {
    array.push({
      name: child.articlename,
      author: child.author,
      cover: child.img_url,
      detail: `${baseUrl}/json/api_info.php?aid=${child.articleid}&token=${CryptoJS.MD5('auth_shipsay_941376'+(new Date).getMinutes().toString())}`,
    })
  })
  return JSON.stringify(array)
}

//详情
const detail = (url) => {
  let response = GET(url)
  let $ = JSON.parse(response);
  let book = {
    summary: $.intro,
    category: $.sortname,
    words: $.size,
    update: $.lastupdate_fmt,
    lastChapter: $.lastchapter,
    catalog: `https://app.lbiqu.com/json/api_indexlist.php?aid=${$.articleid}&per=20000&page=1&token=${CryptoJS.MD5('auth_shipsay_941376'+(new Date).getMinutes().toString())}`
  }
  return JSON.stringify(book)
}

//目录
const catalog = (url) => {
  let response = GET(url)
  let $ = JSON.parse(response)
  let array = []
  $.chapterrows.forEach(chapter => {
      array.push({
        name: chapter.chaptername,
        url: `https://app.lbiqu.com/json/api_read.php?aid=${url.query("aid")}&cid=${chapter.chapterid}&token=${CryptoJS.MD5('auth_shipsay_941376'+(new Date).getMinutes().toString())}`
      })
    })
  return JSON.stringify(array)
}

//章节
const chapter = (url) => {
    let $ = JSON.parse(GET(url))
  return $.content
}

var bookSource = JSON.stringify({
  name: "悠悠笔趣",
  url: "app.lbiqu.com",
  version: 103,
})