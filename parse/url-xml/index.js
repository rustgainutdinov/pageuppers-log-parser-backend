const needle = require('needle');

function parseUrl(wptId, cb) {
// const wptId = '190121_NV_6d5c57c9c1f4ef7342b989e6585cf4d8';

	function getParamByNameFromArray(arr, name) {
		for (let i = 0; i < arr.length; i++) {
			if (arr[i].name === name) {
				return arr[i];
			}
		}
	}

	const url = 'https://www.webpagetest.org/xmlResult.php?test=' + wptId;
	needle.get(url, (err, res) => {
		if (err) cb(err);
		if (!res || res.statusCode !== 200) cb(new Error('url is incorrect'));
		try {
			const status = getParamByNameFromArray(res.body.children, 'statusCode');
			if (Number(status.value) !== 200) console.log(new Error('url is incorrect'));
			const data = getParamByNameFromArray(res.body.children, 'data');
			const average = getParamByNameFromArray(data.children, 'average');
			const firstViewBody = getParamByNameFromArray(average.children, 'firstView');
			const bytes = getParamByNameFromArray(firstViewBody.children, 'bytesIn').value;
			const ttfb = getParamByNameFromArray(firstViewBody.children, 'TTFB').value / 1000;
			const loadTime = getParamByNameFromArray(firstViewBody.children, 'loadTime').value / 1000;
			const scoreCdn = getParamByNameFromArray(firstViewBody.children, 'score_cdn').value;
			const scoreKeepAlive = getParamByNameFromArray(firstViewBody.children, 'score_keep-alive').value;
			const scoreCompress = getParamByNameFromArray(firstViewBody.children, 'score_gzip').value;
			const scoreCache = getParamByNameFromArray(firstViewBody.children, 'score_cache').value;
			const scoreImgCompess = getParamByNameFromArray(firstViewBody.children, 'score_compress').value;
			const cdn = Number(scoreCdn) >= 80 ? true : false;
			const result = {
				loadTime,
				ttfb,
				bytes,
				cdn,
				scoreCdn,
				scoreKeepAlive,
				scoreCompress,
				scoreCache,
				scoreImgCompess
			};
			cb(null, result);
		} catch (e) {
			return cb(e);
		}
	});
}

module.exports = parseUrl;
