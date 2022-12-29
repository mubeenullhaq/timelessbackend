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
    console.log(req.body.userInput);
    // let OpenAIres = await openAIreq(req.body.userInput);
    // console.log(OpenAIres);
    // const openAIresponse = OpenAIres.data.choices[0].text;
    // //Call D-ID API end point with source URL to create video
    // let d_idresponse = await d_idPostRequest(
    //   openAIresponse,
    //   "Diego",
    //   "0.8",
    //   "https://asongwall.com/wp-content/uploads/2022/12/van-gogh.png"
    // );
    let d_idVideoObj = await d_idGetRequest("tlk_JVEW22GZLFuh-ECk3EwRY");
    //let d_idVideoObj = await d_idGetRequest(d_idresponse.body.id);
    d_idVideoObj = JSON.parse(d_idVideoObj);
    console.log(d_idVideoObj.result_url);
    if (!d_idVideoObj.result_url) {
      d_idVideoObj.result_url = await isResultUrlAvailable(
        "tlk_JVEW22GZLFuh-ECk3EwRY"
      );
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
    console.log(req.body.userInput);
    console.log(req.body);
    return res.status(200).send(req.body);
  } catch (e) {
    console.log(e);
    return res.status(500).send(e);
  }
});

module.exports = router;
