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
    for(state of states) {
        for(keyIndex in state.keys) {
            combinedState.keys[keyIndex] = combinedState.keys[keyIndex] || [];
            combinedState.keys[keyIndex].push(state.keys[keyIndex]);
        }
        
        for(controllerIndex in state.controllers) {
            combinedState.controllers[controllerIndex] = combinedState.controllers[controllerIndex] || {};
            combinedState.controllers[controllerIndex].buttons = combinedState.controllers[controllerIndex].buttons || {};
            combinedState.controllers[controllerIndex].axes = combinedState.controllers[controllerIndex].axes || {};
            for(buttonIndex in state.controllers[controllerIndex].buttons) {
                combinedState.controllers[controllerIndex].buttons[buttonIndex] = combinedState.controllers[controllerIndex].buttons[buttonIndex] || [];
                combinedState.controllers[controllerIndex].buttons[buttonIndex].push(state.controllers[controllerIndex].buttons[buttonIndex]);
            }
            for(axeIndex in state.controllers[controllerIndex].axes) {
                combinedState.controllers[controllerIndex].axes[axeIndex] = combinedState.controllers[controllerIndex].axes[axeIndex] || [];
                combinedState.controllers[controllerIndex].axes[axeIndex].push(state.controllers[controllerIndex].axes[axeIndex]);
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
    for(keyIndex in combinedStates.keys) {
        averageState.keys[keyIndex] = arrayAverage(combinedStates.keys[keyIndex]);
    }
    
    for(controllerIndex in combinedStates.controllers) {
        averageState.controllers[controllerIndex] = {};
        averageState.controllers[controllerIndex].buttons = {};
        for(buttonIndex in combinedStates.controllers[controllerIndex].buttons) {
            averageState.controllers[controllerIndex].buttons[buttonIndex] = arrayAverage(combinedStates.controllers[controllerIndex].buttons[buttonIndex])
        }
        averageState.controllers[controllerIndex].axes = {};
        for(axeIndex in combinedStates.controllers[controllerIndex].axes) {
            averageState.controllers[controllerIndex].axes[axeIndex] = arrayAverage(combinedStates.controllers[controllerIndex].axes[axeIndex])
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
