import Y from 'yjs'
import minimist from 'minimist'
import yMemory from 'y-memory'
import yWebSockets from 'y-websockets-server'
import socketIo from 'socket.io'
import { Server } from 'http'

export default (server: Server) => {
  // TODO: move to state
  const global: any = {}

  yMemory(Y)
  yWebSockets(Y)

  const options = minimist(process.argv.slice(2), {
    string: ['port', 'debug', 'db'],
    default: {
      port: process.env.PORT || '1234',
      debug: false,
      db: 'memory',
    },
  })

  const io = socketIo(server, { origins: '*:*' })
  console.log('Initialized websockets')

  global.yInstances = {}

  function getInstanceOfY(room: any) {
    if (global.yInstances[room] == null) {
      global.yInstances[room] = Y({
        db: {
          name: options.db,
          dir: 'y-leveldb-databases',
          namespace: room,
        },
        connector: {
          name: 'websockets-server',
          room,
          io,
          debug: !!options.debug,
        },
        share: {},
      })
    }
    return global.yInstances[room]
  }

  io.on('connection', (socket: any) => {
    const rooms: any = []
    socket.on('joinRoom', (room: any) => {
      console.log('User "%s" joins room "%s"', socket.id, room)
      socket.join(room)
      getInstanceOfY(room).then((y: any) => {
        global.y = y // TODO: remove !!!
        if (rooms.indexOf(room) === -1) {
          y.connector.userJoined(socket.id, 'slave')
          rooms.push(room)
        }
      })
    })
    socket.on('yjsEvent', (msg: any) => {
      if (msg.room != null) {
        getInstanceOfY(msg.room).then((y: any) => {
          y.connector.receiveMessage(socket.id, msg)
        })
      }
    })
    socket.on('disconnect', () => {
      for (const room of rooms) {
        getInstanceOfY(room).then((y: any) => {
          const i = rooms.indexOf(room)
          if (i >= 0) {
            y.connector.userLeft(socket.id)
            rooms.splice(i, 1)
          }
        })
      }
    })
    socket.on('leaveRoom', (room: any) => {
      getInstanceOfY(room).then((y: any) => {
        const i = rooms.indexOf(room)
        if (i >= 0) {
          y.connector.userLeft(socket.id)
          rooms.splice(i, 1)
        }
      })
    })
  })
}
