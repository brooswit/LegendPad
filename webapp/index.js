let untilDomReady = new Promise((resolve, reject) => {
    document.addEventListener('DOMContentLoaded', (event) => {
        resolve();
    });
});

const SAMPLE_RATE = 20;

const io = require('socket.io-client');
const gameController = require('gamecontroller.js');
const pointerLockPlus = require('pointer-lock-plus').default;

var socket = io();

var keys = {};
window.addEventListener("keydown",
    function(e){
        keys[e.key] = true;
    },
false);

window.addEventListener('keyup',
    function(e){
        keys[e.key] = false;
    },
false);

untilDomReady.then(()=>{
    sync();
    function sync() {
        pointerLockPlus({
            onAttain: ()=>{console.log("pointer atain")},
            onData: ()=>{console.log("pointer data")},
            onClose: ()=>{console.log("pointer close")},
            onRelease: ()=>{console.log("pointer release")},
            onError: ()=>{console.log("pointer error")},
        });

        let inputs = {};
        inputs.keys = keys;
        inputs.controllers = {};

        if (gameController.gamepads) {
            for(let gamepad of gameController.gamepads) {
                inputs.controllers[gamepad.id] = {};

                inputs.controllers[gamepad.id].buttons = {};
                for (let buttonId = 0; buttonId < gamepad.buttons; buttonId++) {
                    inputs.controllers[gamepad.id].buttons[buttonId] = gamepad.buttons[buttonId].pressed;
                }

                inputs.controllers[gamepad.id].axes = {};
                if (gamepad.axes) {
                    const modifier = gamepad.axes.length % 2; // Firefox hack: detects one additional axe
                    for (let x = 0; x < this.axes * 2; x++) {
                    inputs.controllers[gamepad.id].axes[x] = gamepad.axes[x + modifier].toFixed(4);
                    }
                }
            }
        }

        console.log(inputs);
        socket.emit('inputs', inputs, (res) => {
            console.log(res.inputs);
            sync();
            // setTimeout(sync, 1000 / SAMPLE_RATE);
        });
    }
});
