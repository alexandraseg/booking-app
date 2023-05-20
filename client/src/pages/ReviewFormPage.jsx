import React, {useState} from "react";



export default function ReviewFormPage () {

    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
        
    return(
        // <div>Review form page here</div>
        <div>
        <h1 className="text-3xl mt-10">Review</h1>
        <form onSubmit={''}>
            <h2 className="text-2xl mt-10">Describe your experience with the Place</h2>
            <p className="text-gray-500 text-sm">Your review will be public on the place's page</p>
            <textarea placeholder="What was it like to stay in this place?" value={''} onChange={''} />

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

          <hr className="mt-8 mb-8"></hr>

            <h2 className="text-2xl mt-4">Describe your experience with the Host</h2>
            <p className="text-gray-500 text-sm">Your review will be public on the host's page</p>
            <textarea placeholder="What was your experience with the host?" value={''} onChange={''} />

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

            <div>
                <button className="primary my-4 ">Submit</button>
            </div>
        </form>
    </div>
    );
}