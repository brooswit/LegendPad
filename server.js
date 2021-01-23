const express = require('express');
const app = express();
const dist = express.static('dist'); 
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const port = process.env.PORT || 3000;

app.use(dist);

let states = {};
let combinedState = {};
let averageState = {};

function combineStates() {
    combinedState = {};
    combinedState.keys = {};
    combinedState.controllers = {};
    for(stateKey in states) {
        for(keyIndex in states[stateKey].keys) {
            combinedState.keys[keyIndex] = combinedState.keys[keyIndex] || [];
            combinedState.keys[keyIndex].push(states[stateKey].keys[keyIndex]?1:-1);
        }
        
        for(controllerIndex in states[stateKey].controllers) {
            combinedState.controllers[controllerIndex] = combinedState.controllers[controllerIndex] || {};
            combinedState.controllers[controllerIndex].buttons = combinedState.controllers[controllerIndex].buttons || {};
            combinedState.controllers[controllerIndex].axes = combinedState.controllers[controllerIndex].axes || {};
            for(buttonIndex in states[stateKey].controllers[controllerIndex].buttons) {
                combinedState.controllers[controllerIndex].buttons[buttonIndex] = combinedState.controllers[controllerIndex].buttons[buttonIndex] || [];
                combinedState.controllers[controllerIndex].buttons[buttonIndex].push(states[stateKey].controllers[controllerIndex].buttons[buttonIndex]?1:-1);
            }
            for(axeIndex in states[stateKey].controllers[controllerIndex].axes) {
                combinedState.controllers[controllerIndex].axes[axeIndex] = combinedState.controllers[controllerIndex].axes[axeIndex] || [];
                combinedState.controllers[controllerIndex].axes[axeIndex].push(states[stateKey].controllers[controllerIndex].axes[axeIndex]);
            }
        }
    }
}

function arrayAverage(array) {
    var total = 0;
    for(var i = 0; i < array.length; i++) {
        total += array[i];
    }
    var avg = total / array.length;
    return avg;
}

function averageStates() {
    averageState = {};
    averageState.keys = {};
    averageState.controllers = {};
    for(keyIndex in combinedState.keys) {
        averageState.keys[keyIndex] = arrayAverage(combinedState.keys[keyIndex])>0;
    }
    
    for(controllerIndex in combinedState.controllers) {
        averageState.controllers[controllerIndex] = {};
        averageState.controllers[controllerIndex].buttons = {};
        for(buttonIndex in combinedState.controllers[controllerIndex].buttons) {
            averageState.controllers[controllerIndex].buttons[buttonIndex] = arrayAverage(combinedState.controllers[controllerIndex].buttons[buttonIndex]>0)
        }
        averageState.controllers[controllerIndex].axes = {};
        for(axeIndex in combinedState.controllers[controllerIndex].axes) {
            averageState.controllers[controllerIndex].axes[axeIndex] = arrayAverage(combinedState.controllers[controllerIndex].axes[axeIndex])
        }
    }
}

io.on('connection', (socket) => {
    states[socket.id] = {};
    let prefix = `[user@${socket.id}]`;
    console.log(`${prefix} Connected`);

    socket.on('inputs', (inputs, callback) => {
        states[socket.id] = inputs;
        combineStates();
        averageStates();
        callback({inputs: averageState});
    });

    socket.on('disconnect', () => {
        delete states[socket.id];
        console.log(`${prefix} Disconnected`);
    });
});

http.listen(port, () => {
    console.log(`listening on *:${port}`);
});
