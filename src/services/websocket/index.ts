import { SocketIOModule } from "./client/SocketIO";
import EndTranscription from "./controllers/EndTranscription";
import NewTranscription from "./controllers/NewTranscription";
import UpdateTranscription from "./controllers/UpdateTranscription";

const websocket = new SocketIOModule();

export { websocket, NewTranscription, UpdateTranscription, EndTranscription };