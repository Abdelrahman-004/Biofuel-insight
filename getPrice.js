const https = require('https');
https.get('https://query1.finance.yahoo.com/v8/finance/chart/BZ=F', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(JSON.parse(data).chart.result[0].meta.regularMarketPrice));
});
