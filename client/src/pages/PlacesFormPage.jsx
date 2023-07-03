import HouseRules from "../HouseRules";
import { useEffect, useState } from "react";
import axios from "axios";
import AccountNav from "../AccountNav";
import { Navigate, useParams } from "react-router-dom";


export default function PlacesFormPage() {

    const {id} = useParams();

    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [photoLink, setPhotoLink] = useState('');
    const [description, setDescription] = useState('');
    const [houseRules, setHouseRules] = useState([]);
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [maxGuests, setMaxGuests] = useState('1');
    const [bedsNumber, setBedsNumber] = useState('');
    const [bathroomsNumber, setBathroomsNumber] = useState('');
    const [bedroomsNumber, setBedroomsNumber] = useState('');
    const [squareMeters, setSquareMeters] = useState('');
    const [spaceType, setSpaceType] = useState('');
    const [minimumLengthStay, setMinimumLengthStay] = useState('');
    const [price, setPrice] = useState('100');
    const [redirect, setRedirect] = useState(false);

    //when we click on a place, form page appears with the inputs we had provided
    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/places/'+id).then(response => {
            const {data} = response;
            setTitle(data.title);
            setAddress(data.address);
            setAddedPhotos(data.photos);
            setDescription(data.description);
            setHouseRules(data.houseRules);
            setCheckIn(data.checkIn);
            setCheckOut(data.checkOut);
            setMaxGuests(data.maxGuests);
            setBedsNumber(data.bedroomsNumber);
            setBathroomsNumber(data.bathroomsNumber);
            setBedroomsNumber(data.bedroomsNumber);
            setSquareMeters(data.squareMeters);
            setSpaceType(data.spaceType);
            setMinimumLengthStay(data.minimumLengthStay);
            setPrice(data.price);

        });
    }, [id]);

    // Takes a link that is inside the state and then uploads the photo into
    // the server and returns a link that will be inside api server
    async function addPhotoByLink(ev){
        ev.preventDefault();
        const {data:filename} = await axios.post('/upload-by-link', {link: photoLink});
        //prev for previous value, returning new value
        setAddedPhotos(prev => {
            return [...prev, filename];
        });
        setPhotoLink(''); //resetting the state

    }

    function uploadPhoto(ev){
        const files = ev.target.files;
        const data = new FormData();
        for (let i=0; i < files.length; i++) {
            data.append('photos', files[i]);
        }
        // instead of using async and await, here I am using .then
        axios.post('/upload', data, {
            headers: {'Content-type':'multipart/form-data'}
        }).then(response => {
            const {data:filenames} = response;
            setAddedPhotos(prev => {
                return [...prev, ...filenames];
            });
        })
    }

    //Spread syntax (...) allows an iterable 
    //such as an array expression or string to be 
    //expanded in places where zero or more arguments 
    //(for function calls) or elements (for array literals) 
    //are expected, or an object expression 
    //to be expanded in places where zero 
    //or more key-value pairs (for object literals) 
    //are expected.

    async function savePlace(ev) {
        ev.preventDefault();
        const placeData = {
            title, address, addedPhotos, 
            description, houseRules, checkIn, 
            checkOut, maxGuests, bedsNumber, 
            bathroomsNumber, bedroomsNumber, squareMeters, 
            spaceType, minimumLengthStay, price
        };
        if (id) {
            // update
            await axios.put('/places', {
                id, ...placeData
                });
            setRedirect(true);
        } else {
            // new place
            await axios.post('/places', placeData);
            setRedirect(true);
        }

        
    }

    if (redirect) {
        return <Navigate to={'/account/places'} />
    }

    function removePhoto(ev, filename) {
        ev.preventDefault();
        setAddedPhotos([...addedPhotos.filter(photo => photo !== filename)]);
    }

    function selectAsMainPhoto(ev, filename){
        ev.preventDefault();
        const addedPhotosWithoutSelected = addedPhotos.filter(photo => photo !== filename);
        const newAddedPhotos = [filename, ...addedPhotosWithoutSelected];
        setAddedPhotos(newAddedPhotos);
    }

    return (
        <div>
                    <AccountNav />
                    <form onSubmit={savePlace}>
                        <h2 className="text-2xl mt-4">Title</h2>
                        <p className="text-gray-500 text-sm">Title for the place</p>
                        <input type="text" value={title} onChange={ev => setTitle(ev.target.value)} placeholder="title" />
                        <h2 className="text-2xl mt-4">Address</h2>
                        <p className="text-gray-500 text-sm">Address to the place</p>
                        <input type="text" value={address} onChange={ev => setAddress(ev.target.value)} placeholder="address"/>
                        <h2 className="text-2xl mt-4">Photos</h2>
                        <p className="text-gray-500 text-sm">Photos of the place</p>
                        <div className="flex gap-2">
                            <input value={photoLink} 
                                   onChange={ev => setPhotoLink(ev.target.value)} 
                                   type="text" placeholder={'Add using a link'}/>
                            <button onClick={addPhotoByLink} className="bg-gray-200 px-4 rounded-2xl">Add&nbsp;photo</button>
                        </div>
                        <div className="mt-2 grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                            {addedPhotos.length > 0 && addedPhotos.map(link => (
                                <div className="h-32 flex relative" key={link}>
                                    <img className="rounded-2xl w-full object-cover" src={'http://localhost:4000/uploads/'+link} alt=""/>
                                    <button onClick={ev => removePhoto(ev, link)} className="cursor-pointer absolute bottom-1 right-1 text-white bg-black bg-opacity-50 rounded-2xl py-2 px-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                        </svg>
                                    </button>
                                    <button onClick={ev => selectAsMainPhoto(ev, link)} className="cursor-pointer absolute bottom-1 left-1 text-white bg-black bg-opacity-50 rounded-2xl py-2 px-3">
                                        {link === addedPhotos[0] && (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                                            </svg> 
                                        )}
                                        {link !== addedPhotos[0] && (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            ))}
                            
                            <label className="h-32 cursor-pointer flex items-center gap-1 justify-center border bg-transparent rounded-2xl p-2 text-2xl text-gray-600">
                                <input type="file" multiple className="hidden" onChange={uploadPhoto} />
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                                </svg>
                                Upload
                            </label>
                        </div>
                        <h2 className="text-2xl mt-4">Description</h2>
                        <p className="text-gray-500 text-sm">Description of the place</p>
                        <textarea value={description} onChange={ev => setDescription(ev.target.value)} />
                        <h2 className="text-2xl mt-4">House Rules</h2>
                        <p className="text-gray-500 text-sm">Select all the rules of the place</p>
                        <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg-grd-cols-6">
                            <HouseRules selected={houseRules} onChange={setHouseRules}/>
                        </div>
                        <div className="mt-2">
                                <p className="text-gray-500 text-sm mb-1">Minimum length stay</p>
                                <input type="number" value={minimumLengthStay} onChange={ev => setMinimumLengthStay(ev.target.value)} />
                        </div>
                        <h2 className="text-2xl mt-4">Extra info</h2>
                        <p className="text-gray-500 text-sm">Further details of the place</p>
                        <div className="grid gap-2 sm:grid-cols-3">
                            <div>
                                <h3 className="mt-2 -mb-1">Check in time</h3>
                                <input type="text" 
                                value={checkIn} 
                                onChange={ev => setCheckIn(ev.target.value)} 
                                placeholder="14:00"/>
                            </div>
                            <div>
                                <h3 className="mt-2 -mb-1">Check out time</h3>
                                <input type="text" 
                                value={checkOut} 
                                onChange={ev => setCheckOut(ev.target.value)} 
                                placeholder="11:00"/>
                            </div>
                            <div>
                                <h3 className="mt-2 -mb-1">Max number of guests</h3>
                                <input type="number" 
                                value={maxGuests} 
                                onChange={ev => setMaxGuests(ev.target.value)}/>
                            </div>
                            <div>
                                <h3 className="mt-2 -mb-1">How many beds</h3>
                                <input type="number" 
                                value={bedsNumber} 
                                onChange={ev => setBedsNumber(ev.target.value)}/>
                            </div>
                            <div>
                                <h3 className="mt-2 -mb-1">How many bathrooms</h3>
                                <input type="number" 
                                value={bathroomsNumber} 
                                onChange={ev => setBathroomsNumber(ev.target.value)}/>
                            </div>
                            <div>
                                <h3 className="mt-2 -mb-1">How many bedrooms</h3>
                                <input type="number" 
                                value={bedroomsNumber} 
                                onChange={ev => setBedroomsNumber(ev.target.value)}/>
                            </div>
                            <div>
                                <h3 className="mt-2 -mb-1">Square meters</h3>
                                <input type="number" 
                                value={squareMeters} 
                                onChange={ev => setSquareMeters(ev.target.value)}/>
                            </div>
                            
                            <div>
                                <h3 className="mt-2 -mb-1">Type of space</h3>
                                <select
                                    value={spaceType}
                                    onChange={ev => setSpaceType(ev.target.value)}
                                >
                                    <option value="" disabled hidden>
                                    </option>
                                    <option value="privateRoom">Private room</option>
                                    <option value="sharedRoom">Shared room</option>
                                    <option value="hotelRoom">Hotel room</option>
                                    <option value="entirePlace">Entire place</option>
                                </select>
                            </div>

                            <div>
                                <h3 className="mt-2 -mb-1">Price per night</h3>
                                <input type="text" 
                                value={price} 
                                onChange={ev => setPrice(ev.target.value)}/>
                            </div>

                        </div>
                        <div>
                            <button className="primary my-4 mt-20">Save</button>
                        </div>
                    </form>
                </div>
    );
}


