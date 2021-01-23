const SAMPLE_RATE = 20;

const io = require('socket.io-client');
const gameController = require('gamecontroller.js');


var socket = io();

setTimeout(()=>{
    let state = {};
    state.controllers = {};

    if (gameController.gamepads) {
        for(let gamepad of gameController.gamepads) {
            state.controllers[gamepad.id] = {};

            state.controllers[gamepad.id].buttons = {};
            for (let buttonId = 0; buttonId < gamepad.buttons; buttonId++) {
                state.controllers[gamepad.id].buttons[buttonId] = gamepad.buttons[buttonId].pressed;
            }

            state.controllers[gamepad.id].axes = {};
            if (gamepad.axes) {
                const modifier = gamepad.axes.length % 2; // Firefox hack: detects one additional axe
                for (let x = 0; x < this.axes * 2; x++) {
                state.controllers[gamepad.id].axes[x] = gamepad.axes[x + modifier].toFixed(4);
                }
            }
        }
    }

    console.log(state);
}, 1000 / SAMPLE_RATE);

window.addEventListener("gamepadconnected", function(e) {
  console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
    e.gamepad.index, e.gamepad.id,
    e.gamepad.buttons.length, e.gamepad.axes.length);
});
