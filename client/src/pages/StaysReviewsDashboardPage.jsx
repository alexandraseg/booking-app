import LayoutDashboard from "./LayoutDashboard";
import { useEffect, useState } from "react";
import {orderBy} from "lodash";
import axios from "axios";


export default function StaysReviewsDashboardPage() {
    const [sortingColumn, setSortingColumn] = useState('id');
    const [sortingDirection, setSortingDirection] = useState('ASC');
    const [data, setData] = useState([]);


    //     const data = [
//       {id:1, guest: 'Donella', place: 'Cabin in Corralco', checkIn: '2023-05-12', checkOut:'2023-05-14', },
//       {id:2, guest: 'Donella', place: 'Cabin in Corralco', checkIn: '2023-05-12', checkOut:'2023-05-14', },
//       {id:3, guest: 'Donella', place: 'Cabin in Corralco', checkIn: '2023-05-12', checkOut:'2023-05-14', },
//       {id:4, guest: 'Donella', place: 'Cabin in Corralco', checkIn: '2023-05-12', checkOut:'2023-05-14', },
//       {id:5, guest: 'Donella', place: 'Cabin in Corralco', checkIn: '2023-05-12', checkOut:'2023-05-14', },
//       {id:6, guest: 'Donella', place: 'Cabin in Corralco', checkIn: '2023-05-12', checkOut:'2023-05-14', },
//       {id:7, guest: 'Donella', place: 'Cabin in Corralco', checkIn: '2023-05-12', checkOut:'2023-05-14', },
//       {id:8, guest: 'Donella', place: 'Cabin in Corralco', checkIn: '2023-05-12', checkOut:'2023-05-14', },
//       {id:9, guest: 'Donella', place: 'Cabin in Corralco', checkIn: '2023-05-12', checkOut:'2023-05-14', },
//       {id:10, guest: 'Donella', place: 'Cabin in Corralco', checkIn: '2023-05-12', checkOut:'2023-05-14', },
//   ];
  
    const columns = {
      review_id: 'Review ID',
      place_id: 'Place ID',
      guest_id: 'Guest ID',
      placeRating: 'Place Rating',
      placeComment: 'Place Comment',
    };

    useEffect(() => {
        const fetchReviews = async () => {
          try {
            const response = await axios.get('/all-reviews'); 
            const reviews = response.data;
            setData(reviews);
          } catch (error) {
            console.error('Error fetching places:', error);
          }
        };
        fetchReviews();
      }, []);
  
    function updateSorting(column) {
      if (column === sortingColumn) {
        setSortingDirection(prev => prev === 'ASC' ? 'DESC' : 'ASC');
      }
      setSortingColumn(column);
    }
  
    const sortedData = orderBy(data, sortingColumn, [sortingDirection.toLowerCase()]);
  
    return (
      <LayoutDashboard>
        <h1 className="text-primary text-xl font-bold mb-4">Stays Reviews</h1>
        <table>
          <thead>
            <tr>
              {Object.keys(columns).map(ck => (
                <th key={ck} onClick={() => updateSorting(ck)}>
                  {columns[ck]}
                  {sortingColumn === ck ? (
                    sortingDirection === 'ASC' ? '↓' : '↑'
                  ) : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* {sortedData.map(item => (
              <tr key={item.id}>
                {Object.keys(item).map(key => (
                  <td key={key}>{item[key]}</td>
                ))}
              </tr>
            ))} */}

        {sortedData.map(item => (
            <tr key={item._id}>
              <td>{item._id}</td>
              <td>{item.place_id}</td>
              <td>{item.guest_id}</td>
              <td>{item.placeRating}</td>
              <td>{item.placeComment}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </LayoutDashboard>
    );
}

