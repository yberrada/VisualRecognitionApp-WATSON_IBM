'use strict';
var fs = require('fs');
var express=  require('express');
var bodyParser = require('body-parser');
var app= express();

app.use(express.static('public'));
app.set('view engine', 'ejs');

var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');

var visualRecognition = new VisualRecognitionV3({
	version: "2018-03-19",
	iam_apikey: 'Pij17ucCPbukIYHfmasd43uaq4gevJAWye53okaRFViM'
});

var classifier_ids = ["DefaultCustomModel_381600566"];
var threshold = 0.6;
var response1;
app.get('/', function (req, res) {
  res.render('index', {val: null,val2:null, error: null});
})
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/', function (req, res) {

  var images_file= fs.createReadStream(req.body.chat);

  var params = {
  	images_file: images_file,
  	classifier_ids: classifier_ids,
  	threshold: threshold
  };

  visualRecognition.classify(params, function(err, response) {
  	if (err) {
  		console.log(err);
  	} else {
  		console.log(JSON.stringify(response, null, 2));
      response1=JSON.parse(JSON.stringify(response, null, 2), null, 2);
      res.render('index', {val:response1.images[0].classifiers[0].classes[0].class,val2:response1.images[0].classifiers[0].classes[0].score,error: null});
  	}
  });
})
app.listen(2000,()=>{
  console.log("output to port 2000");
})
