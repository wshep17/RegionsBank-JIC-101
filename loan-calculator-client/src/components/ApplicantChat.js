import React, { useState } from 'react';
import { Button } from 'antd';
import { CloseOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import "antd/dist/antd.css";
import "../css/App.css";
import "../css/ApplicantChat.css";


export default function ApplicantChat() {
    /*
	* open-chat: the chat window is open and the user can type in it
	* minimized-chat: there has been a chat window opened, but it is currently minimized
	* closed-chat: there is no chat window open, and the user can open one by clicking "Chat with an Advisor"
	*/
    const [chatOpen, setChatOpen] = useState(false);
    const [chatMinimized, setChatMinimized] = useState(false);
    if (!chatOpen) {
        return (
            <Button className='open-chat-button' onClick={() => { setChatOpen(true); setChatMinimized(false); }}>
                Chat with an Advisor
            </Button>
        );
    }
    return (
        <div className='user-chat-popup' id={chatMinimized ? 'minimized-chat' : 'open-chat'}>
            <div className='user-chat-header'>
                { chatMinimized ? (
                    <Button icon={<CaretUpOutlined />} type='text' size='small' shape='circle' onClick={() => setChatMinimized(false)} />
                    ) : (
                    <Button icon={<CaretDownOutlined/>} type='text' size='small' shape='circle' onClick={() => setChatMinimized(true)} />
                    )
                }
                <Button icon={<CloseOutlined/>} type='text' size='small' shape='circle' onClick={() => setChatOpen(false)}/>
            </div>
            <p>chat</p>
        </div>
        
    );
}