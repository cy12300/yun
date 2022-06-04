const header = ["type:app"]

//搜索
const search = (key) => {
  let response = POST(`https://api.97yd.com/search`,{data:`keyword=${encodeURI(key)}&page=0`,headers:header})
  let $ = JSON.parse(response).data
  let array = []
  $.forEach((child) => {
    array.push({
      name: child.title,
      author: child.author,
      cover: child.img,
      detail: `https://api.97yd.com/info?bookid=${child.bookid}&type=all`,
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
    status: $.status == 1 ? '连载' : '完结',
    category: $.sortname,
    words: $.words_w+`万`,
    update: $.lastupdate.replace("更新"),
    lastChapter: $.lastchapter,
    catalog: `https://api.97yd.com/menu?bookid=${$.bookid}&start=0`
  }
  return JSON.stringify(book)
}

//目录
const catalog = (url) => {
  let response = GET(url,{headers:header})
  let $ = JSON.parse(response).data
  let array = []
  $.forEach(chapter => {
    array.push({
      name: chapter.chaptername,
      url: `https://api.97yd.com/reader?bookid=${url.query("bookid")}&chapterid=${chapter.chapterid}`
    })
  })
  return JSON.stringify(array)
}

//章节
const chapter = (url) => {
  let response = GET(url,{headers:header})
  let $ = JSON.parse(response)
  return $.data.trim()
}

var bookSource = JSON.stringify({
  name: "必看悦读",
  url: "api.97yd.com",
  version: 100
})
