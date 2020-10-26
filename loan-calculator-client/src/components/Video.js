import React, { Component } from 'react'
import firebase from '../scripts/firebase.js';
import { ContextAPI } from './Context.js';
import '../css/Video.css';


/**
Brute Force Solution:
1. allow admin to generate a video room id.
2. send this id over to the caller for them to join it.

Note: limit the ability to generate video room ids to admins only.

*/



const configuration = {
  iceServers: [
    {
      urls: [
        'stun:stun1.l.google.com:19302',
        'stun:stun2.l.google.com:19302',
      ],
    },
  ],
  iceCandidatePoolSize: 10,
}
let peerConnection = null;
let localStream = null;
let remoteStream = null;

class Video extends Component {
    static contextType = ContextAPI
    constructor(props) {
        super(props)
        this.state = {
            roomId: "",
            exampleRoom: "WilliamRoom",
            createRoomBtn_visible: false,
            hangupBtn_visible: false,
            roomInput_visible: false,
            videoScreen_visible: false
        }
        this.joinRoomById = this.joinRoomById.bind(this)
        this.createRoom = this.createRoom.bind(this)
    }


    render() {
        return (
            <div style={{'marginTop': "60px"}}>
                <button id="cameraBtn" onClick={this.openUserMedia.bind(this)}>Open Camera & Microphone</button> 
                <br />
                {this.context.isAdmin && this.state.createRoomBtn_visible && <button id="createRoomBtn" onClick={this.createRoom}>Create Room</button>}
                <br />
                {this.state.hangupBtn_visible && <button id="hangupBtn" onClick={this.hangUp.bind(this)}>HangUp</button>}
                <br />
                {this.state.roomInput_visible && !this.context.isAdmin &&
                    <div>
                        <input name="roomId"
                               value={this.state.roomId} 
                               onChange={this.handleChange.bind(this)}>
                        </input>
                        <button id="joinBtn" onClick={()=>this.joinRoomById(this.state.roomId)}>Join Room</button>
                        </div>
                }
                {this.state.videoScreen_visible &&
                    <div id="videos">
                        <video id="localVideo" muted autoPlay playsInline></video>
                        <video id="remoteVideo" autoPlay playsInline></video>
                    </div>
                }
            </div>
        )
    }
    componentDidMount() {
        //console.log("isAdmin: ", this.context.isAdmin)

        //set the create room button to be disabled
        //document.querySelector('#createRoomBtn').disabled = true;

        //set the hangup button to be disabled
        //document.querySelector('#hangupBtn').disabled = true;
        
        //set the join room to be disabled
        //document.querySelector('#joinBtn').disabled = true;
    }
    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value })
    }
    openUserMedia(event) {
        //reveal the screens
        this.setState({videoScreen_visible: true, createRoomBtn_visible: true, roomInput_visible: true}, async function() {
            const stream = await navigator.mediaDevices.getUserMedia(
            {video: true, audio: true});
            document.querySelector('#localVideo').srcObject = stream;
            localStream = stream;
            remoteStream = new MediaStream();
            document.querySelector('#remoteVideo').srcObject = remoteStream;
            console.log('Stream:', document.querySelector('#localVideo').srcObject);           
        })
    }
    //This function will create a document, specified by the roomId field passed
    async createRoom() {
        // Step 1: Initialize the Core Video-Room Database Reference
        const db = firebase.firestore();
        const roomRef = await db.collection('video-rooms').doc();

        console.log('Create PeerConnection with configuration: ', configuration);

        //Step 2: Initialize our peer connection
        peerConnection = new RTCPeerConnection(configuration);

        //Step 3: Functionality to add tracks to the Local Stream
        localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream)
        })

        //Step 4: Functionality to collect ICE candidates:
        const callerCandidatesCollection = roomRef.collection('callerCandidates');
        peerConnection.addEventListener('icecandidate', event => {
            if (!event.candidate) {
                console.log('Got final candidate!');
                return;
            }
            console.log('Got candidate: ', event.candidate);
            //auto generate an id for each document added
            callerCandidatesCollection.add(event.candidate.toJSON());
        });

        //Step 5: Functionality to create a room:
        const offer = await peerConnection.createOffer()
        await peerConnection.setLocalDescription(offer)
        console.log('Created offer:', offer)

        const roomWithOffer = {
            'offer': {
                type: offer.type,
                sdp: offer.sdp,
            }
        }
        await roomRef.set(roomWithOffer);

        //update the admin user with their own private room channel
        let user = firebase.auth().currentUser
        if (user) {
            let adminUsersRef = await db.collection('admin-users').doc(user.uid)

            //Update 
            adminUsersRef.update({
                "admin_video_room": roomRef.id
            })
            .then(() => {
                this.setState({roomId: roomRef.id}, async function() {
                    console.log(`New room created with SDP offer. Room ID: ${roomRef.id}`);

                    //Send this room as a message over to the other user to join
                    adminUsersRef.get().then((doc) => {
                        if (doc.exists) {
                            let messagesRef = db.collection('chat-rooms')
                                                .doc(doc.data().admin_room_location)
                                                .collection('messages')
                                                .doc()
                            messagesRef.set({
                                "sender_name": doc.data().admin_name,
                                "message": `Copy and paste my room: ${roomRef.id}`,
                                "uid": user.uid,
                                "timestamp": firebase.firestore.FieldValue.serverTimestamp()
                            })
                        } else {
                            console.log("no such document")
                        }
                    }).catch((err) => console.log(err))
                })                
            })
            .catch((err) => console.log(err))
        }
        

        //Step 6: Functionality to add tracks to the Remote Stream
        peerConnection.addEventListener('track', event => {
            console.log('Got remote track:', event.streams[0])
            event.streams[0].getTracks().forEach(track => {
                console.log('Add a track to the remoteStream:', track)
                remoteStream.addTrack(track)
            });
        });

        //Step 7: Functionality to Listen for Remote Session Description
        roomRef.onSnapshot(async snapshot => {
            const data = snapshot.data();
            if (!peerConnection.currentRemoteDescription && data && data.answer) {
                console.log('Got remote description: ', data.answer)
                const rtcSessionDescription = new RTCSessionDescription(data.answer)
                await peerConnection.setRemoteDescription(rtcSessionDescription)
            }
        })

        //Step 8: Functionality to Listen for remote ICE candidates below
        roomRef.collection('calleeCandidates').onSnapshot(snapshot => {
            snapshot.docChanges().forEach(async change => {
                if (change.type === 'added') {
                    let data = change.doc.data()
                    console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`)
                    await peerConnection.addIceCandidate(new RTCIceCandidate(data))
                }
            })
        })
    }

    async joinRoomById(roomId) {
        const db = firebase.firestore();
        const roomRef = db.collection('video-rooms').doc(`${roomId}`);
        const roomSnapshot = await roomRef.get();
        console.log('Got room:', roomSnapshot.exists);

        if (roomSnapshot.exists) {
            console.log('Create PeerConnection with configuration: ', configuration)
            peerConnection = new RTCPeerConnection(configuration)
            localStream.getTracks().forEach(track => {
                peerConnection.addTrack(track, localStream)
            })

            //Step 1: Functionality to collect ICE candidates
            const calleeCandidatesCollection = roomRef.collection('calleeCandidates');
            peerConnection.addEventListener('icecandidate', event => {
                if (!event.candidate) {
                    console.log('Got final candidate!');
                    return;
                }
                console.log('Got candidate: ', event.candidate);
                calleeCandidatesCollection.add(event.candidate.toJSON());
            });

            //Step 2: Functionality to add track to the Remote Stream
            peerConnection.addEventListener('track', event => {
                console.log('Got remote track:', event.streams[0])
                event.streams[0].getTracks().forEach(track => {
                    console.log('Add a track to the remoteStream:', track)
                    remoteStream.addTrack(track)
                })
            })

            //Step 3: Functionality to create SDP answer
            const offer = roomSnapshot.data().offer
            console.log('Got offer:', offer)
            await peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
            const answer = await peerConnection.createAnswer()
            console.log('Created answer:', answer)
            await peerConnection.setLocalDescription(answer)

            const roomWithAnswer = {
                answer: {
                    type: answer.type,
                    sdp: answer.sdp,
                }
            }
            await roomRef.update(roomWithAnswer)

            //Step 4: Functionality to Listen for remote ICE candidates
            roomRef.collection('callerCandidates').onSnapshot(snapshot => {
                snapshot.docChanges().forEach(async change => {
                    if (change.type === 'added') {
                        let data = change.doc.data()
                        console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`)
                        await peerConnection.addIceCandidate(new RTCIceCandidate(data))
                    }
                })
            })                
        }
    }

    async hangUp(event) {
        //Step 1: Stop streaming yourself
        const tracks = document.querySelector('#localVideo').srcObject.getTracks();
            tracks.forEach(track => {
            track.stop();
        });

        //Step 2: Stop the Remote Stream("your partner")
        if (remoteStream) {
            remoteStream.getTracks().forEach(track => track.stop());
        }

        //Step 3: Close the Peer Connection
        if (peerConnection) {
            peerConnection.close();
        }

        //Step 4: Functionality to delete the room in the database
        if (this.state.roomId !== "") {
            const db = firebase.firestore();
            const roomRef = db.collection('video-rooms').doc(this.state.roomId);
            //Step 4a: Remove the Callee Candidates Collection
            const calleeCandidates = await roomRef.collection('calleeCandidates').get();
            calleeCandidates.forEach(async candidate => {
                await candidate.ref.delete();
                //Step 4a: Reset the roomId state to be an empty string(sychronous)
                this.setState({roomId: ""});
            });
            //Step 4b: Remove the Caller Candidates Collection
            const callerCandidates = await roomRef.collection('callerCandidates').get();
            callerCandidates.forEach(async candidate => {
                await candidate.ref.delete();
            });
            //Step 4c: Finally Delete the Actual Room queried by roomId
            await roomRef.delete();
            document.querySelector('#cameraBtn').disabled = false;
            document.querySelector('#joinBtn').disabled = true;
            document.querySelector('#createRoomBtn').disabled = true;
            document.querySelector('#hangupBtn').disabled = true;
            
            
        }
    }
}

export default Video