const socket = io();

socket.emit("SelectChannel", {
    channelId: "1141160655039250546"
});

socket.on("NewTranscription", (data) => {
    console.log(data);
});

socket.on("UpdateTranscription", (data) => {
    console.log(data);
});

socket.on("EndTranscription", (data) => {
    console.log(data);
});