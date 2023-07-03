import LayoutDashboard from "./LayoutDashboard";
import { useEffect, useState } from "react";
import {orderBy} from "lodash";
import axios from "axios";

export default function PlacesDashboardPage() {
    const [sortingColumn, setSortingColumn] = useState('id');
    const [sortingDirection, setSortingDirection] = useState('ASC');
    const [data, setData] = useState([]);

  const columns = {
    place_id: 'Place ID',
    owner_id: 'Owner ID',
    title: 'Title',
    address: 'Address',
    description: 'Description',
    spaceType: 'Space Type',
    price: 'Price',

  };

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await axios.get('/all-places'); 
        const places = response.data;
        setData(places);
      } catch (error) {
        console.error('Error fetching places:', error);
      }
    };
    fetchPlaces();
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
      <h1 className="text-primary text-xl font-bold mb-4">Places</h1>
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
              <td>{item.owner}</td>
              <td>{item.title}</td>
              <td>{item.address}</td>
              <td>{item.description}</td>
              <td>{item.spaceType}</td>
              <td>{item.price}</td>
            </tr>
          ))}
          
        </tbody>
      </table>
    </LayoutDashboard>
  );
}