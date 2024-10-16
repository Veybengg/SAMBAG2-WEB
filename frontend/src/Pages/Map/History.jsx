import React, { useState, useEffect, useRef } from "react";
import AnalyticsComponent from "../../Components/AnalyticsComponent";
import { database } from "../../Firebase";
import { get, ref } from "firebase/database";
import ReactPaginate from "react-paginate";
import { useDownloadExcel } from 'react-export-table-to-excel';
import axios from 'axios';
import { dateFormat } from "../../utils/DateFormatter";
import { throttle } from 'lodash';

const History = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(2);
  const [inputValue, setInputValue] = useState(itemsPerPage);
  const [selectedYear, setSelectedYear] = useState('2024');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const tableRef = useRef(null);
  const addressCache = {};

  const parseLocation = (location) => {
    const regex = /Latitude:\s*([0-9.-]+),\s*Longitude:\s*([0-9.-]+)/;
    const match = location.match(regex);
    return match ? { latitude: parseFloat(match[1]), longitude: parseFloat(match[2]) } : null;
  };

  const fetchAddress = throttle(async (latitude, longitude) => {
    const cacheKey = `${latitude},${longitude}`;
    if (addressCache[cacheKey]) return addressCache[cacheKey];

    try {
      const response = await axios.get(
        `https://us1.locationiq.com/v1/reverse.php?key=pk.247696ba66ee834343af9d1e99f35831&lat=${latitude}&lon=${longitude}&format=json`
      );
      addressCache[cacheKey] = response.data?.display_name || "Address not available";
    } catch (error) {
      console.error('Error fetching address:', error);
      addressCache[cacheKey] = "Address not available";
    }
    return addressCache[cacheKey];
  }, 1000);

  const fetchData = async () => {
    const historyRef = ref(database, "History");
    try {
      const historySnapshot = await get(historyRef);
      const historyData = historySnapshot.val();
      const dataWithAddress = historyData ? Object.values(historyData) : [];

      await Promise.all(dataWithAddress.map(async (report) => {
        if (report.location) {
          const location = parseLocation(report.location);
          if (location) {
            report.address = await fetchAddress(location.latitude, location.longitude);
          } else {
            report.address = "Location not available";
          }
        }
      }));

      setData(dataWithAddress);
    } catch (error) {
      console.error("Error fetching history data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter data based on the selected year and date range
  const filteredData = data.filter(item => {
    const itemDate = new Date(item.timestamp);
    const year = itemDate.getFullYear();
    const yearMatches = year.toString() === selectedYear;
    const startDateMatches = startDate ? itemDate >= new Date(startDate) : true;
    const endDateMatches = endDate ? itemDate <= new Date(endDate) : true;
    
    return yearMatches && startDateMatches && endDateMatches;
  });

  const pageCount = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (data) => {
    const selectedPage = data.selected + 1;
    setCurrentPage(selectedPage);
  };

  const handleItemsPerPageChange = (event) => {
    const value = event.target.value;
    const numValue = Number(value);

    if (value === "" || (numValue > 0)) {
      setItemsPerPage(numValue > 0 ? numValue : 1);
      setInputValue(value);
      setCurrentPage(1);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: 'History Table',
    sheet: 'History'
  });

  const years = Array.from({ length: 7 }, (_, i) => 2024 + i);

  return (
    <div>
      <AnalyticsComponent />
      <div className="flex items-center gap-10 mx-[4%] mt-[6%] mb-2">
        <button className="bg-[#801B22] text-white rounded-md py-1 px-2 font-sans" onClick={onDownload}>
          Export to Excel
        </button>
        <div className="flex items-center">
          <span className="mr-2">Items per page:</span>
          <input
            type="number"
            min="1"
            value={inputValue}
            onChange={handleItemsPerPageChange}
            className="border rounded px-2 py-1 w-16"
          />
        </div>
        <div className="flex items-center">
          <span className="mr-2">Filter by Year:</span>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="border rounded px-2 py-1"
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center">
          <span className="mr-2">Start Date:</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>
        <div className="flex items-center">
          <span className="mr-2">End Date:</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>
      </div>

      <div className="relative overflow-auto max-h-96 shadow-md sm:rounded-lg mx-[4%]" ref={tableRef}>
        <table className="min-w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-white uppercase bg-[#801B22]">
            <tr>
              <th scope="col" className="px-6 py-3 border-r border-white border-opacity-50">Type of Report</th>
              <th scope="col" className="px-6 py-3 border-r border-white border-opacity-50">Name</th>
              <th scope="col" className="px-6 py-3 border-r border-white border-opacity-50">Contact Number</th>
              <th scope="col" className="px-6 py-3 border-r border-white border-opacity-50">Time</th>
              <th scope="col" className="px-6 py-3 border-r border-white border-opacity-50">Responded</th>
              <th scope="col" className="px-6 py-3">Location</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, index) => (
              <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.type}</th>
                <td className="px-6 py-4">{item.name}</td>
                <td className="px-6 py-4">{item.contact}</td>
                <td className="px-6 py-4">{item.timestamp ? dateFormat(item.timestamp) : 'N/A'}</td>
                <td className="px-6 py-4">{item.success}</td>
                <td className="px-6 py-4">{item.address || 'Address not available'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pageCount > 0 && (
        <div className="flex justify-end mx-[4%] mt-[2%]">
          <ReactPaginate
            pageCount={pageCount}
            pageRangeDisplayed={3}
            marginPagesDisplayed={2}
            onPageChange={handlePageChange}
            containerClassName="pagination flex justify-end gap-4"
            activeClassName="active bg-[#801B22] px-2 h-[100%] text-white"
            previousLabel="Previous"
            nextLabel="Next"
            previousClassName={`pagination__link ${currentPage === 1 ? 'disabled' : ''}`}
            nextClassName={`pagination__link ${currentPage === pageCount ? 'disabled' : ''}`}
          />
        </div>
      )}
    </div>
  );
};

export default History;
