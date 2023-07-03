import { Link } from "react-router-dom";
import AccountNav from "../AccountNav";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import PlaceImg from "../PlaceImg";


export default function RecommendationsPage() {

    const isRequestSentRef = useRef(false);
    const [placeIds, setPlaceIds] = useState([]);
    const [places, setPlaces] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
          if (!isRequestSentRef.current) {
            isRequestSentRef.current = true;
    
            try {
              const response = await axios.get('/recommendations');
              const { p1, p2, p3, p4, p5, p6 } = response.data;
              // Store the place IDs in the 'placeIds' state
              setPlaceIds([p1, p2, p3, p4, p5, p6]);
    
              // Fetch details of each place
              const placeResponses = await Promise.all([p1, p2, p3, p4, p5, p6].map((placeId) =>
                axios.get(`/places/${placeId}`)
              ));
    
              const placeData = placeResponses.map((placeResponse) => placeResponse.data);
              // Store the place data in the 'places' state
              setPlaces(placeData);
            } catch (error) {
              console.error('Error retrieving recommendations:', error);
            }
          }
        };
    
        fetchData();
      }, []);

      return (
    <div>
      <AccountNav />
      <div className="mt-4">
        {places.length > 0 &&
          places.map((place) => (
            <Link
              key={place._id}
              to={`/place/${place._id}`}
              className="flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl"
            >
              <div className="grow-0 shrink">
                <h2 className="text-xl">{place.title}</h2>
                <p className="text-sm mt-2">{place.description}</p>
              </div>
            </Link>
          ))}
      </div>
    </div>
    
      );
}


