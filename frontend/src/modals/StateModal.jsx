import React, { useEffect, useState } from 'react';
import { database } from '../Firebase';
import { ref, onValue, update } from 'firebase/database';

const StateModal = () => {
    const [state, setState] = useState(null);
    const [latestReport, setLatestReport] = useState(null);
    const [locationDetails, setLocationDetails] = useState(null); // State for location details

    useEffect(() => {
        const stateRef = ref(database, 'led/state');
        const unsubscribe = onValue(stateRef, (snapshot) => {
            const stateData = snapshot.val();
            setState(stateData);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (state > 0) {
            const reportRef = ref(database, 'led/reports');
            const unsubscribe = onValue(reportRef, (snapshot) => {
                const reportData = snapshot.val();
                if (reportData) {
                    const reportValues = Object.values(reportData);
                    const newReport = reportValues[reportValues.length - 1]; // Get the latest report
                    setLatestReport(newReport);
                }
            });

            return () => unsubscribe();
        }
    }, [state]);

    useEffect(() => {
        if (latestReport) {
            const { latitude, longitude } = parseLocation(latestReport.location); // Adjust based on your data structure
            if (latitude && longitude) {
                fetchLocationDetails(latitude, longitude);
            }
        }
    }, [latestReport]);

    const fetchLocationDetails = async (lat, lon) => {
        try {
            const response = await fetch(`https://us1.locationiq.com/v1/reverse.php?key=${"pk.247696ba66ee834343af9d1e99f35831"}&lat=${lat}&lon=${lon}&format=json`);
            const data = await response.json();
            setLocationDetails(data); // Store location details
        } catch (error) {
            console.error('Error fetching location details:', error);
        }
    };

    const parseLocation = (location) => {
        const regex = /Latitude:\s*([0-9.-]+),\s*Longitude:\s*([0-9.-]+)/;
        const match = location.match(regex);
        return match ? { latitude: parseFloat(match[1]), longitude: parseFloat(match[2]) } : {};
    };

    const handleOffAlarm = async () => {
        const stateRef = ref(database, 'led');

        try {
            await update(stateRef, { state: 0 });
            setState(0);
            setLatestReport(null); 
            setLocationDetails(null); 
        } catch (error) {
            console.error('Error updating state:', error);
        }
    };

    return (
        <div className={`${state > 0 ? 'fixed w-[75%] h-screen z-50 flex justify-center items-center bg-black bg-opacity-50' : ''}`}>
            {state > 0 && latestReport && (
                <div className='bg-white p-3 rounded shadow-lg flex flex-col gap-4 w-[30%] mb-20'>
                    <p className='flex justify-center items-center text-sm'>Latest report</p>
                    {latestReport.imageUrl && (
                        <img className="h-[25vh] w-[20vw] " src={latestReport.imageUrl} alt="Report" />
                    )}
                    {locationDetails && (
                        <div>
                            <p className='text-sm'>Location: {locationDetails.display_name}</p>
                        </div>
                    )}
                    <div className='grid grid-cols-2 gap-3'>
                    <p className='flex'>Type:&nbsp;<h5 className='font-serif'>{latestReport.name}</h5></p><br/>
                    <p className='flex'>Name:&nbsp;<h5 className='font-serif'>{latestReport.type}</h5></p><br/>
                    <p className='flex'>Contact:&nbsp;<h1 className='font-serif'>{latestReport.contact}</h1></p>
                    </div>
                    <button onClick={handleOffAlarm} className='bg-[#8A252C] text-white rounded-md'>Off Alarm</button>
                </div>
            )}
        </div>
    );
};

export default StateModal;
