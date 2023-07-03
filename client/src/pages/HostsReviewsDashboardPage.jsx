import LayoutDashboard from "./LayoutDashboard";
import { useEffect, useState } from "react";
import {orderBy} from "lodash";
import axios from "axios";


export default function HostsReviewsDashboardPage() {
    const [sortingColumn, setSortingColumn] = useState('id');
    const [sortingDirection, setSortingDirection] = useState('ASC');
    const [data, setData] = useState([]);
  
    const columns = {
      review_id: 'Review ID',
      place_id: 'Place ID',
      hostRating: 'Host Rating',
      hostComment: 'Host Comment',
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
        <h1 className="text-primary text-xl font-bold mb-4">Hosts Reviews</h1>
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

        {sortedData.map(item => (
            <tr key={item._id}>
              <td>{item._id}</td>
              <td>{item.place_id}</td>
              {/* <td>{item.host_id}</td> */}
              <td>{item.hostRating}</td>
              <td>{item.hostComment}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </LayoutDashboard>
    );
}

