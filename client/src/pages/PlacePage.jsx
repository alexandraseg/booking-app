import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BookingWidget from "../BookingWidget";
import { format } from "date-fns";

export default function PlacePage(props){
    const {id} = useParams();
    const [place, setPlace] = useState(null);
    const [showAllPhotos, setShowAllPhotos] = useState(false);
    const [reviews, setReviews] = useState([]); //n
    const [usernames, setUsernames] = useState({});

    const fetchUsernames = (guestIds) => {
        axios.get('/users', { params: { ids: guestIds } }).then((response) => {
          const usernameMap = {};
          response.data.forEach((user) => {
            usernameMap[user._id] = user.username;
          });
          setUsernames(usernameMap);
        });
      };
    
    
    useEffect(() => {
        if (!id) {
            return;
        }
        // axios.get('/places/'+id)
        axios.get(`/places/${id}`).then(response => {
            setPlace(response.data);
        });

        axios.get('/reviews', { params: { place_id: id } }).then((response) => {
            setReviews(response.data);
            const guestIds = response.data.map((review) => review.guest_id);
            fetchUsernames(guestIds);
          }); //n
    }, [id]);

    if (!place) return '';

    if (showAllPhotos) {
        return (
            <div className="absolute inset-0 bg-white min-h-screen">
                <div className="p-8 grid gap-4">
                    <div>
                        <h2 className="text-2xl">Photos of {place.title}</h2>
                        <button onClick={() => setShowAllPhotos(false)} className="fixed left-8 flex gap-1 py-2 px-4 rounded-2xl shadow shadow-black">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
                        </svg>
                        Go back
                        </button>
                    </div>
                    
                    {place?.photos?.length > 0 && place.photos.map(photo => (
                        <div>
                            <img src={'http://localhost:4000/uploads/'+photo} alt="" />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

  const owner = place.owner;

  const ownerName = owner && owner.username ? owner.username : 'Unknown';
    // console.log(place.owner.username);

  const handleClick = () => {
    // Pass owner data to the /chat page using query parameters
    props.history.push('/chat?owner=' + owner);
  }

    return (
        <div>
            
                <div className="mt-4 bg-gray-100 -mx-8 px-8 py-4">
                <h1 className="text-2xl">{place.title}</h1>
                <a className="flex gap-1 my-3 block font-semibold underline" target="_blank" href={'https://maps.google.com/?q='+place.address}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    {place.address}
                </a>
                <div className="relative">
                    <div className="grid gap-2 grid-cols-[2fr_1fr] rounded-2xl overflow-hidden">
                        <div>
                            {place.photos?.[0] && (
                                <div>
                                    <img onClick={() => setShowAllPhotos(true)} className="aspect-square cursor-pointer object-cover" src={'http://localhost:4000/uploads/'+place.photos[0]} alt=""/>
                                </div>
                            )}
                        </div>
                        <div className="grid">
                            {place.photos?.[1] && (
                                    <img onClick={() => setShowAllPhotos(true)} className="aspect-square cursor-pointer object-cover" src={'http://localhost:4000/uploads/'+place.photos[1]} alt=""/>
                                )}
                            <div className="overflow-hidden">
                                {place.photos?.[2] && (
                                        <img onClick={() => setShowAllPhotos(true)} className="aspect-square cursor-pointer object-cover relative top-2" src={'http://localhost:4000/uploads/'+place.photos[2]} alt=""/>
                                    )}
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setShowAllPhotos(true)} className="absolute bottom-2 right-2 py-2 px-4 bg-white rounded-2xl">
                        Show more photos
                    </button> 
                </div>
                
                <div className="mt-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
                    <div>
                        <div className="my-4">
                            <h2 className=" text-2xl">Description</h2>
                            {place.description}
                        </div>
                        Check-in: {place.checkIn}<br />
                        Check-out: {place.checkOut}<br />
                        Max number of guests: {place.maxGuests} <br />
                        
                        <hr className="mt-8"></hr>
    
    
                        <div className="mt-4">
                            <div className="flex flex-col gap-2 mb-4 mt-1 text-2xl">
                                <div className="flex gap-2 items-center">
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                        </svg>
                                    </div>
                                    <div className="flex flex-col">
                                    <h2>153 Reviews</h2>
                                    
                                    </div>
                                    <h2>·</h2>
                                    <h2>4.98 Rating</h2>
                                </div>
                            </div>
                            
                            <div>
                                
                            </div>
                            {reviews?.length>0 && reviews.map(review =>(
                            <div key={review._id}>
                                {/* <div>Guest ID: {review.guest_id}</div> */}
                                <div className="flex gap-2 items-center mb-2">
                                    <div className="w-9 h-9 bg-white border rounded-full flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                                        </svg>    
                                    </div>
                                    <div className="">
                                        <div>{usernames[review.guest_id]}</div>
                                        <div className="text-gray-500">{format(new Date(review.date), "dd-MM-yyyy")}</div>
                                    </div>
                                    
                                </div>
                                <div  className="text-gray-800 mb-6">
                                {review.placeComment}
                            </div>
                            </div>
                              ))}
                            
                            <Link 
                                className="bg-gray-100 border p-2 text-black rounded-2xl mt-4" style={{ borderWidth: '2px', borderColor: 'darkgray' }}>
                                Show all reviews
                            </Link>
                        </div>
                        
                        <hr className="mt-8"></hr>
                        <br />
                        
                            <div className="flex gap-2 items-center">
                                <div className="w-11 h-11 bg-white border rounded-full flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                                    </svg>    
                                </div>
                                <h2 className=" text-2xl">Hosted by {ownerName}</h2>
                            </div>
                            <div className="flex flex-col gap-2 mb-8 ml-3 mt-1 text-sm text-gray-600">
                                <div className="flex gap-2">
                                    <div className="mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                    </svg>
                                    </div>
                                    <div className="flex flex-col">
                                    <h2>153 Reviews</h2>
                                    
                                    </div>
                                    <h2>|</h2>
                                    <h2>4.98 Rating</h2>
                                </div>
                            </div>
                        <Link to={{ pathname: '/chat', 
                            search: `?owner=${place.owner.username}` }} 
                            className="bg-black p-2 text-white rounded-2xl mt-4">
                                Message Host
                        </Link>
                        <h2 className="mt-3 text-sm text-gray-600">Let the host know why you 're travelling and when you 'll check in</h2>
                        
                        <hr className="mt-8"></hr>
    
                        <div className="mt-4">
                            <h2 className=" text-2xl mb-8"> {ownerName}'s Reviews</h2>
                            <Link 
                                className="bg-gray-100 border p-2 text-black rounded-2xl mt-4" style={{ borderWidth: '2px', borderColor: 'darkgray' }}>
                                Show more reviews
                            </Link>
                        </div>
                        
                        <hr className="mt-8"></hr>
    
                    </div>
                    <div>
                        <BookingWidget place={place} />
                    </div>
                </div>
              
            </div>

          
            
        </div>
        
    );
}

// Link to={'/dashboard'}

// using id inside useEffect, 
// so that every time 'id' changes 
// the useEffect function will run again

// target="_blank", to open new tab