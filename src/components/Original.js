const rp = require('request-promise')
const Sentiment = require('sentiment')
const url = 'http://www.gutenberg.org/files/1661/1661-h/1661-h.htm'


// 2525 unique paragraphs

// console.log($('p', html).length)
// console.log(Object.keys($('p', html)[0]))

// We want to get all the HTML Codes so we can create a conversion

// console.log(html.split('<p>').map(x => x.match(/&#\d{4}/g)).flat().filter(x => x !== null).filter(onlyUnique))

// We have &#8216, &#8217, &#8220, &#8221, &#8212

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index
}

let sentiment = new Sentiment()


rp(url)
  .then(function(html) {
    console.dir(html.split('<p>')
    .map(x => x.replace(/&#8212/g, '-')
    .replace(/[\r\n]+/g, ' ')
    .replace(/&#8220/g, '"')
    .replace(/&#8221/g, '"')
    .replace(/;/g, '')
    .replace(/&#8216/g, '')
    .replace(/&#8217/g, '')
    .replace(/&nbsp/g, ' ')
    .split(' '))
    .slice(1)
    .flat()
    .filter(x => x.length !== 0)
    .filter(x => !x.includes('<'))
    .filter(x => !x.includes('>'))
    .map(x => x.replace('.', ''))
    .map(x => x.replace('!', ''))
    .map(x => x.replace('?', ''))
    .map(x => x.toUpperCase())
    .map(x => x.split('-'))
    .flat()
    .filter(onlyUnique)
    .filter(x => !x.includes('HTTP'))
    .filter(x => !x.includes('TRADEMARK'))
    .filter(x => !x.includes('WWWGUTENBERG'))
    .filter(x => !x.includes('@'))
    .map(x => sentiment.analyze(x).score)
    .filter(x => x > 0)
    .length
    )
    // .map(x => sentiment.analyze(x))
    // .map(x => x.score), {'maxArrayLength': null})
  })
  .catch(function(err){
})
