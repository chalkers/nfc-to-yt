'use strict';

const config = require('./config.json');


let lastId = "";

function findNFC(callback) {
    const spawn = require('child_process').spawn;
    const nfc = spawn(config.Command);
    let stdout = "";
    nfc.stdout.on('data', (data) => {
        stdout += data;
    } );

    nfc.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });

    nfc.on('close', (code) => {
        if(code === 0) {
            let regex = /UID:[\s]+([\w]+)/g;
            callback(null, regex.exec(stdout)[1]);
        }
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