# LegendPad
This software was inspired by the "Twitch plays X" concept. Instead of parsing Twitch chat, I wanted to agregate actual controller inputs from all viewers, and send the average of all analog inputs and set the state of all non-analong buttons to whatever the majority of clients are pressing


This software consists of 3 primary components:
- A JS/Vue web client which receives inputs, and delivers them to the server via a streaming connection.
- A NodeJS server which receives the streaming connection, and delivers the agregated input updates to connected clients. Also hosts web server to serve JS/Vue client
- A Python client which opens the streaming connection, and sends the agregated inputs it receives to the local system.

# Getting started
## Development
### Setup
Install NodeJS dependencies

```
npm i
```
### Develop
Run a development server locally and automatically rebuild everything when there are changes

```
npm dev
```

### Build
```
npm build
```

# Web Client
When you load the website, you are prompted for which room you want to join.

Joining a room simply redirects you from `/#/` to `/#/ROOM_NAME`

Loading a room shows a table indicating the state of all buttons, and accepts & sends inputs via streaming connection

# NodeJS
Hosts two interfaces:
- Static file server
- Websocket interface

Host on heroku with one-click deploy so others can set up their own easily.

# Python Client
Connects to stream, sends outputs. EZ

https://pythonprogramming.net/direct-input-game-python-plays-gta-v/?completed=/open-cv-basics-python-plays-gta-v/
