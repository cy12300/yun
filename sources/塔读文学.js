const header = ["User-Agent:Mozilla/5.0 (Linux; Android 10; TAS-AN00 Build/HUAWEITAS-AN00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/74.0.3729.186 Mobile Safari/537.36","X-Client:version=6.6.68.1047","Cookie:sessionid=0d667c82f60247a69e3e1693e3c0b794"]

const baseurl = "http://123.56.101.109"
//搜索
const search = (key) => {
    let response = GET(`${baseurl}/ci/search/result?searchcontent=${encodeURI(key)}&page=1&type=3&readLike=0&searchType=3`,{headers:header})
    let array = []
    let $ = JSON.parse(response)
    $.data.bookList.map(book => {
        array.push({
            name: book.name,
            author:book.author,
            cover:book.picUrl,
            detail: `https://www.tadu.com/book/${book.bookId}`,
        })
    })
    return JSON.stringify(array)
}

//详情
const detail = (url) => {
    let response = GET(url)
    let $ = HTML.parse(response)
    let book = {
    summary: $('p.intro').text(),
    category: $('div.sortList').text(),
    words: $('div.datum > span:nth-child(1) > em').text(),
    update: $('div.newChapter.clearfix > div:nth-child(1) > em').text(),
    lastChapter: $('div.newChapter.clearfix > div:nth-child(1) > a').text(),
    catalog: `https://www.tadu.com/book/catalogue/${url.match(/(\d+)/)[1]}/`
  }
  return JSON.stringify(book)
}
//目录
const catalog = (url) => {
  let response = GET(url)
  let $ = HTML.parse(response)
  let array = []
    $('div.chapter.clearfix > a').forEach((chapter) => {
      let $ = HTML.parse(chapter)
      array.push({
        name: $('a').text(),
        url: `https://www.tadu.com${$('a').attr('href')}`
      })
    })
  return JSON.stringify(array)
}

//章节
const chapter = (url) => {
    let response = GET(url)
    let $ = HTML.parse(response)
    let v = GET(`${$('#bookPartResourceUrl').attr('value')}`)
    return v.replace(/(callback.+?:')|('\}\))/g,"")
}

var bookSource = JSON.stringify({
    name: "塔读",
    url: "123.56.101.19",
    version: 100
})