import LayoutDashboard from "./LayoutDashboard";
import { useEffect, useState } from "react";
import {orderBy} from "lodash";
import axios from "axios";


export default function BookingsDashboardPage() {
    const [sortingColumn, setSortingColumn] = useState('id');
    const [sortingDirection, setSortingDirection] = useState('ASC');
    const [data, setData] = useState([]);

  const columns = {
    id: 'Booking ID',
    guest: 'Guest',
    place: 'Place',
    checkIn: 'Check In',
    checkOut: 'Check Out',
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('/all-bookings'); 
        const bookings = response.data;
        setData(bookings);
      } catch (error) {
        console.error('Error fetching places:', error);
      }
    };
    fetchBookings();
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
      <h1 className="text-primary text-xl font-bold mb-4">Bookings</h1>
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
              <td>{item.user}</td>
              <td>{item.place}</td>
              <td>{item.checkIn}</td>
              <td>{item.checkOut}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </LayoutDashboard>
  );
}

