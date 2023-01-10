import { useState, useEffect } from "react";


function Row({time, currentStopSequence}) {
  let current = currentStopSequence === time.sequence;

  return (
    <tr className={ time.timepoint ? null : 'minor' }>
      <td><a href={`https://bustimes.org/stops/${time.stop_code}`} target='_blank'>{time.stop_name}</a></td>
      <td>{time.arrival_time}</td>
      { current ? <td>🚍</td> : null}
    </tr>
  );
}


function Sidebar({ item, trip, onClose }) {
  if (!trip || !item.vehicle.trip || trip.id != item.vehicle.trip.tripId) {
    return null;
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <button onClick={onClose}>Close &times;</button>
        <h2>{trip.route_short_name} to {trip.headsign}</h2>
      </div>
      <div className="sidebar-trip-timetable">
        <table>
          <thead>
            <tr>
              <td></td>
              <th scope="col">Timetable</th>
            </tr>
          </thead>
          <tbody>
            {trip.times.map(time => <Row key={time.sequence} time={time} currentStopSequence={item.vehicle.currentStopSequence} />)}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Sidebar;
