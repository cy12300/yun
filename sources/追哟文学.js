const baseUrl = "https://www.zhuiyo.com"

const header_mobile = [ "Cookie:zhuiyocom_sex=; UM_distinctid=;"]

const search = (key) => {
  let data = `searchtype=all&searchkey=${encodeURI(key)}`
  let response = POST(`${baseUrl}/search.html`, {data,headers: header_mobile})
  let array = []
  let $ = HTML.parse(response)
    $('#sitembox > dl').forEach((child) => {
      let $ = HTML.parse(child)
      array.push({
        name: $('h3 > a').text(),
        author: $('dd:nth-child(3) > span:nth-child(1)').text(),
        cover: $('img').attr('src'),
        detail: `${baseUrl}${$('h3 > a').attr('href')}`,
      })
    })
  
  return JSON.stringify(array)
}

const detail = (url) => {
  let response = GET(url, {headers: header_mobile})
  let $ = HTML.parse(response)
  let book = {
    summary: $('#intro > p:nth-child(1)').text(),
    status: $('meta[property=og:novel:status]').attr('content'),
    category: $('#intro > p:nth-child(2)').text().replace("本书关键词\：",""),
    update: $('#info > p:nth-child(4)').text().replace("最后更新\：",""),
    lastChapter: $('#info > p:nth-child(5) > a').text(),
    catalog: url
  }
  return JSON.stringify(book)
}

const catalog = (url) => {
  let response = GET(url, {headers: header_mobile})
  let $ = HTML.parse(response)
  let array = []
    $('dt:matches(正文) ~ dd').forEach((chapter) => {
      let $ = HTML.parse(chapter)
      array.push({
        name: $('a').text(),
        url: `${baseUrl}${$('a').attr('href')}`
      })
    })
  return JSON.stringify(array)
}

const chapter = (url) => {
  let content = ""
  let i = 2
  let first_url = url
  while (true) {
    let res = GET(url, {headers: header_mobile})
    let response = res.replace(/喜欢.*更新速度最快。/,"")
    let $ = HTML.parse(response)
    content += $('#content')
    let next_btn = $('a:contains(下一页)')
    if (next_btn.length == 0) {
      break
    }
    url = first_url.replace('.html', `_${i}.html`);
    i += 1
  }
  return content
}

var bookSource = JSON.stringify({
  name: "追哟文学",
  url: "www.zhuiyo.com",
  version: 107
})
