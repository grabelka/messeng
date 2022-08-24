const ws = require('ws');

const wss = new ws.Server({
  port: 5000,
}, () => console.log(`Server started on 5000`))

let rooms = {}

wss.on('connection', function connection(ws) {
  ws.id = Date.now()
  const id = Date.now()
  ws.on('message', function (message) {
  message = JSON.parse(message)
  switch (message.event) {
    case 'message':
      broadcastMessage(message)
      break;
    case 'connection':
      join(message.room, id)
      broadcastMessage(message)
      break;
    case 'disconnection':
      console.log('disconnection')
      rooms[message.room].filter(i => i==id)
      broadcastMessage(message)
      break;
    }
  })
})

function join(name, id) {
  if (!rooms[name]) {
    rooms[name] = []
  }

  rooms[name].push(id)
}

function broadcastMessage(message) {
  wss.clients.forEach(client => {
    console.log(rooms)
    if (rooms[message.room].includes(client.id)) {
      client.send(JSON.stringify(message))
    }
  })
}
