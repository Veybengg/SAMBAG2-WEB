import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { database } from "../../Firebase";
import { ref, onValue, off } from 'firebase/database';
import markerIconPng from "leaflet/dist/images/marker-icon.png"; // Default Leaflet marker icon
import markerShadowPng from "leaflet/dist/images/marker-shadow.png"; // Marker shadow icon
import backgroundImage from '../../assets/viewing/bgofficials.png'; // Replace with your actual path

// Define a custom Leaflet icon
const customIcon = L.icon({
    iconUrl: markerIconPng,
    shadowUrl: markerShadowPng, // Add the marker shadow
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const ReportsMap = () => {
    const [reports, setReports] = useState([]);
    const mapCenter = [10.3059, 123.8910]; // Sambag 2 Urgellio latitude and longitude

    useEffect(() => {
        const fetchReports = () => {
            const reportsRef = ref(database, 'led/reports');

            try {
                onValue(reportsRef, (snapshot) => {
                    const fetchedData = snapshot.val();

                    const reportsArray = Object.entries(fetchedData || {}).map(([key, value]) => {
                        // Check if location is a string and contains the correct format
                        if (typeof value.location === 'string' && value.location.includes('Latitude') && value.location.includes('Longitude')) {
                            // Split the string based on the format and extract latitude and longitude
                            const latitude = parseFloat(value.location.split('Latitude:')[1].split(',')[0].trim());
                            const longitude = parseFloat(value.location.split('Longitude:')[1].trim());

                            // Ensure valid latitude and longitude values
                            if (!isNaN(latitude) && !isNaN(longitude)) {
                                return {
                                    key,
                                    ...value,
                                    latitude,
                                    longitude,
                                };
                            }
                        }
                        return null; // Skip entries that do not have a valid location
                    }).filter(Boolean); // Filter out invalid or null entries

                    setReports(reportsArray);
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }

            return () => {
                off(reportsRef);
            };
        };

        fetchReports();
    }, []);

    return (
        <div id="events" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', padding: '2rem' }}>
            <div className="text-center text-5xl font-bold text-white mb-10">
                PREVIOUS ALERT
            </div>
            <div className="flex justify-center">
                <div className="w-full max-w-5xl rounded-lg overflow-hidden shadow-lg">
                    <MapContainer
                        center={mapCenter}
                        zoom={16}
                        style={{ height: '500px', width: '100%' }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        {reports.map((report) => (
                            report.latitude && report.longitude && (
                                <Marker
                                    key={report.key}
                                    position={[report.latitude, report.longitude]}
                                    icon={customIcon} // Use custom icon
                                >
                                    <Popup>
                                        <div>
                                            <h3 className="font-bold">Report Type</h3>
                                            <p>{report.type}</p>
                                        </div>
                                    </Popup>
                                </Marker>
                            )
                        ))}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
}

export default ReportsMap;
