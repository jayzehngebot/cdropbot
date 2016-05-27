var express = require('express');
var app = express();
var url = require('url');
var request = require('request');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', (process.env.PORT || 9001));

app.get('/', function(req, res){
	res.send('It works!');
});


app.get('/:sticker', function(req, res){

	console.log('incoming request');
	console.log(req.params.sticker);

	var stickerKeyword = req.params.sticker;

	// var data = JSON.parse(body);

	var parsed_url = url.format({
		pathname: 'http://www.comicdrop.com/api/v1/stickers',
		query: {
			keywords: stickerKeyword
		}
	})

	console.log('parsed_url : ', parsed_url);


	request(parsed_url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var data = JSON.parse(body);

			console.log('data', data);

			// get sticker id 

			var firstStickerID = data.stickers[0].id;
			console.log('firstStickerID', firstStickerID);


			// 'http://www.comicdrop.com/api/v1/stickers/:id/:size'
			// format new request for sticker image 
			// var sticker_url = url.format({
			//   pathname: 'http://www.comicdrop.com/api/v1/stickers/',
			//   id: firstStickerID
			// })

			var sticker_url = 'http://www.comicdrop.com/api/v1/stickers/';

			sticker_url += firstStickerID;
			sticker_url += '/thumbnail';

				console.log('sticker_url : ', sticker_url);

				// request(sticker_url, function(err, response,body){
				//   if (!error && response.statusCode == 200) {
				//       console.log('success what is body ', body);
				//   }
				// })

			// var first_url = data.response.hits[0].result.url;

			var body = {
				response_type: "in_channel",
				text: sticker_url
			};

			res.send(body);
		}
	});

});

app.post('/', function(req, res){



	console.log('incoming request');
	console.log(req.body.text);

	var stickerKeyword = req.body.text;

	// var data = JSON.parse(body);

	var parsed_url = url.format({
		pathname: 'http://www.comicdrop.com/api/v1/stickers',
		query: {
			keywords: stickerKeyword
		}
	})

	console.log('parsed_url : ', parsed_url);


	request(parsed_url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var data = JSON.parse(body);

			console.log('data', data);

			var firstStickerID = undefined;

			// get sticker id 

			if (data.stickers[0]){

				firstStickerID = data.stickers[0].id;
				
				var sticker_url = 'http://www.comicdrop.com/api/v1/stickers/';
						sticker_url += firstStickerID;
						sticker_url += '/thumbnail';

				// console.log('sticker_url : ', sticker_url);

				var body = {
					response_type: "in_channel",
					text: sticker_url
				};

				res.send(body);
			} else {

				var body = {
					response_type: "in_channel",
					text: 'sorry no stickers dog'
				};

				res.send(body);


			}


		}
	});

});


// EXAMPLE
// app.post('/post', function(req, res){
//   var parsed_url = url.format({
//     pathname: 'https://api.genius.com/search',
//     query: {
//       access_token: process.env.GENIUS_ACCESS,
//       q: req.body.text
//     }
//   });

//   request(parsed_url, function (error, response, body) {
//     if (!error && response.statusCode == 200) {
//       var data = JSON.parse(body);
//       var first_url = data.response.hits[0].result.url;

//       var body = {
//         response_type: "in_channel",
//         text: first_url
//       };

//       res.send(body);
//     }
//   });
// });

app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});
