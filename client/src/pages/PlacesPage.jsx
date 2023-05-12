
import { Link, useParams } from "react-router-dom";
import PlacesFormPage from "./PlacesFormPage";
import AccountNav from "../AccountNav";
import { useEffect, useState } from "react";
import axios from "axios";
import PlaceImg from "../PlaceImg";


export default function PlacesPage() {

    const [places,setPlaces] = useState([]);
    useEffect(() => {
        axios.get('/user-places').then(({data}) => {
            setPlaces(data);
        });
    }, []);
    return (
        <div>
            <AccountNav />
                <div className="text-center">

                    <Link className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full" to={'/account/places/new'}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add new place
                    </Link>
                </div>
                <div className="mt-4">
                    {places.length > 0 && places.map(place => (
                        <Link to={'/account/places/'+place._id} className="flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl">
                            <div className="flex w-32 h-32 bg-gray-300 grow shrink-0">
                                {/* if there are any photos, show the first one */}
                                {/* {place.photos.length > 0 && (
                                    <img className="object-cover" src={'http://localhost:4000/uploads/'+place.photos[0]} alt="" />
                                )} */}
                                <PlaceImg place={place} />
                            </div>
                            <div className="grow-0 shrink">
                                <h2 className="text-xl">{place.title}</h2>
                                <p className='text-sm mt-2'>{place.description}</p>
                            </div>
                            
                        </Link>
                    ))}
                </div>
        </div>
    );
}

// useEffect is a React Hook that allows developers 
//to run side effects, such as 
//fetching data or modifying the DOM, 
//after a component has rendered. 
//It is a replacement for the componentDidMount, 
//componentDidUpdate, and componentWillUnmount 
//lifecycle methods in class components.

// useEffect takes two arguments: a function 
//and an optional array of dependencies. 
//The function passed to useEffect will be called 
//after every render cycle of the component. 
//The dependencies array is used to specify 
//which variables the effect should depend on. 
//If any of the variables in the dependencies array change, 
//the effect will be re-run.