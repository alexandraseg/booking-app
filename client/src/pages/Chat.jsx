import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function Chat() {

    const {user} = useContext(UserContext);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const owner = searchParams.get('owner');

    const ownerId = searchParams.get('ownerId');
    // console.log(user._id);

    const [newMessageText, setNewMessageText] = useState('');
    // const username = owner ? owner.username : '';

//   console.log(owner); // Log the username to the console
//   console.log(owner.username);


    function selectContact() {

    }

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
                        <div className="text-gray-600">messages</div>
                    </div>
                </div>
                <form className="flex gap-2">
                    <input type="text" 
                    value={newMessageText}
                    onChange={ev => setNewMessageText(ev.target.value)}
                    className="bg-white border p-2" 
                    placeholder="Type your message here" />
                    <button className="flex gap-2 p-2 text-white bg-primary rounded-xl items-center" >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                        </svg>
                    </button>
                </form>
            </div>

        </div>
        );
}