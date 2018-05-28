const rp = require('request-promise');
const crypto = require('crypto');

const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;

const generateFormData = require('../templates/generate-form-data');

module.exports = function updateBuyOrder(myPreviousOrder, currency, type, orderQty, leverage, price, clOrdID, clOrdLinkID) {
  const formData = generateFormData(currency, type, orderQty, leverage, price, clOrdID, clOrdLinkID);
  const postBody = JSON.stringify(formData);
  const verb = 'PUT',
    path = '/api/v1/order',
    expires = new Date().getTime() + (60 * 1000 * 3), // 3 min in the future
    data = formData;

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
    method: 'PUT',
    headers: headers,
    uri: 'https://www.bitmex.com/api/v1/order',
    body: formData,
    json: true // Automatically stringifies the body to JSON
  };

  return rp(options).then(function(parsedBody) {
    return parsedBody;
    // PUT succeeded...
  }).catch(function(err) {
    console.log(err , '-- err --');
    // PUT failed...
  });
}






// Pre-compute the postBody so we can be sure that we're using *exactly* the same body in the request
// and in the signature. If you don't do this, you might get differently-sorted keys and blow the signature.
