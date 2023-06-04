import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./UserContext";

export default function AccountNav(){

const { user } = useContext(UserContext);
// const location = useLocation();
// console.log(location); ----> this shows the following properties: hash, key, pathname, search, state
const {pathname} = useLocation(); //grabbing pathname
let subpage = pathname.split('/')?.[2]; //want the second part of pathname e.g. from '/account/places' want the 'places' || could be empty (that's why I use '?') 

if (subpage === undefined) {
    subpage = 'profile';
}


// This function applies bg-primary on any of these links if pressed (profile - bookings - accommodations)
function linkClasses (type=null) {
    let classes = 'inline-flex gap-1 py-2 px-6 rounded-full';
    // if (type === subpage || (subpage === undefined && type === 'profile')) {
    if (type === subpage) {
        classes += ' bg-primary text-white '; 
    } else {
        classes += ' bg-gray-200';
            }
    return classes;
}

const isAdmin = user?.email === 'admin@gmail.com';
    
  return(
    <nav className="w-full flex justify-center mt-8 gap-2 mb-8">
        <Link className={linkClasses('profile')} to={'/account'}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            My profile
        </Link>

        {!isAdmin && (
            <>
            <Link className={linkClasses('bookings')} to={'/account/bookings'}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            My bookings
        </Link>
        <Link className={linkClasses('places')} to={'/account/places'}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
            </svg>
            My accommodations
        </Link>
            </>
        )

        }

        {isAdmin && (
            <>
            <Link className={linkClasses('dashboard')} to={'/dashboard'}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
            My dashboard
        </Link>
            </>
        )

        }
        
    </nav>
  );  
}