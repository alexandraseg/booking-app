//Provide context info to all possible routes and components. This is included in App.jsx

import { createContext, useEffect, useState } from "react";
import axios from "axios";
import {data} from "autoprefixer";


export const UserContext = createContext({}); //empty object as default

export function UserContextProvider({children}) {
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);
    useEffect(() => {
        if (!user) {
            axios.get('/profile').then(({data}) => {
                setUser(data);
                setReady(true);
            });
        }
      }, []);

    //   <UserContext.Provider value={{user,setUser, ready}}> 
    return (
        <UserContext.Provider value={{user,setUser, ready}}> 
            {children}
        </UserContext.Provider>
    );
}