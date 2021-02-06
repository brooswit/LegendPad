import socketio
import copy
import keyboard
import mouse
import ldclient
from ldclient.config import Config


ldclient.set_config(Config("sdk-02a4ada0-6c78-4d7a-9afe-03b858d5b62e"))
ld = ldclient.get()


sio = socketio.Client()


def detectChange(key, previousValue, value, handledKeys, unknownKeys, preventedKeys):
    translations = {
        "ArrowRight": "right",
        "ArrowLeft": "left",
        "ArrowUp": "up",
        "ArrowDown": "down"
    }

    if key in translations:
        key = translations[key]

    if key in handledKeys and handledKeys[key] == True:
        return
    handledKeys[key] = True
    if not ld.variation("allow-input", {"key": "unidentified", "custom":{"keyboard": key}}, False):
        if key in preventedKeys and preventedKeys[key] == True:
            return
        preventedKeys[key] = True
        print('prevented key: ', key)
        return
    try:
        if(previousValue != value):
            keyboard.send(key, value, not value)
    except ValueError:
        if key in unknownKeys and unknownKeys[key] == True:
            return
        unknownKeys[key] = True
        print('unknown key: ', key)


@sio.event
def connect_error():
    print("The connection failed!")


@sio.event
def connect():
    print('connected!')
    currentInputs = {"inputs": {"keys": {}, "controllers": {}}}
    unknownKeys = {}
    preventedKeys = {}
    while True:
        handledKeys = {}
        previousInputs = copy.deepcopy(currentInputs)
        currentInputs = sio.call('inputs', {})
        for key in previousInputs["inputs"]["keys"]:
            previousValue = key in previousInputs["inputs"]["keys"] and previousInputs["inputs"]["keys"][key]
            currentValue =  key in currentInputs["inputs"]["keys"] and currentInputs["inputs"]["keys"][key]
            detectChange(key, previousValue, currentValue, handledKeys, unknownKeys, preventedKeys)
        for key in currentInputs["inputs"]["keys"]:
            previousValue = key in previousInputs["inputs"]["keys"] and previousInputs["inputs"]["keys"][key]
            currentValue =  key in currentInputs["inputs"]["keys"] and currentInputs["inputs"]["keys"][key]
            detectChange(key, previousValue, currentValue, handledKeys, unknownKeys, preventedKeys)
        
        mouse.move(currentInputs['mouse']['x'], currentInputs['mouse']['y'], absolute=False, duration=0.1, steps_per_second=120.0)


@sio.event
def disconnect():
    print('disconnected from server')


sio.connect('https://legend-pad.herokuapp.com')
sio.wait()
