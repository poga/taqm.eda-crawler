const request = require('request')
const async = require('async')
const fs = require('fs')
const moment = require('moment')

const url = 'http://airtw.epa.gov.tw/taqmplat/ajaxCS.aspx'
const time = moment().format('YYYY-MM-DD H:00:00')

request.post({
  url: url,
  form: {
    QueryTime: time,
    Type: 'GetSiteinMap',
    SiteType: 'All'
  }
}, function (err, resp, body) {
  if (err) console.log(err)
  var sites = JSON.parse(body)
  async.eachSeries(sites, craw, err => { if (err) console.log(err) })
})

function craw (site, cb) {
  request.post({
    url: url,
    form: {
      Type: 'GetSiteDetail',
      SiteID: site.SiteID,
      QueryTime: time,
      SiteType: site.SiteType2
    }
  }, function (err, resp, body) {
    if (err) return cb(err)
    var data = JSON.stringify(JSON.parse(body)[0])
    fs.appendFileSync(site.SiteID, `${data}\n`)
    cb()
  })
}

