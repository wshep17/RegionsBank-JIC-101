import React, { Component } from 'react'
import firebase from '../scripts/firebase.js';
import Chat from './Chat.js'
import { ContextAPI } from './Context.js';
import '../css/Video.css';
import { Button } from 'antd';
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';
import { Layout, Card, Dropdown, Tag } from 'antd';
import { PhoneTwoTone,
         ArrowLeftOutlined,
         ArrowRightOutlined,
         CloseCircleTwoTone,
         CheckCircleTwoTone,
         CameraTwoTone,
         PlusCircleTwoTone,
         VideoCameraTwoTone,
         TeamOutlined
        } from '@ant-design/icons';


const { Header, Footer, Sider, Content } = Layout;

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

class MediaPortal extends Component {
    static contextType = ContextAPI
    constructor(props) {
        super(props)
        this.state = {
            roomId: "",
            exampleRoom: "WilliamRoom",
            createRoomBtn_visible: false,
            hangupBtn_visible: true,
            roomInput_visible: false,
            videoScreen_visible: false,
            menuOpen: false,
            sound: true,
            video: true,
            mediaActivated: false //camera & mic must be properly setup before user create/join room
        }
        this.localVideo = React.createRef()
        this.remoteVideo = React.createRef()
        this.joinRoomById = this.joinRoomById.bind(this)
        this.createRoom = this.createRoom.bind(this)
        this.toggleControls = this.toggleControls.bind(this)
        this.toggleSound = this.toggleSound.bind(this)
        this.toggleVideo = this.toggleVideo.bind(this)
        this.hangUp = this.hangUp.bind(this)
    }


    render() {
        return (
                <Layout className="media-portal">
                  <Layout>
                    <Sider width={350} className="controller-interface">
                        <div id={this.state.menuOpen ? "controlsToggleDivOpen" : "controlsToggleDivClosed"}>
                            <Button id="controlToggleBtn"
                                    icon={this.state.menuOpen ? <ArrowRightOutlined /> : <ArrowLeftOutlined />}
                                    onClick={this.toggleControls}
                                    type="primary">Controls
                            </Button>
                        </div>
                        <div className={this.state.menuOpen ? "controllersDivOpen" : "controllersDivClosed"}>
                            <div className="contollerBtn">
                                <Card title="Activate Camera & Mic"
                                      bordered={true}
                                      hoverable={true}
                                      id="cameraBtn"
                                      onClick={this.openUserMedia.bind(this)}><CameraTwoTone twoToneColor="#FFA500" id="cameraTwoTone"/>
                                </Card>
                            </div>
                            {
                                !this.context.isAdmin && this.state.createRoomBtn_visible && this.state.mediaActivated &&
                                <div className="contollerBtn">
                                    <Card title="Join Room"
                                          hoverable={true}
                                          bordered={true}
                                          id="joinRoomBtn"
                                          onClick={this.joinRoomById}><TeamOutlined id="teamOutlined" />
                                    </Card>
                                </div>
                            }
                            {
                                this.context.isAdmin && this.state.createRoomBtn_visible && this.state.mediaActivated &&
                                <div className="contollerBtn">
                                    <Card title="Create Room"
                                          hoverable={true}
                                          bordered={true}
                                          id="createRoomBtn"
                                          onClick={this.createRoom}><PlusCircleTwoTone twoToneColor="#20B2AA" id="plusCircleTwoTone" />
                                    </Card>
                                </div>
                            }
                            {
                                this.state.createRoomBtn_visible && this.state.mediaActivated &&
                                <div className="contollerBtn">
                                    <Card title="Toggle Video"
                                          hoverable={true}
                                          bordered={true}
                                          id="toggleVideoBtn"
                                          onClick={this.toggleVideo}><VideoCameraTwoTone twoToneColor="#708090" id="videoCameraTwoTone" />
                                    </Card>
                                </div>
                            }
                            {
                                this.state.createRoomBtn_visible && this.state.mediaActivated &&
                                <div className="contollerBtn">
                                    <Card title="Toggle Sound"
                                          hoverable={true}
                                          bordered={true}
                                          id="toggleSoundBtn"
                                          onClick={this.toggleSound}>
                                          {
                                            this.state.sound ? 
                                            <CloseCircleTwoTone twoToneColor="#DC143C" id="soundTwoTone" />
                                            :
                                            <CheckCircleTwoTone twoToneColor="#32CD32" id="soundTwoTone" />
                                          }
                                    </Card>
                                </div>
                            }
                        </div>
                    </Sider>
                    <Content className="video">
                        <Card className="video-interface-card">
                            {this.state.videoScreen_visible &&
                                <div>
                                    <video id="remoteVideo" ref={this.remoteVideo} autoPlay/>
                                    <video id="localVideo" ref={this.localVideo} muted autoPlay/>
                                    {
                                        this.state.hangupBtn_visible && 
                                        <Button id="hangupBtn"
                                                icon={<PhoneTwoTone twoToneColor="#ff0000"/>}
                                                size='medium'
                                                onClick={this.hangUp.bind(this)}> End Call 
                                        </Button>
                                    }
                                </div>
                            }
                        </Card>
                    </Content>
                    <Sider width={350} className="chat-interface"><Chat /></Sider>
                  </Layout>
                  <Footer className="footer"></Footer>
                </Layout>
        )
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value })
    }
    toggleControls() {
        this.setState((state) => ({
            menuOpen: !state.menuOpen
        }))
    }
    openUserMedia(event) {
        //reveal the screens
        this.setState({mediaActivated:false, videoScreen_visible: true, createRoomBtn_visible: true, roomInput_visible: true}, async function() {
            navigator.mediaDevices.getUserMedia({video: true, audio: true})
            .then(stream => {
                this.localVideo.current.srcObject = stream
                localStream = stream;
                remoteStream = new MediaStream();
                this.remoteVideo.current.srcObject = remoteStream
                if (this.remoteVideo.current.srcObject) {
                    this.setState({ mediaActivated: true })
                }
            })
            .catch(err => console.log(err))         
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

            //Update the admin_video_room
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
                            let anonUsersRef = db.collection('anon-users')
                                                 .doc(doc.data().admin_room_location)
                            //Update the anonymous user's video room to match the admin's video room
                            anonUsersRef.update({"anon_video_room": roomRef.id})
                                        .then(function() {
                                            console.log("Anonymous User's Video Room matches Admin User's Video Room")
                                            alert("Successfully Created Video Room!")
                                         }).catch(function(err) {
                                            console.log(err)
                                         })
                            messagesRef.set({
                                "sender_name": doc.data().admin_name,
                                "message": "Click the \"Join Room Button\" to join my video call.",
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

    async joinRoomById() {
        //Create a Firebase Firestore Database Instance
        const db = firebase.firestore();

        //Grab the Current Logged in User
        let user = firebase.auth().currentUser

        //Create Reference for an anonymous user
        let anonUsersRef = db.collection('anon-users').doc(user.uid)

        //Initialize the roomId to the anonymous user's video room id
        let roomId = await anonUsersRef.get().then((doc) => {
            if (doc.exists) {
                let roomId = doc.data().anon_video_room
                return (roomId) ? (roomId) : "empty"
            } else {
                return "empty"
                console.log("User with id: " + user.uid + " doesn't exist.")
            }
        })

        //Find the specific video room specified by roomId, as explained above.
        const roomRef = db.collection('video-rooms').doc(`${roomId}`);

        //Retrieve a snapshot(copy) of the target room associate with the roomId.
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

    async toggleVideo(event) {
        const tracks = this.localVideo.current.srcObject.getVideoTracks();
            tracks.forEach(track => {
            track.enabled = !track.enabled;
        })        
    }
    async toggleSound(event) {
        const tracks = this.localVideo.current.srcObject.getAudioTracks();
        tracks.forEach(track => {
            track.enabled = !track.enabled;
        })
        this.setState((state) => ({
            sound: !state.sound
        }))                  
    }

    async hangUp(event) {
        //db instance
        const db = firebase.firestore();

        //Step 1: Stop streaming yourself
        const tracks = this.localVideo.current.srcObject.getTracks();
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
        }
        //Update the anonymous user's video room to empty string.
        //No need to do this for admin, since they can't call joinRoomById() explicitly
        let user = firebase.auth().currentUser
        if (user) {
            let anonUsersRef = db.collection('anon-users').doc(user.uid)

            await anonUsersRef.get().then((doc) => {
                if (doc.exists) {
                    console.log("lol")
                    anonUsersRef.update({"anon_video_room": ""})
                } else {
                    console.log(`Anonymous User with uid: ${user.uid} does not exist.` )
                }
            }).catch((err) => console.log(err))
        }
        this.setState({mediaActivated: false}) 
    }
}

export default MediaPortal