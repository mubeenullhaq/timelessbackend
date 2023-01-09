const express = require("express");
const {
  openAIreq,
  d_idPostRequest,
  d_idGetRequest,
  isResultUrlAvailable,
} = require("../routes/helper");
const config = require("config");
let router = express.Router();
console.log(config.get("OPENAI_API_KEY"));
//Create route
router.post("/", async (req, res) => {
  try {
    console.log(config.get("OPENAI_API_KEY"));
    console.log("userInput", req.body.userInput);
    console.log("vocie id", req.body.voiceId);
    let prompt = req.body.avatarPrompt + req.body.userInput;
    let OpenAIres = await openAIreq(prompt);
    console.log(OpenAIres);
    const openAIresponse = OpenAIres.data.choices[0].text;
    console.log(
      "/////////////////////////////////////////OpenAI Answer: ",
      openAIresponse
    );

    //Call D-ID API end point with source URL to create video
    let d_idresponse = await d_idPostRequest(
      openAIresponse,
      req.body.voiceId,
      req.body.rate,
      req.body.sourceUrl
    );
    console.log(
      "/////////////////////////////////////////Video Id: ",
      d_idresponse.body.id
    );

    //let d_idVideoObj = await d_idGetRequest("tlk_2d-Sr1ZhOGCg9FgZj_wGU");
    let d_idVideoObj = await d_idGetRequest(d_idresponse.body.id);
    d_idVideoObj = JSON.parse(d_idVideoObj);
    console.log(
      "/////////////////////////////////////////Video URL",
      d_idVideoObj.result_url
    );
    if (!d_idVideoObj.result_url) {
      d_idVideoObj.result_url = await isResultUrlAvailable(
        d_idresponse.body.id
      );
      console.log(
        "/////////////////////////////////////////Video URL",
        d_idVideoObj.result_url
      );
      // d_idVideoObj.result_url = await isResultUrlAvailable(
      //   "tlk_2d-Sr1ZhOGCg9FgZj_wGU"
      // );
    }
    return res.status(200).send({ result_url: d_idVideoObj.result_url });
  } catch (e) {
    console.log(e);
    return res.status(500).send(e);
  }
});

//Test route
router.post("/test", async (req, res) => {
  try {
    console.log("Request Body:  ", req.body);
    //let d_idVideoObj = await d_idGetRequest("tlk_flpQPBFy3ev5YT4elxUmG");
    let d_idVideoObj = await d_idGetRequest(d_idresponse.body.id);
    d_idVideoObj = JSON.parse(d_idVideoObj);
    console.log(
      "/////////////////////////////////////////Video URL",
      d_idVideoObj.result_url
    );
    if (!d_idVideoObj.result_url) {
      d_idVideoObj.result_url = await isResultUrlAvailable(
        d_idresponse.body.id
      );
      console.log(
        "/////////////////////////////////////////Video URL",
        d_idVideoObj.result_url
      );
      // d_idVideoObj.result_url = await isResultUrlAvailable(
      //   "tlk_flpQPBFy3ev5YT4elxUmG"
      // );
    }
    return res.status(200).send({ result_url: d_idVideoObj.result_url });
  } catch (e) {
    console.log(e);
    return res.status(500).send(e);
  }
});

module.exports = router;
