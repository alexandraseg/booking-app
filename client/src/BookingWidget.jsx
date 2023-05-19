import axios from "axios";
import { differenceInCalendarDays } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function BookingWidget({place}) {
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [numberOfGuests, setNumberOfGuests] = useState('');
    const [redirect, setRedirect] = useState('');

    const {user} = useContext(UserContext);

    // useEffect(() => {
    //     if (user) {
    //        setName(user.name);
    //     }
    // }, [user]); //if the user changes

    let numberOfNights = 0;
    if (checkIn && checkOut) {
        numberOfNights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
    }

    async function bookThisPlace() {

      if (!user) {
        alert('You need to be registered to book this place.');
        return;
      }

        const data = {checkIn, checkOut, numberOfGuests, place:place._id, price:numberOfNights * place.price};
        const response = await axios.post('/bookings', data);
        const bookingId = response.data._id;
        setRedirect(`/account/bookings/${bookingId}`);
    }

    if (redirect) {
        return <Navigate to = {redirect} />
    }

    return(
    <div className="bg-white shadow p-4 rounded-2xl">
      <div className="text-2xl text-center">
        Price: €{place.price} / per night
      </div>
      <div className="border rounded-2xl mt-4">
        <div className="flex">
          <div className="py-3 px-4">
            <label>Check in:</label>
            <input type="date" 
            value={checkIn} 
            onChange={ev => setCheckIn(ev.target.value)}/>
          </div>
          <div className="py-3 px-4 border-l">
            <label>Check out:</label>
            <input type="date" 
            value={checkOut} 
            onChange={ev => setCheckOut(ev.target.value)}/>
          </div>
        </div>
        <div className="py-3 px-4 border-t">
          <label>Number of guests:</label>
          <input type="number" 
          value={numberOfGuests} 
          onChange={ev => setNumberOfGuests(ev.target.value)}/>
        </div>
      </div>
      <button onClick={bookThisPlace} className="primary mt-4">
        Reserve
        {numberOfNights > 0 && (
            <div>
                <span>Total (EUR): €{numberOfNights * place.price}</span>
            </div>         
        )}
        
      </button>
    </div>
    );
}

//checkIn, checkOut are strings, so with new Date() they are casted to dates