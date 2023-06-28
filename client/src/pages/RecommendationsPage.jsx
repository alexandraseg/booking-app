import { Link } from "react-router-dom";
import AccountNav from "../AccountNav";
import { useEffect, useState } from "react";
import axios from "axios";
import PlaceImg from "../PlaceImg";


export default function RecommendationsPage() {

    const [recommendations,setRecommendations] = useState([]);
    // useEffect(() => {
    //     axios.get('/recommendations').then(({data}) => {
    //         setRecommendations(data);
    //     });
    // }, []);
    return (
        <div>
            <AccountNav />
                <div className="mt-4">
                    {
                        <div>
                            Recommendations here
                        </div>
                    }
                    {/* {recommendations.length > 0 && recommendations.map(recommendation => (
                        <Link
                        key={recommendation.place._id}
                         to={'/account/recommendations/'+recommendation.place._id} className="flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl">
                            <div className="flex w-32 h-32 bg-gray-300 grow shrink-0">
                            <PlaceImg place={place} />

                            </div>
                            <div className="grow-0 shrink">
                                <h2 className="text-xl">{recommendation.place.title}</h2>
                                <p className='text-sm mt-2'>{recommendation.place.description}</p>
                            </div>                   
                        </Link>
                    )
                    )
                    } */}
                </div>
        </div>
    );
}
