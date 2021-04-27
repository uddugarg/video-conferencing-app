const socket = io('/');                     //A new Socket instance is returned for the namespace specified by the pathname in the URL, defaulting to /. 

const videoGrid = document.getElementById('video-grid');        //getting html element using id

const myPeer = new Peer(undefined, {                    //Creating a new peer connection at port 3001 as it is locally running on the same port
    host: '/',
    port: '3001'
})

const myVideo = document.createElement('video');        //creating a new video element for adding the stream of the user
myVideo.muted = true;

navigator.mediaDevices.getUserMedia({                   // provides information about the web browser and its capabilities
    video: true,
    audio: true,
}).then(stream => {
    addVideoStream(myVideo, stream);                    //function which add video stream to the frontend

    socket.on('user-connected', userId => {             //listening to the event when new user is connected to the room
        connectToNewUser(userId, stream);               //function which connects new user to the room with its WebRTC connections
    })

    myPeer.on('call', call => {                         //listening to a peer connection that whenever call is answered stream is render to the room
        call.answer(stream);
    })
})

myPeer.on('open', id => {                               //listening to a peer connection whenever someone joins the room
    socket.emit('join-room', ROOM_ID, id);              //creating a event which return the userId with the roomId of the joined room
})

function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream);
    const video = document.createElement('video');

    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    })
    call.on('close', () => {
        video.remove();
    })
}

function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    });
    videoGrid.append(video);
}

