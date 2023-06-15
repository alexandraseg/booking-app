import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { UserContext } from "../UserContext";
import axios from "axios";
import ScrollableFeed from 'react-scrollable-feed';
import { Tooltip, Avatar, Spinner } from "@chakra-ui/react";

export default function Chat() {


    const {user} = useContext(UserContext);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const owner = searchParams.get('owner');
    const ownerId = searchParams.get('ownerId');

    // const userId = user._id;

    // console.log(user.username);
    // console.log(user._id);
    // const username = owner ? owner.username : '';
    //   console.log(owner); // Log the username to the console
    //   console.log(owner.username);

    const [selectedChat, setSelectedChat] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [chats, setChats] = useState([]);
    const [loggedUser, setLoggedUser] = useState('');
    const [fetchAgain, setFetchAgain] = useState(false);
    const [messages, setMessages] = useState([]);

    const isRequestSentRef = useRef(false);
    const [loading, setLoading] = useState(false);

    function selectContact() {

    }


    useEffect(() => {
        if (!isRequestSentRef.current){

            isRequestSentRef.current = true;

            // console.log("testing UseEffect");
            axios.post("/accessChat", {
                userId: ownerId // pass the ownerId as the userId parameter
            })
            .then(response => {
                const { data } = response;
                setSelectedChat(data);
                setMessages([]);
            })
            .catch(error => {
            console.log("Error in accessChat function in chat.jsx");
            });
        }

        
    }, []);

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage){
            try {
                setNewMessage("");
                const {data} = await axios.post("/sendMessage", {
                    content: newMessage,
                    chatId: selectedChat._id, 
                });

                // adding/appending the new data
                setMessages([...messages, data]);
            } catch (error) {
                console.log("erro in sendMessage function in chat.jsx");
            }
        }

    };

    //console.log(selectedChat);
    // console.log(selectedChat._id);



    const fetchMessages = async () => {
        // if (!selectedChat) return;
        try {
            setLoading(true);
            const {data} = await axios.get(`/allMessages/${selectedChat._id}`);

            setMessages(data);

            setLoading(false);

        } catch (error) {
            console.log("error in fetchMessages < chat.jsx");
        }
    }

  

    // console.log(selectedChat._id);

    useEffect(() => {
        fetchMessages();
    }, []);




    const isSameSenderMargin = (messages, m, i, userId) => {
        // console.log(i === messages.length - 1);
      
        if (
          i < messages.length - 1 &&
          messages[i + 1].sender._id === m.sender._id &&
          messages[i].sender._id !== userId
        )
          return 33; //if it is the same sender who is logged in, return 33 margin, otherwise 0
        else if (
          (i < messages.length - 1 &&
            messages[i + 1].sender._id !== m.sender._id &&
            messages[i].sender._id !== userId) ||
          (i === messages.length - 1 && messages[i].sender._id !== userId)
        )
          return 0;
        else return "auto";
      };
      

    // all of messages, m for current message, i for index, and logged in user's id

    const isSameSender = (messages, m, i, userId) => {
        return (
          i < messages.length - 1 &&
          (messages[i + 1].sender._id !== m.sender._id ||
            messages[i + 1].sender._id === undefined) &&
          messages[i].sender._id !== userId
        );
      };
      
    const isLastMessage = (messages, i, userId) => {
        return (
          i === messages.length - 1 &&
          messages[messages.length - 1].sender._id !== userId && // if it is not a message of the logged in user
          messages[messages.length - 1].sender._id //if that message actually exists
        );
      };
      
    const isSameUser = (messages, m, i) => {
        return i > 0 && messages[i - 1].sender._id === m.sender._id; // if sender of previous message equals to the sender of current message
      };

    console.log(messages);

    return (
        <div className="flex h-screen">
            <div className="bg-white w-1/3 pl-4 pt-4">
                <div className="text-primary text-2xl font-bold flex gap-2 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
                        <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" />
                    </svg>
                    Messages
                </div>

                <div onClick={() => selectContact()} className="border-b border-gray-100 py-2 flex gap-2 items-center cursor-pointer">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                     </svg>
                </div>
                    <span className="text-gray-800">{owner}</span>

                </div>
            </div>
            <div className="flex flex-col bg-blue-50 w-2/3 p-2">
                <div className="flex-grow">
                    <div className="flex h-full flex-grow items-center justify-center">


                        <ScrollableFeed>
                        {/* {loading ? ( */}
                        {messages.length === 0 ? (
                            <Spinner 
                                size="xl"
                                w={20}
                                h={20}
                                alignSelf="center"
                                margin="auto">
                            </Spinner> 
                        ) : (
                        // <div className="text-gray-600">messages</div>
                        messages.map((m, i) => (
                            <div style={{ display: "flex" }} key={m._id}>
                                {(isSameSender(messages, m, i, user._id) ||
                                isLastMessage(messages, i, user._id)) && (
                                <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                                    <Avatar
                                    mt="7px"
                                    mr={1}
                                    size="sm"
                                    cursor="pointer"
                                    name={m.sender.name}
                                    src={m.sender.pic}
                                    />
                                </Tooltip>
                                )}
                                <span
                                style={{
                                    backgroundColor: `${
                                    m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                                    }`,
                                    marginLeft: isSameSenderMargin(messages, m, i, user._id),
                                    marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                                    borderRadius: "20px",
                                    padding: "5px 15px",
                                    maxWidth: "75%",
                                }}
                                >
                                {m.content}
                                </span>
                            </div>
                            ))                      
                        )}

                        
                            
                    {/* {messages &&
                        messages.map((m, i) => (
                        <div style={{ display: "flex" }} key={m._id}>
                            {(isSameSender(messages, m, i, user._id) ||
                            isLastMessage(messages, i, user._id)) && (
                            <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                                <Avatar
                                mt="7px"
                                mr={1}
                                size="sm"
                                cursor="pointer"
                                name={m.sender.name}
                                src={m.sender.pic}
                                />
                            </Tooltip>
                            )}
                            <span
                            style={{
                                backgroundColor: `${
                                m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                                }`,
                                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                                borderRadius: "20px",
                                padding: "5px 15px",
                                maxWidth: "75%",
                            }}
                            >
                            {m.content}
                            </span>
                        </div>
                        ))} */}
                            </ScrollableFeed>

                    </div>
                </div>
                <form className="flex gap-2" onKeyDown={sendMessage}>
                    <input type="text" 
                    value={newMessage}
                    onChange={ev => setNewMessage(ev.target.value)}
                    className="bg-white border p-2" 
                    placeholder="Type your message here" />
                    <button onClick={sendMessage} className="flex gap-2 p-2 text-white bg-primary rounded-xl items-center" >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                        </svg>
                    </button>
                </form>
            </div>

        </div>
        );
}