const request = require('request')
const async = require('async')
const fs = require('fs')

const url = 'http://airtw.epa.gov.tw/taqmplat/ajaxCS.aspx'
const time = '2017-01-22 18:00:00'

request.post({
  url: url,
  form: {
    QueryTime: time,
    Type: 'GetSiteinMap',
    SiteType: 'All'
  }
}, function (err, resp, sites) {
  var sites = JSON.parse(sites)
  async.eachSeries(sites, craw, console.log)
})

function craw (site, cb) {
  request.post({
    url: url,
    form: {
      Type: 'GetSiteDetail',
      SiteID: site.SiteID,
      QueryTime: time,
      SiteType: '中央政府'
    }
  }, function (err, resp, body) {
    var body = JSON.stringify(JSON.parse(body)[0])
    fs.appendFileSync(site.SiteID, `${body}\n`)
    cb(err)
  })
}
