//搜索
const search = (key) => {
    let response = POST(`https://wap.bookxuan.com/s.php`,{data:`search_key=${ENCODE(key,"gb18030")}`})
    let array = []
    let $ = HTML.parse(response)
    $('p.sone').forEach((child) => {
        let $ = HTML.parse(child)
        array.push({
            name: $('a').text(),
            author: $('span.author').text(),
            detail: `https://www.bookxuan.com${$('a').attr('href')}`,
        })

    })
    return JSON.stringify(array)
}

//详情
const detail = (url) => {
    let response = GET(url, {
        headers: ["User-Agent:Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.92 Safari/537.36"]
    })
    let $ = HTML.parse(response)
    let book = {
        summary: $('meta[property=og:description]').attr("content"),
        status: $('meta[property=og:novel:status]').attr("content"),
        category: $('meta[property=og:novel:category]').attr("content"),
        update: $('meta[property=og:novel:update_time]').attr("content"),
        lastChapter: $('meta[property=og:novel:latest_chapter_name]').attr("content"),
        catalog: url
    }
    return JSON.stringify(book)
}

//目录
const catalog = (url) => {
    let response = GET(url, {
        headers: ["User-Agent:Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.92 Safari/537.36"]
    })
    let $ = HTML.parse(response)
    let array = []
    $('#list > dl > dt:nth-child(11)~dd').forEach((booklet) => {
        let $ = HTML.parse(booklet)
        array.push({
            name: $("a").text(),
            url: `https://www.bookxuan.com${$('a').attr('href')}`,
            vip: false
        })
    })
    return JSON.stringify(array)
}

//章节
const chapter = (url) => {
    let response = GET(url, {
        headers: ["User-Agent:Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.92 Safari/537.36"]
    })
    let $ = HTML.parse(response)
    return $("#content")
}




var bookSource = JSON.stringify({
    name: "书轩网",
    url: "wap.bookxuan.com",
    version: 100
})