import React, { useEffect, useRef, useState } from 'react';
import { Controlled as CodeMirror} from 'react-codemirror2'
import styled from 'styled-components';
import { JSHINT } from 'jshint';

import * as codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';
import 'codemirror/addon/lint/lint.css';
import 'codemirror/addon/scroll/simplescrollbars.css';
import { DownloadCloud, Settings } from 'react-feather';
import axios from 'axios';

const Container = styled.div`
  .react-codemirror2 {
    width: 100vw;
    height: 100vh;
  }
  .CodeMirror {
    width: 100%;
    height: 100%;
  }
  .bookmark {
    border-left: 1px solid red;
    box-sizing: border-box;
    position: absolute;
    color: #FFF0;
    transition: .2s;
    padding-left: 2px;
    &:hover {
      color: #FFF;
    }
  }
`;
const SettingsButton = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  cursor: pointer;
  svg {
    color: #d0d0d0aa;
    transition: .25s;
  }
  &:hover {
    svg {
      color: #d0d0d0;
    }
  }
`;
const ModalBackdrop = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #0005;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ModalContainer = styled.div`
  background-color: #272822;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 75%;
  height: 75%;
  border-radius: 1rem;
  padding: 2rem;
  box-sizing: border-box;
  color: #f8f8f2;
  font-family: monospace;
  gap: 1rem;
  h3 {
    margin: 0;
  }
  button {
    display: flex;
    align-items: center;
    font-family: inherit;
    color: inherit;
    cursor: pointer;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.5rem;
    background-color: #353531;
    &:hover {
      background-color: #3c3c38;
    }
  }
  input {
    display: flex;
    align-items: center;
    font-family: inherit;
    color: inherit;
    margin-top: 0.25rem;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.5rem;
    background-color: #353531;
    box-sizing: border-box;
    &:hover {
      background-color: #3c3c38;
    }
  }
  a {
    color: lightblue;
  }
`;

interface Client {
  id: number;
  name: string;
  pos: any;
}
interface TextChanges {
  toAdd: string;
  start: number;
  end: number;
  cmData: codemirror.EditorChange;
}

function findCharacterIndex(text: string, pos: codemirror.Position) {
  const lines = text.split('\n');
  let i = 0;

  for (let line = 0; line < pos.line; line++)
    i += lines[line].length + 1
  i += pos.ch;
  return i;
}

function getChanges(lastText: string, newText: string, data: codemirror.EditorChange): TextChanges {
  const start = findCharacterIndex(lastText, data.from);
  const end = findCharacterIndex(lastText, data.to);
  const toAdd = newText.substring(start, newText.length - (lastText.length - end));
  return { start, end, toAdd, cmData: data };
}

const wsServerUrl = process.env.NODE_ENV === 'development' ? 'ws://localhost:8080' : 'wss://api.henrixounez.com/henrixounez';
const serverUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : 'https://api.henrixounez.com/henrixounez';

interface InputProps {
  onBlur: (v: string) => void;
  defaultValue: string;
  style?: any;
}
function Input({ onBlur, defaultValue, style }: InputProps) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <input
      onChange={(e) => setValue(e.target.value)}
      onBlur={(e) => onBlur(e.target.value)}
      value={value}
      style={{...style}}
    />
  );
}

function Coding() {
  const [text, setText] = useState('/* Loading */');
  const [loaded, setLoaded] = useState(false);
  const [modal, setModal] = useState(false);

  const ws = useRef<WebSocket | null>(null);
  const editor = useRef<CodeMirror | null>(null);
  const reconnect = useRef<NodeJS.Timeout | null>(null);
  const messages = useRef<Array<{type: string, data: any}>>([]);

  const [_, setClients] = useState<Record<string, codemirror.TextMarker>>({});
  const [me, setMe] = useState<Client | null>(null);
  const [filename, setFilename] = useState('index.js');
  const sessionId = useRef<string | null>(null);

  const download = () => {
    const el = document.createElement('a');
    el.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    el.setAttribute('download', filename);
    el.style.display = 'none';
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
  };

  const sendToWs = (type: string, data: any) => {
    messages.current.push({ type, data });
  };

  const clearBookmark = () => {
    setClients((clients) => {
      Object.keys(clients).forEach((e: string) => {
        clients[e].clear();
      });
      return {};
    });
  };

  const createBookmark = (cursorPos: codemirror.Position, id: number, name: string) => {
    if (editor.current) {
      setClients((clients) => {
        if (clients[id]) {
          clients[id].clear();
          delete clients[id];
        }
        return clients;
      })
      const cm = (editor.current as any).editor as codemirror.Editor;
      const cursorCoords = cm.cursorCoords(cursorPos);
      const cursorElement = document.createElement('span');
      cursorElement.style.height = `${(cursorCoords.bottom - cursorCoords.top)}px`;
      cursorElement.style.borderLeftColor = `hsl(${id * 33 % 360}deg 100% 50%)`
      cursorElement.innerHTML = name;
      cursorElement.className = "bookmark";
      const marker = cm.setBookmark(cursorPos, { widget: cursorElement });
      setClients((clients) => ({ ...clients, [id]: marker }));
    }
  }

  const disconnect = (shouldReconnect: boolean) => {
    setMe(null);
    if (ws.current && !shouldReconnect) {
      ws.current.onclose = null;
      ws.current.onerror = null;
    }
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
    if (shouldReconnect && !reconnect.current) {
      reconnect.current = setTimeout(() => {
        console.info('[WS] Trying to reconnect');
        reconnect.current = null;
        connect();
      }, 3000);
    } else if(!shouldReconnect && reconnect.current) {
      clearTimeout(reconnect.current);
      reconnect.current = null;
    }
  }

  const connect = () => {
    ws.current = new WebSocket(`${wsServerUrl}/coding/connect/${sessionId.current ? `?sessionId=${sessionId.current}` : ''}`);
    ws.current.onopen = (_mess) => {
      console.info('[WS] Open');
    };
    ws.current.onmessage = (mess) => {
      const { type, data } = JSON.parse(mess.data);
      console.info('[WS] Message received', type, data);
      switch (type) {
        case "init":
          if (data.sessionId !== "default")
            sessionId.current = data.sessionId;
          setText(data.text);
          setMe(data.me);
          clearBookmark();
          data.clients.forEach((c: any) => createBookmark(c.pos, c.uuid, c.name));
          break;
        case "change":
          if (editor.current) {
            // @ts-expect-error
            const doc = editor.current.editor.getDoc();
            const { text, from, to } = data.cmData;
            doc.replaceRange(text.join('\n'), from, to, "@ignore");
          }
          break;
        case "nameChange":
        case "cursorMove":
          createBookmark(data.pos, data.uuid, data.name);
          break;
        case "removeClient":
          setClients((clients) => {
            if (clients[data.uuid]) {
              clients[data.uuid].clear();
              delete clients[data.uuid];
            }
            return clients;
          })
        case "ping":
          break;
        default:
          console.error("Unknown message type", type);
      }
    };
    ws.current.onerror = (err) => {
      disconnect(true);
      console.info('[WS] Error', err);
    };
    ws.current.onclose = () => {
      console.info('[WS] OnClose');
      disconnect(true);
    }
  }

  useEffect(() => {
    if (navigator) {
      const params = new URLSearchParams(window.location.search);
      const paramsSessionId = params.get('sessionId');

      if (paramsSessionId)
        sessionId.current = paramsSessionId;

      require('codemirror/mode/javascript/javascript');
      require('codemirror/addon/lint/lint');
      require('codemirror/addon/lint/javascript-lint');
      require('codemirror/addon/scroll/simplescrollbars');

      (window as any).JSHINT = JSHINT;
      setLoaded(true);
      connect();
      const interval = setInterval(() => {
        for (let _ in messages.current) {
          if (ws.current && ws.current.readyState === ws.current.OPEN) {
            ws.current.send(JSON.stringify(messages.current[0]));
            messages.current.splice(0, 1);
          }
        }
      }, 50);  
      return () => {
        clearInterval(interval);
        disconnect(false);
      }
    }
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <style jsx global>{`
        body {
          margin: 0px;
          padding: 0px;
        }
      `}</style>
      {loaded && (
        <Container>
          <CodeMirror
            ref={editor}
            value={text}
            options={{
              // @ts-expect-error
              scrollbarStyle: 'overlay',
              mode: 'javascript',
              theme: 'monokai',
              lineNumbers: true,
              gutters: ["CodeMirror-lint-markers"],
              lint: true,
            }}
            onCursor={(_editor, data) => {
              console.log('my cursor is moving jpp', data);
              sendToWs("cursorMove", data);
            }}
            onBeforeChange={(_editor, data, value) => {
              setText(value);
              if (data.origin !== "@ignore")
                sendToWs("change", getChanges(text, value, data))
            }}
          />
        </Container>
      )}
      <SettingsButton onClick={() => setModal(!modal)}>
        <Settings />
      </SettingsButton>
      {modal && (
        <ModalBackdrop onClick={() => setModal(!modal)}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <h3><b>Settings</b></h3>
            <div>
              File name:
              <Input
                onBlur={(s) => {
                  setFilename(s);
                }}
                defaultValue={filename}
              />
            </div>
            <div>
              Username:
              <Input
                onBlur={(s) => {
                  sendToWs("nameChange", s);
                  setMe((me) => me ? ({...me, name: s}) : null );
                }}
                defaultValue={me ? me.name : "Not connected"}
              />
            </div>
            <button onClick={download}>
              Download <DownloadCloud/>
            </button>
            <button onClick={async () => {
              try {
                const res = await axios.post(`${serverUrl}/coding/create`);
                sessionId.current = res.data.sessionId;
                const newUrl = `${window.location.origin}/coding/${sessionId.current ? `?sessionId=${sessionId.current}` : ''}`;
                window.history.pushState({ path: newUrl }, '', newUrl);
                disconnect(false);
                setTimeout(() => {
                  connect();
                }, 1000);
              } catch (err) {
                console.error(err);
              }
            }}>
              Create session
            </button>
            <div style={{width: "100%"}}>
              Session invite link:&nbsp;
              <a rel="noreferrer noopener" target="_blank" href={`${window.location.origin}/coding/${sessionId.current ? `?sessionId=${sessionId.current}` : ''}`}>
                {`${window.location.origin}/coding/${sessionId.current ? `?sessionId=${sessionId.current}` : ''}`}
              </a>
            </div>
          </ModalContainer>
        </ModalBackdrop>
      )}
    </div>
  );
};

export default Coding;