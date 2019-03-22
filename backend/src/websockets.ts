import Y from 'yjs'
import yMemory from 'y-memory'
import yWebSockets from 'y-websockets-server'
import socketIo from 'socket.io'
import { Server } from 'http'

// we need to store yjs instance which is not a plain object.
// Because of this, we are keepingg it outside of our store
interface YInstances {
  [key: string]: any
}

const yInstances: YInstances = {}

export default (server: Server) => {
  yMemory(Y)
  yWebSockets(Y)
  const io = socketIo(server, { origins: '*:*' })

  async function createInstanceOfY(room: string) {
    yInstances[room] = await Y({
      db: {
        name: 'memory',
        dir: 'y-leveldb-databases',
        namespace: room,
      },
      connector: {
        name: 'websockets-server',
        room,
        io,
        debug: false,
      },
      share: {},
    })
  }

  async function getOrCreateInstanceOfY(room: string) {
    if (yInstances[room] == null) await createInstanceOfY(room)
    return yInstances[room]
  }

  io.on('connection', (socket) => {
    const rooms: any = []
    socket.on('joinRoom', async (room: string) => {
      console.log('User "%s" joins room "%s"', socket.id, room)
      socket.join(room)
      const yInstance = await getOrCreateInstanceOfY(room)
      if (rooms.indexOf(room) === -1) {
        yInstance.connector.userJoined(socket.id, 'slave')
        rooms.push(room)
      }
    })
    socket.on('yjsEvent', async (msg: { room: string }) => {
      if (msg.room != null) {
        const yInstance = await getOrCreateInstanceOfY(msg.room)
        yInstance.connector.receiveMessage(socket.id, msg)
      }
    })
    socket.on('disconnect', async () => {
      for (const room of rooms) {
        const yInstance = await getOrCreateInstanceOfY(room)
        const i = rooms.indexOf(room)
        if (i >= 0) {
          yInstance.connector.userLeft(socket.id)
          rooms.splice(i, 1)
        }
      }
    })
    socket.on('leaveRoom', async (room: string) => {
      const yInstance = await getOrCreateInstanceOfY(room)
      const i = rooms.indexOf(room)
      if (i >= 0) {
        yInstance.connector.userLeft(socket.id)
        rooms.splice(i, 1)
      }
    })
  })

  console.log('Successfully initialized websockets')
}
