import { useState } from "react";
import LayoutDashboard from "./LayoutDashboard";
import {orderBy} from "lodash";

export default function UsersDashboardPage() {

  const [sortingColumn, setSortingColumn] = useState('id');
  const [sortingDirection, setSortingDirection] = useState('ASC');
  const data = [
    {id:1, username: 'Donella', name: 'Agneth', surname: 'Noshoe', email:'donella@gmail.com', tel:1234, role:'Host'},
    {id:2, username: 'Donella', name: 'Agneth', surname: 'Noshoe', email:'donella@gmail.com', tel:1234, role:'Host'},
    {id:3, username: 'Donella', name: 'Agneth', surname: 'Noshoe', email:'donella@gmail.com', tel:1234, role:'Host'},
    {id:4, username: 'Donella', name: 'Agneth', surname: 'Noshoe', email:'donella@gmail.com', tel:1234, role:'Host'},
    {id:5, username: 'Donella', name: 'Agneth', surname: 'Noshoe', email:'donella@gmail.com', tel:1234, role:'Host'},
    {id:6, username: 'Donella', name: 'Agneth', surname: 'Noshoe', email:'donella@gmail.com', tel:1234, role:'Host'},
    {id:7, username: 'Donella', name: 'Agneth', surname: 'Noshoe', email:'donella@gmail.com', tel:1234, role:'Host'},
    {id:8, username: 'Donella', name: 'Agneth', surname: 'Noshoe', email:'donella@gmail.com', tel:1234, role:'Host'},
    {id:9, username: 'Donella', name: 'Agneth', surname: 'Noshoe', email:'donella@gmail.com', tel:1234, role:'Host'},
    {id:10, username: 'Donella', name: 'Agneth', surname: 'Noshoe', email:'donella@gmail.com', tel:1234, role:'Host'},
];

  const columns = {
    id: 'ID',
    username: 'Username',
    name: 'Name',
    surname: 'Surname',
    email: 'Email',
    tel: 'Tel',
    role: 'Role',
  };

  function updateSorting(column) {
    if (column === sortingColumn) {
      setSortingDirection(prev => prev === 'ASC' ? 'DESC' : 'ASC');
    }
    setSortingColumn(column);
  }

  const sortedData = orderBy(data, sortingColumn, [sortingDirection.toLowerCase()]);

  return (
    <LayoutDashboard>
      <h1 className="text-primary text-xl font-bold mb-4">Orders</h1>
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
            <tr key={item.id}>
              {Object.keys(item).map(key => (
                <td key={key}>{item[key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </LayoutDashboard>
  );
}