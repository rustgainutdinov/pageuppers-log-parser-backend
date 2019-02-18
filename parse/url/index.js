const needle = require('needle');

function parseUrl(wptId, cb) {
  const url = 'https://www.webpagetest.org/result/' + wptId + '/';
  needle.get(url, (err, res) => {
    if (err) cb(err);
    if (res.statusCode !== 200) cb(new Error('url is incorrect'));
    try {
      const body = res.body.replace(/[\n\r]/ig, '');
      var reqData = body.toString().match(/<tr><td valign="middle">First View<\/td>(.*?)<\/tr>/i);
      reqData = reqData ? reqData : body;
      const loadTime = reqData.toString().match(/<td id="(fv|)FullyLoaded" class="border" valign="middle">(\d+?.\d*?)s<\/td>/i)[2];
      const ttfb = reqData.toString().match(/<td id="(fv|)TTFB" valign="middle">(\d+?.\d*?)s<\/td>/i)[2];
      const bytes = reqData.toString().match(/<td id="(fv|)BytesIn" valign="middle">(\d+?(,\d+?)?) KB<\/td>/i)[2].replace(/,/i, '');
      let cdn;
      try {
        cdn = body.toString().match(/<li class="use_of_cdn"><a href=".+?"><h2 class="([NAX]{1,2})"/i)[1] === 'A' ? true : false;
      } catch (e) {
        cdn = null;
      }
      const result = {
        loadTime,
        ttfb,
        bytes,
        cdn
      };
      cb(null, result);
    } catch (e) {
      return cb(e);
    }
  });
}

module.exports = parseUrl;
