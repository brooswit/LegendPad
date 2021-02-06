var havePointerLock = 'pointerLockElement' in document ||
    'mozPointerLockElement' in document ||
    'webkitPointerLockElement' in document;

document.body.requestPointerLock = element.requestPointerLock ||
			     element.mozRequestPointerLock ||
			     element.webkitRequestPointerLock;
// Ask the browser to lock the pointer
// document.body.requestPointerLock();

// Ask the browser to release the pointer
document.exitPointerLock = document.exitPointerLock ||
			   document.mozExitPointerLock ||
			   document.webkitExitPointerLock;
// document.exitPointerLock();

const SAMPLE_RATE = 20;

const io = require('socket.io-client');
const gameController = require('gamecontroller.js');

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

sync();
function sync() {
    document.body.requestPointerLock();
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

window.addEventListener("gamepadconnected", function(e) {
  console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
    e.gamepad.index, e.gamepad.id,
    e.gamepad.buttons.length, e.gamepad.axes.length);
});
