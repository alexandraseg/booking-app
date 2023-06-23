import axios from "axios";
import React, {useEffect, useState} from "react";
import { Navigate, useParams } from "react-router-dom";



export default function ReviewFormPage () {

    const {id} = useParams();

    const [redirect, setRedirect] = useState(false);

    const [hostRating, setHostRating] = useState('');
    const [hostComment, setHostComment] = useState('');
    const [placeRating, setPlaceRating] = useState('');
    const [placeComment, setPlaceComment] = useState('');
    const [placeId, setPlaceId] = useState('');

    // rating 
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);

       //review form page appears with the inputs we had provided
       useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/bookings/'+id).then(response => {
            const {data} = response;
            setPlaceId(data.place);
        });
    }, [id]);

    async function saveReview(ev) {
      ev.preventDefault();
      const reviewData = {
          hostRating, 
          hostComment, 
          placeRating, 
          placeComment,
          date: new Date().toISOString(), // Add the current date
          placeId,
      };
      await axios.post('/reviews', reviewData);
      alert("Review submitted successfully! Your review will be public on the place's page.");
      setRedirect(true);
      // if (id) {
      //     // update
      //     await axios.put('/reviews', {
      //         id, ...reviewData
      //         });
      //     setRedirect(true);
      // } else {
      //     // new place
      //     await axios.post('/reviews', reviewData);
      //     setRedirect(true);
      // }
    }

  if (redirect) {
      return <Navigate to={`/account/bookings/${id}`} />
  }
        
    return(
        // <div>Review form page here</div>
        <div>
        <h1 className="text-3xl mt-10">Review</h1>
        <form onSubmit={saveReview}>
            <h2 className="text-2xl mt-10">Describe your experience with the Place</h2>
            <p className="text-gray-500 text-sm">Your review will be public on the place's page.</p>
            <textarea placeholder="What was it like to stay in this place?" 
            value={placeComment} 
            onChange={ev => setPlaceComment(ev.target.value)} />

            <h2 className="text-2xl mt-4">Rate the Place</h2>

            <div className="star-rating">
            {[...Array(5)].map((star, index) => {
              index += 1;
              return (
                <button
                  type="button"
                  key={index}
                  className={index <= (hover || rating) ? "on" : "off"}
                  onClick={() => setRating(index)}
                  onMouseEnter={() => setHover(index)}
                  onMouseLeave={() => setHover(rating)}
                >
                  <span className="star">&#9733;</span>
                </button>
              );
            })}
          </div>
          <input type="number"
          value={placeRating}
          onChange={ev => setPlaceRating(ev.target.value)} />

          <hr className="mt-8 mb-8"></hr>

            <h2 className="text-2xl mt-4">Describe your experience with the Host</h2>
            <p className="text-gray-500 text-sm">Your review will be public on the host's page</p>
            <textarea placeholder="What was your experience with the host?" 
            value={hostComment} onChange={ev => setHostComment(ev.target.value)} />

            <h2 className="text-2xl mt-4">Rate the Host</h2>
            <div className="star-rating">
            {[...Array(5)].map((star, index) => {
              index += 1;
              return (
                <button
                  type="button"
                  key={index}
                  className={index <= (hover || rating) ? "on" : "off"}
                  onClick={() => setRating(index)}
                  onMouseEnter={() => setHover(index)}
                  onMouseLeave={() => setHover(rating)}
                >
                  <span className="star">&#9733;</span>
                </button>
              );
            })}
          </div>
          <input type="number"
          value={hostRating}
          onChange={ev => setHostRating(ev.target.value)} />

            <div>
                <button className="primary my-4 ">Submit</button>
            </div>
        </form>
    </div>
    );
}