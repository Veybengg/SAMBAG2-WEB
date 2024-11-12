import React, { useEffect, useState } from "react";
import { faChartSimple, faCaretUp, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from 'react-router-dom';
import Map from '../../Components/Map'; // Assuming the Map component is already present
import Navbar from "../../Components/Navbar";
import StateModal from "../../modals/StateModal";
import ReactPaginate from 'react-paginate';
import fire from '../../assets/fire.png';
import thief from '../../assets/thief.png';
import noise from '../../assets/noise.png';
import accident from '../../assets/accident.png';
import others from '../../assets/others.png';
import { database } from "../../Firebase";
import { ref, onValue } from "firebase/database";
import axios from "axios";
import { dateFormat } from "../../utils/DateFormatter";
import noImg from '../../assets/noImg.jpg';

const locationCache = {}; // Simple in-memory cache for already fetched locations

const fetchAddressWithLocationIQ = async (latitude, longitude, retries = 3) => {
    const apiKey = ''; // Replace with your LocationIQ API Key
    const cacheKey = `${latitude},${longitude}`;

    if (locationCache[cacheKey]) {
        return locationCache[cacheKey];
    }

    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            const response = await axios.get(
                `https://us1.locationiq.com/v1/reverse.php?key=${apiKey}&lat=${latitude}&lon=${longitude}&format=json`
            );
            if (response.data && response.data.address) {
                const { house_number, road, suburb, city, state, country } = response.data.address;
                const address = [
                    house_number, road, suburb, city, state, country
                ].filter(Boolean).join(", ");
                locationCache[cacheKey] = address || "Address not available";
                return locationCache[cacheKey];
            } else {
                locationCache[cacheKey] = "Address not available";
                return "Address not available";
            }
        } catch (error) {
            console.error(`Error fetching address:`, error.message);
            if (attempt < retries - 1) {
                await new Promise(resolve => setTimeout(resolve, (Math.pow(2, attempt) + Math.random()) * 1000));
            } else {
                locationCache[cacheKey] = "Address not available";
                return "Address not available";
            }
        }
    }
};

const MapDashboard = () => {
    const [data, setData] = useState([]);
    const [analytics, setShowAnalytics] = useState(false);
    const [selectedCoordinates, setSelectedCoordinates] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(3);
    const [inputValue, setInputValue] = useState(3);
    const [zoomedImage, setZoomedImage] = useState(null);
    const [loading, setLoading] = useState(false); // Loader state
    const navigate = useNavigate();

    const handleNavigationWithDelay = (path) => {
        setLoading(true); // Show loader
        setTimeout(() => {
            setLoading(false); // Stop loader after 3 seconds
            navigate(path); // Navigate to the desired page
        }, 3000); // 3000 milliseconds = 3 seconds delay
    };

    useEffect(() => {
        const reportRef = ref(database, 'led/reports');
        
        const unsubscribe = onValue(reportRef, async (snapshot) => {
            const reportData = snapshot.val();
            const reportsWithId = reportData ? Object.entries(reportData).map(([id, report]) => ({ id, ...report })) : [];
            reportsWithId.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            const today = new Date();
            const updatedReports = await Promise.all(reportsWithId.map(async (report) => {
                const reportDate = new Date(report.timestamp);
                report.markerType = reportDate > today ? "new" : reportDate.getFullYear() === today.getFullYear() &&
                    reportDate.getMonth() === today.getMonth() &&
                    reportDate.getDate() === today.getDate() ? "today" : "old";

                const location = parseLocation(report.location);
                if (location) {
                    report.address = await fetchAddressWithLocationIQ(location.latitude, location.longitude);
                    report.latitude = location.latitude;
                    report.longitude = location.longitude;
                } else {
                    report.address = "Location not available";
                }

                return report;
            }));

            setData(updatedReports);
        });

        // Cleanup listener on unmount
        return () => unsubscribe();
    }, []);

    const handleCoordinatesClick = (latitude, longitude) => {
        setSelectedCoordinates({ latitude, longitude });
        setZoomLevel(15);
    };

    const parseLocation = (location) => {
        const regex = /Latitude:\s*([0-9.-]+),\s*Longitude:\s*([0-9.-]+)/i;
        const match = location.trim().match(regex);
        if (!match) return null;
        return { latitude: parseFloat(match[1]), longitude: parseFloat(match[2]) };
    };

    const handleItemsPerPageChange = (event) => {
        const value = event.target.value;
        setInputValue(value);
        const newItemsPerPage = parseInt(value, 10);
        if (newItemsPerPage > 0) {
            setItemsPerPage(newItemsPerPage);
            setCurrentPage(1);
        }
    };

    const handleImageClick = (imageUrl) => {
        setZoomedImage(imageUrl);
    };

    const handleImageClose = () => {
        setZoomedImage(null);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentReports = data.slice(indexOfFirstItem, indexOfLastItem);
    const pageCount = Math.ceil(data.length / itemsPerPage);

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected + 1);
    };

    return (
        <div className="h-full w-full flex flex-col relative">
            {loading && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-50 flex justify-center items-center">
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin text-white text-6xl" />
                </div>
            )}
            <Navbar />
            <main className="flex-1 flex overflow-hidden">
                <section className="lg:w-1/3 w-full bg-white h-full flex flex-col z-0">
                    <h1 className="flex justify-center items-center text-xl bg-[#8A252C] text-white py-2.5">
                        Today's Report
                    </h1>
                    <div className="flex items-center justify-center my-4">
                        <label htmlFor="itemsPerPage" className="mr-2">Items per page:</label>
                        <input
                            id="itemsPerPage"
                            type="number"
                            min="1"
                            value={inputValue}
                            onChange={handleItemsPerPageChange}
                            className="border rounded px-2 py-1 w-16 text-center"
                        />
                    </div>
                    <div className="flex justify-around py-2 bg-gray-100 border-b">
                        <div className="flex items-center">
                            <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                            <span className="text-xs">Today's Report</span>
                        </div>
                        <div className="flex items-center">
                            <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                            <span className="text-xs">Selected Report</span>
                        </div>
                        <div className="flex items-center">
                            <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                            <span className="text-xs">Old Report</span>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {currentReports.length > 0 ? (
                            <div className="max-h-[480px] overflow-y-auto">
                                {currentReports.map((report, index) => {
                                    let incidentImage;
                                    switch (report.type) {
                                        case 'FIRE':
                                            incidentImage = fire;
                                            break;
                                        case 'THIEF':
                                            incidentImage = thief;
                                            break;
                                        case 'NOISE':
                                            incidentImage = noise;
                                            break;
                                        case 'ACCIDENT':
                                            incidentImage = accident;
                                            break;
                                        case 'OTHERS':
                                            incidentImage = others;
                                            break;
                                        default:
                                            incidentImage = others;
                                    }

                                    // Use the noImg fallback if the report.imageUrl is not available
                                    const reportImage = report.imageUrl && report.imageUrl !== "No image provided" ? report.imageUrl : noImg;


                                    return (
                                        <div key={index} className="grid grid-cols-4 gap-2 bg-[#FFF6F0] border-b border-[#000000] border-opacity-30 p-2">
                                            <div className="flex justify-center items-center">
                                                <img
                                                    className="h-20 col-span-1 cursor-pointer transition-transform duration-300 hover:scale-110"
                                                    src={reportImage} // Use the reportImage variable here
                                                    alt="Report"
                                                    onClick={() => handleImageClick(reportImage)}
                                                />
                                            </div>
                                            <div className="col-span-2 flex flex-col justify-center ps-6">
                                                <h1 className="font-bold">
                                                    {report.address ? (
                                                        <span
                                                            onClick={() => handleCoordinatesClick(report.latitude, report.longitude)}
                                                            className={`text-blue-500 cursor-pointer ${report.address === "Address not available" ? 'text-gray-500' : ''}`}
                                                        >
                                                            {report.address !== "Address not available" ? report.address : "Location cannot be determined"}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-500">Fetching address...</span>
                                                    )}
                                                    <br />
                                                    <p className="text-[12px] font-medium">File Emergency - {dateFormat(report.timestamp)}</p>
                                                    <div>
                                                        <p className="text-[10px] font-medium flex-1 text-left ">Name: {report.name}</p>
                                                        <p className="text-[10px] font-medium flex-1 text-left">Contact: {report.contact}</p>
                                                    </div>
                                                </h1>
                                            </div>
                                            <div className="flex justify-center items-center">
                                                <img className="h-12" src={incidentImage} alt={report.type} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-center">No reports available.</p>
                        )}
                    </div>
                    {pageCount > 1 && (
                        <div className="flex justify-center mt-4">
                            <ReactPaginate
                                previousLabel={"Previous"}
                                nextLabel={"Next"}
                                pageCount={pageCount}
                                onPageChange={handlePageChange}
                                containerClassName={"pagination flex justify-center gap-2"}
                                activeClassName={"active bg-blue-500 text-white px-3 py-1 rounded-md"}
                                pageClassName={"px-3 py-1 mx-1 bg-gray-200 rounded-md cursor-pointer"}
                                previousClassName={"bg-gray-200 px-3 py-1 rounded-md cursor-pointer"}
                                nextClassName={"bg-gray-200 px-3 py-1 rounded-md cursor-pointer"}
                                disabledClassName={"disabled"}
                            />
                        </div>
                    )}
                </section>

                <div className="flex-1 bg-white flex flex-col">
                    <div className="w-full bg-[#8A252C] grid grid-cols-2 divide-white">
                        <button
                            className="flex-1 py-3 text-center text-white flex items-center justify-center"
                            onClick={() => setShowAnalytics(!analytics)}
                        >
                            <FontAwesomeIcon icon={faChartSimple} className="mr-2" /> Analytics
                            <FontAwesomeIcon icon={faCaretUp} className="ml-1" />
                        </button>
                        <button
                            onClick={() => handleNavigationWithDelay('/history')}
                            className="flex-1 py-3 text-center text-white"
                        >
                            History
                        </button>
                    </div>

                    {analytics && (
                        <div className='grid grid-rows-2 bg-white text-black shadow-md w-[50%]'>
                            <button
                                onClick={() => handleNavigationWithDelay('/monthly-analytics')}
                                className='shadow rounded-sm hover:bg-[#A53400] w-full hover:text-white'
                            >
                                Monthly Reports
                            </button>
                            <button
                                onClick={() => handleNavigationWithDelay('/yearly-analytics')}
                                className='shadow rounded-sm hover:bg-[#A53400] w-full hover:text-white'
                            >
                                Yearly Reports
                            </button>
                        </div>
                    )}

                    <StateModal />
                    <div className="flex-grow overflow-hidden">
                        <Map selectedCoordinates={selectedCoordinates} data={data} zoomLevel={zoomLevel} />
                    </div>
                </div>
            </main>

            {zoomedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 cursor-pointer"
                    onClick={handleImageClose}
                >
                    <img
                        src={zoomedImage}
                        alt="Zoomed Report"
                        className="w-[48%] h-[60%] max-w-full max-h-full object-contain"
                    />
                </div>
            )}
        </div>
    );
};

export default MapDashboard;
