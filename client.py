import socketio
import copy
import keyboard

inputs = {"keys": {}, "controllers": {}}

sio = socketio.Client()

def detectChange(key, handledKeys):
    if handledKeys[key]:
        return

    handledKeys[key] = True

    value = inputs.keys[key]
    previousValue = previousInputs.keys[key]
    if(previousValue != value):
        if(value == True):
            keyboard.press(key)
        else:
            keyboard.release(key)

@sio.event
def connect():
    print('connection established')
    print('my sid is', sio.sid)
    while True:
        print('loop')
        previousInputs = copy.deepcopy(inputs)
        inputs = sio.call('inputs', {})
        handledKeys = {}

        for key in range(len(previousInputs.keys)):
            detectChange(key, handledKeys)
        for key in range(len(inputs.keys)):
            detectChange(key, handledKeys)

@sio.event
def disconnect():
    print('disconnected from server')

sio.connect('https://legend-pad.herokuapp.com/')

sio.wait()
           
