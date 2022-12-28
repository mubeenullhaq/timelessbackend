const winston = require("winston");
var request = require("request");
const config = require("config");
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: config.get("OPENAI_API_KEY"),
});
const openai = new OpenAIApi(configuration);
//console.log(config.get("OPENAI_API_KEY"));

async function openAIreq(_text) {
  return new Promise(async function (resolve, reject) {
    try {
      console.log(config.get("OPENAI_API_KEY"));
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: _text,
        max_tokens: 5,
        temperature: 0,
      });
      resolve(response);
    } catch (err) {
      winston.log("error", err.stack);
      reject(err);
    }
  });
}

async function d_idPostRequest(_inputText, _voiceId, _rate, _sourceUrl) {
  return new Promise(async function (resolve, reject) {
    try {
      const options = {
        method: "POST",
        url: "https://api.d-id.com/talks",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          authorization: "Basic Y29uaWRpZ0BnbWFpbC5jb20:EnMMJcX1OS-2P6aCeSHR1",
        },
        body: {
          script: {
            type: "text",
            provider: { type: "microsoft", voice_id: _voiceId, rate: _rate },
            ssml: "false",
            input: "Hello! this is for testing.", //_inputText,
          },
          source_url: _sourceUrl,
        },
        json: true,
      };
      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        resolve(response);
        console.log(body);
      });
    } catch (err) {
      winston.log("error", err.stack);
      reject(err);
    }
  });
}

async function d_idGetRequest(_videoId) {
  return new Promise(async function (resolve, reject) {
    try {
      var options = {
        method: "GET",
        url: `https://api.d-id.com/talks/${_videoId}`,
        headers: {
          accept: "application/json",
          authorization: "Basic Y29uaWRpZ0BnbWFpbC5jb20:EnMMJcX1OS-2P6aCeSHR1",
        },
      };
      request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
        resolve(response.body);
      });
    } catch (err) {
      winston.log("error", err.stack);
      reject(err);
    }
  });
}

module.exports.d_idPostRequest = d_idPostRequest;
module.exports.d_idGetRequest = d_idGetRequest;
module.exports.openAIreq = openAIreq;
