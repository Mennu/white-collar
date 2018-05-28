const rp = require('request-promise');
const crypto = require('crypto');

const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;

module.exports = function getPosition() {
  const verb = 'POST',
    path = '/api/v1/position/isolate',
    expires = new Date().getTime() + (60 * 1000 * 3); // 3 min in the future

  const formData = {
    symbol:'XBTUSD',
    enabled:true
  };
  const postBody = JSON.stringify(formData);
  const signature = crypto.createHmac('sha256', apiSecret).update(verb + path + expires + postBody).digest('hex');

  const  headers = {
    'content-type' : 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'api-expires': expires,
    'api-key': apiKey,
    'api-signature': signature
  };

  var options = {
    method: 'POST',
    headers: headers,
    uri: 'https://www.bitmex.com/api/v1/position/isolate',
    body: formData,
    json: true 
  };

  return rp(options).then(function(parsedBody) {
    console.log(parsedBody , '-- parsedBody --');
    return parsedBody;
  }).catch(function(err) {
    console.log(err , '-- err --');
  });
}






// Pre-compute the postBody so we can be sure that we're using *exactly* the same body in the request
// and in the signature. If you don't do this, you might get differently-sorted keys and blow the signature.