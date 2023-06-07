import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function SearchResult() {
    const [places, setPlaces] = useState([]);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const resultPlaces = searchParams.get('places');

    
    useEffect(() => {
        if (resultPlaces) {
        setPlaces(JSON.parse(resultPlaces));
        }
    }, [resultPlaces]);


    return (

        <div className="mt-8 grid gap-x-2 gap-y-8 grid-cols-3  gap-4">
            <div className="col-span-1 ">
                 {/* <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-8 flex"> */}
                <div className="bg-white shadow p-4 rounded-2xl ">
                    <div className="flex gap-2 items-center justify-center">
                        <div className="text-2xl text-center">
                            Filters
                        </div>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                            </svg>
                        </div>
                    </div>

                    <div className="border rounded-2xl mt-4">
                        <div className="pt-2 py-1 px-4 border-t">
                        <label>Number of guests:</label>
                        <input type="number" />
                        {/* <input type="number" 
                        value={numberOfGuests} 
                        onChange={ev => setNumberOfGuests(ev.target.value)}/> */}
                        </div>
                        <div className="py-1 px-4 border-t">
                        <label>Beds:</label>
                        <input type="number" />

                        {/* <input type="number" 
                        value={numberOfGuests} 
                        onChange={ev => setNumberOfGuests(ev.target.value)}/> */}
                        </div>
                        <div className="py-1 px-4 border-t">
                        <label>Bathrooms:</label>
                        <input type="number" />

                        {/* <input type="number" 
                        value={numberOfGuests} 
                        onChange={ev => setNumberOfGuests(ev.target.value)}/> */}
                        </div>
                        <div className="py-1 px-4 border-t">
                        <label>Bedrooms:</label>
                        <input type="number" />

                        {/* <input type="number" 
                        value={numberOfGuests} 
                        onChange={ev => setNumberOfGuests(ev.target.value)}/> */}
                        </div>
                        <div className="py-1 px-4 border-t">
                        <label>Square meters:</label>
                        <input type="number" />

                        {/* <input type="number" 
                        value={numberOfGuests} 
                        onChange={ev => setNumberOfGuests(ev.target.value)}/> */}
                        </div>
                        <div className="py-1 px-4 border-t">
                        <label>Property type:</label>
                        <input type="number" />

                        {/* <input type="number" 
                        value={numberOfGuests} 
                        onChange={ev => setNumberOfGuests(ev.target.value)}/> */}
                        </div>
                    </div>
                    {/* <button onClick={bookThisPlace} className="primary mt-4"> */}
                    <button className="primary mt-4 ">
                        Apply Filters
                        {/* {numberOfNights > 0 && (
                            <div>
                                <span>Total (EUR): €{numberOfNights * place.price}</span>
                            </div>         
                        )} */}
                        
                    </button>
                </div>
            </div>
        
            <div className="col-span-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {places.length > 0 && places.map(place => (
                            <Link key={place._id} to={'/place/'+place._id}>
                                <div className="bg-gray-500 mb-2 rounded-2xl flex">
                                    {place.photos?.[0] && (
                                        <img className="rounded-2xl object-cover aspect-square" src={'http://localhost:4000/uploads/'+place.photos?.[0]} alt=""/>
                                    )}
                                </div>
                                <h2 className="font-bold">{place.address}</h2>
                                <h3 className="text-sm text-gray-500">{place.title}</h3>
                                <div className="mt-1">
                                    <span className="font-bold">€{place.price}</span> per night
                                </div>
                            </Link>
                        ))}
                </div>
            </div>      
        </div>
        
    );

}
