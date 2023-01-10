import { Popup } from "react-map-gl";

function VehiclePopup({ item, onClose }) {
  let when = new Date(item.vehicle.timestamp * 1000);

  return (
    <Popup
      offset={8}
      latitude={item.vehicle.position.latitude}
      longitude={item.vehicle.position.longitude}
      closeOnClick={false}
      onClose={onClose}
    >
      {item.route_short_name}<br />
      🚍 {item.vehicle.vehicle.id}<br/>
      ⌚️ {when.toTimeString().slice(0, 9)}
    </Popup>
  );
}

export default VehiclePopup;
