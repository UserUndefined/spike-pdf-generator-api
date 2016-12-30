'use strict';

var AWS = require('aws-sdk');
var fs = require('fs');
var pdf = require('html-pdf');
var html = fs.readFileSync('./template.html', 'utf8');
var options = { format: 'Letter', "height": "29.7cm", "width": "21cm"};
var google = require('googleapis');
var key = require('./googlekey.json');
var scopes = ['https://www.googleapis.com/auth/drive'];
var drive = google.drive({version: 'v3'});

var jwtClient = new google.auth.JWT(
    key.client_email,
    null,
    key.private_key,
    scopes,
    null
);

console.log('Loading function spike-pdf-generator-api');

exports.handler = function(event, context) {
    generatePdfToBuffer(function(err, files){
        if (err) {
            console.log(err, err.stack);
            context.fail();
        } else {
            console.log(files);
            context.succeed({filePath: files});
        }
    });
};
/*
function generatePdfToFile(callback){
    console.log('calling query');
    pdf.create(html, options).toFile('./output.pdf', function(err, res) {
        if (err) {
            console.log(err);
            return callback(err);
        }
        console.log(res); // { filename: '/app/businesscard.pdf' }
        return callback(null, res);
    });
}
*/
function generatePdfToBuffer(callback){
    console.log('calling query');
        pdf.create(html, options).toBuffer(function(err, buffer){
        if (err) {
            console.log(err);
            return callback(err);
        } else {
            console.log('file buffered ok ' + buffer);
            console.log('send to S3');
/*
            putObjectToS3('temp-file-repo', 'AKIAJ3MWHLCIIHHZMQKQ', buffer, function(err, data){
                if (err) {
                    console.log(err, err.stack);
                    return callback(err);
                } else {
                    console.log(data);
                    return callback(null, data);
                }
            });
 */
            uploadToDrive(buffer, function(err, data){
                if (err) {
                    console.log(err, err.stack);
                    return callback(err);
                } else {
                    console.log(data);
                    return callback(null, data);
                }
            });
        }
    });
}

function putObjectToS3(bucket, key, data, callback){
    console.log('calling putObjectToS3');
    var s3 = new AWS.S3();
    var params = {
        Bucket : bucket,
        Key : key,
        Body : data
    };
    s3.putObject(params, function(err, data) {
        if (err) {
            console.log(err, err.stack);
            return callback(err);
        } else {
            console.log(data);
            getDriveFiles(function(err, files){
                if(err){
                    console.log(err, err.stack);
                    return callback(err);
                } else {
                    console.log(files);
                    return callback(null, files);
                }
            });
        }
    });
}

function getDriveFiles(callback){
    jwtClient.authorize(function (err, tokens) {
        if (err) {
            console.log(err);
            return callback(err);
        }
        drive.files.list({
            auth: jwtClient
        }, function (err, resp) {
            if (err) {
                console.log(err);
                return callback(err);
            } else {
                console.log(resp);
                return callback(null, resp.files);
            }
        });
    });
}

function uploadToDrive(file, callback){
    jwtClient.authorize(function (err, tokens) {
        if (err) {
            console.log(err);
            return callback(err);
        }
        drive.files.create({
            auth: jwtClient,
            resource: {
                name: 'test.pdf',
                mimeType: 'application/pdf'
            },
            media: {
                mimeType: 'application/pdf',
                body: file
            }
        }, function (err, resp) {
            if (err) {
                console.log(err);
                return callback(err);
            } else {
                console.log(resp);
                return callback(null, resp);
            }
        });
    });
}
