import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css"; // You can keep this if you have additional styles
import redIconUrl from "../assets/redicon.png";
import greenIconUrl from "../assets/greenicon.png";
import yellowIconUrl from "../assets/yellowicon.png";
import blueIconUrl from "../assets/blueicon.png";
import responded from "../assets/check.png";
import notresponded from "../assets/deny.png";
import { database } from "../Firebase";
import { push, ref, remove } from "firebase/database";

// Custom icons setup
const redIcon = new L.Icon({
  iconUrl: redIconUrl,
  iconSize: [42, 40],
  iconAnchor: [20, 41],
  popupAnchor: [1, -34],
});
const greenIcon = new L.Icon({
  iconUrl: greenIconUrl,
  iconSize: [42, 40],
  iconAnchor: [20, 41],
  popupAnchor: [1, -34],
});
const yellowIcon = new L.Icon({
  iconUrl: yellowIconUrl,
  iconSize: [42, 40],
  iconAnchor: [20, 41],
  popupAnchor: [1, -34],
});
const blueIcon = new L.Icon({
  iconUrl: blueIconUrl,
  iconSize: [42, 40],
  iconAnchor: [20, 41],
  popupAnchor: [1, -34],
});

const Map = ({ selectedCoordinates, data }) => {
  const mapRef = useRef();
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [zoom, setZoom] = useState(false); // State for zoomed image

  useEffect(() => {
    if (selectedCoordinates && mapRef.current) {
      const { latitude, longitude } = selectedCoordinates;

      if (latitude && longitude) {
        setSelectedMarker({ latitude, longitude });
        mapRef.current.flyTo([latitude, longitude], 17);

        const matchedReport = data.find((report) => {
          const location = parseLocation(report.location);
          return (
            location &&
            location.latitude === latitude &&
            location.longitude === longitude
          );
        });

        setSelectedReport(matchedReport);
      }
    }
  }, [selectedCoordinates, data]);

  const parseLocation = (location) => {
    const regex = /Latitude:\s*([0-9.-]+),\s*Longitude:\s*([0-9.-]+)/;
    const match = location.match(regex);
    return match
      ? { latitude: parseFloat(match[1]), longitude: parseFloat(match[2]) }
      : null;
  };

  const handleSuccess = async (success) => {
    if (!selectedReport || !selectedReport.id) {
      console.warn("Selected report is not valid or missing ID.");
      return;
    }

    try {
      const historyRef = ref(database, "History");
      const dataToPush = {
        name: selectedReport.name,
        contact: selectedReport.contact,
        type: selectedReport.type,
        location: selectedReport.location,
        timestamp: selectedReport.timestamp,
        success: success ? "Yes" : "No",
        deviceId:selectedReport.deviceId,
        imageUrl:selectedReport.imageUrl,
        reportId:selectedReport.reportId


      };
      await push(historyRef, dataToPush);

      const reportRef = ref(database, `led/reports/${selectedReport.id}`);
      await remove(reportRef);
      console.log("Report deleted successfully");
    } catch (error) {
      console.error("Error pushing data to database: ", error);
    }
  };

  const isToday = (timestamp) => {
    const today = new Date();
    const reportDate = new Date(timestamp);
    return (
      today.getFullYear() === reportDate.getFullYear() &&
      today.getMonth() === reportDate.getMonth() &&
      today.getDate() === reportDate.getDate()
    );
  };

  return (
    <div className="relative w-full h-full">
      <MapContainer
        className="leaflet_container z-0 w-full h-full lg:h-[calc(100vh-120px)]"
        center={[10.3058, 123.891]}
        zoom={17}
        scrollWheelZoom={true}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {data.map((report, index) => {
          const location = parseLocation(report.location);
          if (!location) return null;

          let markerIcon;
          const reportDate = new Date(report.timestamp);
          const currentDate = new Date();

          if (isToday(report.timestamp)) {
            markerIcon = blueIcon;
          } else if (reportDate > currentDate) {
            markerIcon = redIcon;
          } else {
            markerIcon = yellowIcon;
          }

          return (
            <Marker
              key={index}
              position={[location.latitude, location.longitude]}
              icon={markerIcon}
            >
              <Popup>
                <div>
                  <h4>Name: {report.name}</h4>
                  <h4>Type: {report.type}</h4>
                  <h4>Contact: {report.contact}</h4>
                  <img className="w-full h-auto" src={report.imageUrl} alt="" />
                  <div className="flex justify-center gap-2 mt-4">
                    <img
                      onClick={() => handleSuccess(false)}
                      className="h-8 cursor-pointer"
                      src={notresponded}
                      alt="Not Responded"
                    />
                    <img
                      onClick={() => handleSuccess(true)}
                      className="h-8 cursor-pointer"
                      src={responded}
                      alt="Responded"
                    />
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
        {selectedMarker && selectedReport && (
          <Marker
            key="selected-marker"
            position={[selectedMarker.latitude, selectedMarker.longitude]}
            icon={redIcon}
          >
            <Popup>
              <div>
                <div>
                  Clicked Coordinates: {selectedMarker.latitude},{" "}
                  {selectedMarker.longitude}
                </div>
                <h4>Name: {selectedReport.name}</h4>
                <h4>Type: {selectedReport.type}</h4>
                <h4>Contact: {selectedReport.contact}</h4>
                <div className="relative">
                  <img
                    onClick={() => setZoom(!zoom)}
                    className={`w-full h-40 object-cover cursor-pointer ${
                      zoom ? "hidden" : ""
                    }`}
                    src={selectedReport.imageUrl}
                    alt=""
                  />
                </div>
                <div className="flex justify-center gap-2 mt-4">
                  <img
                    onClick={() => handleSuccess(false)}
                    className="h-8 cursor-pointer"
                    src={notresponded}
                    alt="Not Responded"
                  />
                  <img
                    onClick={() => handleSuccess(true)}
                    className="h-8 cursor-pointer"
                    src={responded}
                    alt="Responded"
                  />
                </div>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
      {zoom && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 cursor-pointer"
          onClick={() => setZoom(false)}
        >
          <img
            className="max-w-none max-h-none w-[30%] h-[100%] object-cover"
            src={selectedReport.imageUrl}
            alt=""
          />
        </div>
      )}
    </div>
  );
};

export default Map;
