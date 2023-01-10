import { useState, useEffect } from "react";


function Sidebar({ item, trip, onClose }) {
  if (!trip || !item.vehicle.trip || trip.id != item.vehicle.trip.tripId) {
    return null;
  }

  return (
    <div className="sidebar">
      <button onClick={onClose}>Close &times;</button>
      <h2>{trip.route_short_name} to {trip.headsign}</h2>
      <p>{item.vehicle.vehicle.id}</p>
      {trip ? 
        <table>
          <thead>
            <tr>
              <td></td>
              <th scope="col">Timetable</th>
            </tr>
          </thead>
          <tbody>
            {trip.times.map(time => {
              return <tr key={time.sequence}>
                <td><a href={`https://bustimes.org/stops/${time.stop_code}`} target='_blank'>{time.stop_name}</a></td>
                <td>{time.arrival_time}</td>
              </tr>;
            })}
          </tbody>
        </table>
        : null }
      {/* JSON.stringify(item) */}
    </div>
  );
}

export default Sidebar;
