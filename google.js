var google = require('googleapis');
//var client = require('./googleclient');
var key = require('./googlekey.json');

var scopes = [
//    'https://www.googleapis.com/auth/drive.metadata.readonly',
//    'https://www.googleapis.com/auth/drive.photos.readonly',
//    'https://www.googleapis.com/auth/drive.readonly'
    'https://www.googleapis.com/auth/drive'
];

var drive = google.drive({version: 'v3'});

var jwtClient = new google.auth.JWT(
    key.client_email,
    null,
    key.private_key,
    scopes,
    null
);

console.log('Loading function spike-pdf-file-upload');

exports.handler = function(event, context) {
    //listDriveFiles(function(err, files){
    //fetchDriveFiles(function(err, files){
    //downloadFiles(function(err, files){
    getDriveFiles(function(err, files){
        if (err) {
            console.log(err, err.stack);
            context.fail();
        } else {
            console.log(files);
            context.succeed({files: files});
        }
    });
};

function getDriveFiles(callback){
    jwtClient.authorize(function (err, tokens) {
        if (err) {
            console.log(err);
            return callback(err);
        }

        // Make an authorized request to list Drive files.
        drive.files.list({
            auth: jwtClient
        }, function (err, resp) {
            if (err) {
                console.log(err);
                return callback(err);
            }
            console.log(resp);
            return callback(null, resp);
        });
    });
}
/*
var auth = client.oAuth2Client;

var drive = google.drive({
    version: 'v3',
    auth: auth
});

function downloadFiles(callback){
    client.execute(scopes, function (tokens) {
        download(args[0], tokens);
        return callback(null);
    });
}

function download (fileId, tokens) {
    drive.files.get({
        fileId: fileId
    }, function (err, metadata) {
        if (err) {
            console.error(err);
            return process.exit();
        }

        console.log('Downloading %s...', metadata.name);

        auth.setCredentials(tokens);

        var dest = fs.createWriteStream(metadata.name + '.pdf');

        drive.files.export({
            fileId: fileId,
            mimeType: 'application/pdf'
        })
            .on('error', function (err) {
                console.log('Error downloading file', err);
                process.exit();
            })
            .pipe(dest);

        dest
            .on('finish', function () {
                console.log('Downloaded %s!', metadata.name);
                process.exit();
            })
            .on('error', function (err) {
                console.log('Error writing file', err);
                process.exit();
            });
    });
}

var scopes = [
    'https://www.googleapis.com/auth/drive.metadata.readonly',
    'https://www.googleapis.com/auth/drive.photos.readonly',
    'https://www.googleapis.com/auth/drive.readonly'
];

function listDriveFiles(callback) {
    drive.files.list({
        q: "mimeType='image/jpeg'",
        fields: 'nextPageToken, files(id, name)',
        spaces: 'drive'
    }, function (err, resp) {
        if (err) {
            console.log(err);
            return callback(err);
        }
        console.log(resp);
        return callback(resp);
    });
}

var fetchPage = function(pageToken, pageFn, callback) {
    drive.files.list({
        q: "mimeType='image/jpeg'",
        fields: 'nextPageToken, files(id, name)',
        spaces: 'drive',
        pageToken: pageToken
    }, function(err, res) {
        if(err) {
            callback(err);
        } else {
            res.files.forEach(function(file) {
                console.log('Found file: ', file.name, file.id);
            });
            if (res.nextPageToken) {
                console.log("Page token", res.nextPageToken);
                pageFn(res.nextPageToken, pageFn, callback);
            } else {
                callback();
            }
        }
    });
};

function fetchDriveFiles(callback){
    fetchPage(null, fetchPage, function(err) {
        if (err) {
            // Handle error
            console.log(err);
            return callback(err);
        } else {
            // All pages fetched
            return callback(null);
        }
    });
}
*/
