const winston = require("winston");
var request = require("request");
const config = require("config");
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: config.get("OPENAI_API_KEY"),
});
const openai = new OpenAIApi(configuration);
const fs = require("fs");
//console.log(config.get("OPENAI_API_KEY"));

async function openAIreq(_text) {
  return new Promise(async function (resolve, reject) {
    try {
      console.log(config.get("OPENAI_API_KEY"));
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: _text,
        max_tokens: 50,
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
          authorization: "Basic Y29uaWRpZ0BnbWFpbC5jb20:9qjPErvy8f-IXl65QBzIi",
        },
        body: {
          script: {
            type: "text",
            provider: { type: "microsoft", voice_id: _voiceId, rate: _rate },
            ssml: "false",
            input: _inputText, //"Hello! this is for testing.",
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
          authorization: "Basic Y29uaWRpZ0BnbWFpbC5jb20:9qjPErvy8f-IXl65QBzIi",
        },
      };
      var data = fs.readFileSync("requestlog.js");
      var myObject = JSON.parse(data);
      const epoch = Date.now();
      const ISOtime = new Date();
      let obj = {
        epoch: epoch,
        UTCtime: ISOtime.toUTCString(),
        reqOptions: options,
      };
      myObject.push(obj);
      var newObj = JSON.stringify(myObject);
      fs.writeFile("requestlog.js", newObj, (err) => {
        // error checking
        if (err) throw err;

        console.log("New data added");
      });
      request(options, function (error, response) {
        if (error) throw new Error(error);
        //console.log(response.body);
        // let tempbody = response.body;
        // response.body =
        //   '{"metadata":{"driver_url":"bank://lively/driver-06/original","mouth_open":false,"num_faces":1,"num_frames":444,"processing_fps":49.26124224204778,"resolution":[512,512],"size_kib":4682.0634765625}}';
        resolve(response.body);
      });
    } catch (err) {
      winston.log("error", err.stack);
      reject(err);
    }
  });
}

async function isResultUrlAvailable(_videoId) {
  return new Promise(async function (resolve, reject) {
    try {
      let counter = 0;
      let isReqSent = false;
      let interval = setInterval(async () => {
        counter++;
        if (!isReqSent) {
          console.log("Sending Request: ", counter);
          isReqSent = true;

          let d_idVideoObj = await d_idGetRequest(_videoId);
          d_idVideoObj = JSON.parse(d_idVideoObj);
          if (d_idVideoObj.result_url) {
            resolve(d_idVideoObj.result_url);
            clearInterval(interval);
          } else {
            isReqSent = false;
          }
        } else {
          console.log("Not Sending Request", counter);
        }
      }, 1000);
    } catch (err) {
      winston.log("error", err.stack);
      reject(err);
    }
  });
}

module.exports.d_idPostRequest = d_idPostRequest;
module.exports.d_idGetRequest = d_idGetRequest;
module.exports.openAIreq = openAIreq;
module.exports.isResultUrlAvailable = isResultUrlAvailable;
