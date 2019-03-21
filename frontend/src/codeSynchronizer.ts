import Y from 'yjs'
import yArray from 'y-array'
import yMemory from 'y-memory'
// NOTE: we have to use our own yjsText because method binding the monaco editor is wrong
import yText from './yjsText'
import webSocketsClient from 'y-websockets-client'
import { editor as Editor } from 'monaco-editor/esm/vs/editor/editor.api'

// Yjs plugins
yMemory(Y)
yArray(Y)
yText(Y)
webSocketsClient(Y) // i imagine i need to require this too...
// will also need a connector here... not y-ipfs-connector, but something with socket.io

const io = Y['websockets-client'].io // need to get this.....

const link = 'http://localhost:3001'
// var link = "https://textarea-yjs-websockets-server.herokuapp.com/";

// create a connection
const connection = io(link) // need to include LINK within io()...

export const getSynchronizer = async () => {
  const synchronizer = await Y({
    db: {
      name: 'memory', // use the memory db adapter
    },
    connector: {
      name: 'websockets-client', // use the websockets-client connector
      room: 'Textarea-example-dev',
      socket: connection, // passing connection above as the socket...
      url: link, // the connection endpoint (see y-websockets-server)
    },
    share: {
      textarea: 'Text', // y.share.textarea is of type Y.Text
    },
  })

  // bind the textarea to a shared text element
  return synchronizer
}

export interface Synchronizer {
  share: {
    textarea: {
      bindMonaco: (editor: Editor.IStandaloneCodeEditor) => void;
    };
  }
}
