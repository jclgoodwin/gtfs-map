import { useEffect, useRef, Fragment} from "react";


function Row({time, timestamp, currentStopSequence}) {
  let current = currentStopSequence === time.sequence;

  let rowSpan = time.arrival_time != time.departure_time ? 2 : null;

  let ref = useRef(null);

  useEffect(() => {
    if (current) {
      ref.current.scrollIntoView();
    }
  }, [currentStopSequence]);

  if (current) {
    var when = new Date(timestamp * 1000);
    when = when.toTimeString().slice(0, 9);
  }

  return (
    <Fragment>
      <tr className={ time.timepoint ? null : 'minor' } ref={ref}>
        <td rowSpan={ rowSpan }><a href={`https://bustimes.org/stops/${time.stop_code}`} target='_blank'>{time.stop_name}</a></td>
        <td>{time.arrival_time}</td>
        { current ? <td>{when} 🚍</td> : null}
      </tr>
      { rowSpan ? <tr><td>{ time.departure_time }</td></tr> : null }
    </Fragment>
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
            {trip.times.map(time => <Row key={time.sequence} time={time} timestamp={item.vehicle.timestamp} currentStopSequence={item.vehicle.currentStopSequence} />)}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Sidebar;
