'use strict';

const config = require('./config.json');


let lastId = "";

function findNFC(callback) {
    const spawn = require('child_process').spawn;
    const nfc = spawn(config.Command);
    let stdout = "";
    let callbackCalled = false;
    nfc.stdout.on('data', (data) => {
        stdout += data;
        let regex = /UID:[\s]+([\w]+)/g;
        const results = regex.exec(stdout);
        if(results.length > 0 && !callbackCalled) {
            callbackCalled = true;
            callback(null, results[1]);
        }
    } );

    nfc.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });
}

function playYTForUID(uid) {
    console.log(config.Toy[uid]);
}

function handleNFC(err, uid) {
    if(lastId !== uid) {
        playYTForUID(uid);
    }
    lastId = uid;
    findNFC(handleNFC);
}

findNFC(handleNFC);