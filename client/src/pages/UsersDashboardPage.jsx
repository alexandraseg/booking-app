import { useEffect, useState } from "react";
import LayoutDashboard from "./LayoutDashboard";
import {orderBy} from "lodash";
import axios from "axios";

export default function UsersDashboardPage() {

  const [sortingColumn, setSortingColumn] = useState('id');
  const [sortingDirection, setSortingDirection] = useState('ASC');
  
  const [data, setData] = useState([]);
  
//   const data = [
//     {id:1, username: 'Donella', name: 'Agneth', surname: 'Noshoe', email:'donella@gmail.com', tel:1234, role:'Host'},
//     {id:2, username: 'Donella', name: 'Agneth', surname: 'Noshoe', email:'donella@gmail.com', tel:1234, role:'Host'},
//     {id:3, username: 'Donella', name: 'Agneth', surname: 'Noshoe', email:'donella@gmail.com', tel:1234, role:'Host'},
//     {id:4, username: 'Donella', name: 'Agneth', surname: 'Noshoe', email:'donella@gmail.com', tel:1234, role:'Host'},
//     {id:5, username: 'Donella', name: 'Agneth', surname: 'Noshoe', email:'donella@gmail.com', tel:1234, role:'Host'},
//     {id:6, username: 'Donella', name: 'Agneth', surname: 'Noshoe', email:'donella@gmail.com', tel:1234, role:'Host'},
//     {id:7, username: 'Donella', name: 'Agneth', surname: 'Noshoe', email:'donella@gmail.com', tel:1234, role:'Host'},
//     {id:8, username: 'Donella', name: 'Agneth', surname: 'Noshoe', email:'donella@gmail.com', tel:1234, role:'Host'},
//     {id:9, username: 'Donella', name: 'Agneth', surname: 'Noshoe', email:'donella@gmail.com', tel:1234, role:'Host'},
//     {id:10, username: 'Donella', name: 'Agneth', surname: 'Noshoe', email:'donella@gmail.com', tel:1234, role:'Host'},
// ];

  const columns = {
    id: 'ID',
    username: 'Username',
    name: 'Name',
    surname: 'Surname',
    email: 'Email',
    tel: 'Tel',
    role: 'Role',
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/all-users'); 
        const users = response.data;
        setData(users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
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
      <h1 className="text-primary text-xl font-bold mb-4">Users</h1>
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
              <td>{item.username}</td>
              <td>{item.name}</td>
              <td>{item.surname}</td>
              <td>{item.email}</td>
              <td>{item.tel}</td>
              <td>{item.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </LayoutDashboard>
  );
}