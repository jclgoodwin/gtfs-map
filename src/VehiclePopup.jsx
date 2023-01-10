import { Popup } from "react-map-gl";

function VehiclePopup({ item, onClose }) {
  return (
    <Popup
      offset={8}
      latitude={item.vehicle.position.latitude}
      longitude={item.vehicle.position.longitude}
      closeOnClick={false}
      onClose={onClose}
    >
      {item.vehicle.vehicle.id}
    </Popup>
  );
}

export default VehiclePopup;
