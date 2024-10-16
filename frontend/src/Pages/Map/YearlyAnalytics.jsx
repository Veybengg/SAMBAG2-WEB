import React, { useEffect, useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { database } from '../../Firebase';
import { ref, get } from 'firebase/database';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import AnalyticsComponent from '../../Components/AnalyticsComponent';
import fire from '../../assets/fire.png';
import thief from '../../assets/thief.png';
import noise from '../../assets/noise.png';
import accident from '../../assets/accident.png';
import others from '../../assets/others.png';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

// Define severity thresholds
const SEVERITY_THRESHOLDS = {
  HIGH: 101,  // 100+ reports is considered High severity
  MEDIUM: 51-100, // 51-100 reports is considered Medium severity
  LOW: 1-50     // 1-50 reports is considered Low severity
};

// Map report types to corresponding icons
const getIncidentImage = (type) => {
  const normalizedType = type.trim().toUpperCase();

  if (normalizedType === 'FIRE') return fire;
  if (normalizedType === 'THIEF') return thief;
  if (normalizedType === 'NOISE') return noise;
  if (normalizedType === 'ACCIDENT') return accident;
  return others; // Default to 'OTHERS' if no match
};

const YearlyAnalytics = () => {
  const [data, setData] = useState([]);
  const [currentYear, setCurrentYear] = useState(2024);
  const [totalReports, setTotalReports] = useState(0);
  const [mostCommonReport, setMostCommonReport] = useState({ type: 'Noise', count: 0 });
  const [severityStats, setSeverityStats] = useState({ high: 0, medium: 0, low: 0 });
  const [resolutionStats, setResolutionStats] = useState({ resolved: 0, unresolved: 0 });

  const fetchData = async (year) => {
    const reportRef = ref(database, 'History');

    try {
      const reportSnapshot = await get(reportRef);
      const reportData = reportSnapshot.val();

      if (reportData) {
        const reportList = Object.values(reportData);
        let totalCount = 0;
        let noiseCount = 0, theftCount = 0, fireCount = 0, accidentCount = 0;
        let resolvedCount = 0, unresolvedCount = 0;
        let highSeverityCount = 0, mediumSeverityCount = 0, lowSeverityCount = 0;

        reportList.forEach(report => {
          const reportDate = new Date(report.timestamp);
          const reportYear = reportDate.getFullYear();

          if (reportYear === year) {
            totalCount++;  // Total report count

            // Count types of incidents
            if (report.type === 'NOISE') noiseCount++;
            else if (report.type === 'THIEF') theftCount++;
            else if (report.type === 'FIRE') fireCount++;
            else if (report.type === 'ACCIDENT') accidentCount++;

            // Check the success field for resolution status
            if (report.success === 'Yes') {
              resolvedCount++;
            } else {
              unresolvedCount++;
            }

            // Count severity levels
            if (report.severity === 'HIGH') highSeverityCount++;
            else if (report.severity === 'MEDIUM') mediumSeverityCount++;
            else if (report.severity === 'LOW') lowSeverityCount++;
          }
        });

        setTotalReports(totalCount);

        // Determine the most common report type
        const mostCommon = Math.max(noiseCount, theftCount, fireCount, accidentCount);
        if (mostCommon === noiseCount) setMostCommonReport({ type: 'Noise', count: noiseCount });
        else if (mostCommon === theftCount) setMostCommonReport({ type: 'Thief', count: theftCount });
        else if (mostCommon === fireCount) setMostCommonReport({ type: 'Fire', count: fireCount });
        else setMostCommonReport({ type: 'Accident', count: accidentCount });

        // Calculate severity based on the number of reports (entire year)
        const highSeverityReports = [fireCount, theftCount, noiseCount, accidentCount].filter(count => count >= SEVERITY_THRESHOLDS.HIGH).length;
        const mediumSeverityReports = [fireCount, theftCount, noiseCount, accidentCount].filter(count => count >= SEVERITY_THRESHOLDS.MEDIUM && count < SEVERITY_THRESHOLDS.HIGH).length;
        const lowSeverityReports = [fireCount, theftCount, noiseCount, accidentCount].filter(count => count < SEVERITY_THRESHOLDS.MEDIUM && count >= SEVERITY_THRESHOLDS.LOW).length;

        setSeverityStats({ high: highSeverityReports, medium: mediumSeverityReports, low: lowSeverityReports });
        setResolutionStats({ resolved: resolvedCount, unresolved: unresolvedCount });

        // Data for the line chart (per month)
        const noiseCounts = [], thiefCounts = [], fireCounts = [], accidentCounts = [];
        for (let month = 0; month < 12; month++) {
          const monthlyReports = reportList.filter(r => new Date(r.timestamp).getMonth() === month && new Date(r.timestamp).getFullYear() === year);
          noiseCounts.push(monthlyReports.filter(r => r.type === 'NOISE').length);
          thiefCounts.push(monthlyReports.filter(r => r.type === 'THIEF').length);
          fireCounts.push(monthlyReports.filter(r => r.type === 'FIRE').length);
          accidentCounts.push(monthlyReports.filter(r => r.type === 'ACCIDENT').length);
        }

        setData({
          noiseCounts,
          thiefCounts,
          fireCounts,
          accidentCounts,
        });
      }
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  useEffect(() => {
    fetchData(currentYear);
  }, [currentYear]);

  const handleYearChange = (e) => {
    setCurrentYear(parseInt(e.target.value, 10));
  };

  const chartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'Noise',
        data: data.noiseCounts || [],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Thief',
        data: data.thiefCounts || [],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Fire',
        data: data.fireCounts || [],
        borderColor: 'rgba(255, 206, 86, 1)',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Accident',
        data: data.accidentCounts || [],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const severityPieData = {
    labels: ['High (100+ Reports)', 'Medium (51-100 Reports)', 'Low (1-50 Reports)'],
    datasets: [{
      data: [severityStats.high, severityStats.medium, severityStats.low],
      backgroundColor: ['#FF0000', '#FFA500', '#FFFF00'],
    }]
  };

  const resolutionPieData = {
    labels: ['Resolved', 'Unresolved'],
    datasets: [{
      data: [resolutionStats.resolved, resolutionStats.unresolved],
      backgroundColor: ['#4CAF50', '#F44336'],
    }]
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        color: 'white',
        font: {
          weight: 'bold',
          size: 12,
        },
        formatter: (value) => `${value}%`,
      },
    }
  };
  
  const pieOptions2 = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        color: 'black',
        font: {
          weight: 'bold',
          size: 12,
        },
        formatter: (value) => `${value}%`,
      },
    }
  };

  return (
    <div>
      <AnalyticsComponent />
      <div className="flex flex-col items-center justify-center space-y-0">
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold mr-4">Yearly Report</h1>
            <label htmlFor="year" className="text-lg mr-2">Select Year:</label>
            <select id="year" value={currentYear} onChange={handleYearChange} className="border p-2 rounded mb-2">
              {Array.from({ length: 11 }, (_, i) => 2024 + i).map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Line Chart */}
        <div className="w-[100rem] max-w-6xl" style={{ height: '260px', marginBottom:'2rem' }}>
          <Line data={chartData} options={pieOptions2} />
        </div>

        {/* Summary Cards */}
        <div className="flex flex-wrap justify-around w-full max-w-5xl space-x-2 items-center ">
          {/* Total Reports */}
          <div className="bg-[#8A252C] text-white p-4 rounded-lg shadow-md text-center w-[200px] h-[165px] flex flex-col justify-center items-center">
            <h2 className="text-md font-bold">Total Reports</h2>
            <p className="text-3xl font-bold">{totalReports}</p>
          </div>

          {/* Most Common Report */}
          <div className="bg-white text-black p-4 rounded-lg shadow-md text-center w-[250px] h-[165px] flex flex-col justify-center items-center">
            <h2 className="text-sm font-bold">MOST COMMON REPORT</h2>
            <div className="flex items-center mt-2">
              <img src={getIncidentImage(mostCommonReport.type)} alt={mostCommonReport.type} className="w-8 h-8 mr-2" />
              <div className="text-left">
                <p className="text-2xl font-bold">{mostCommonReport.count}</p>
              </div>
            </div>
            <div className="mt-2 bg-[#8A252C] text-white font-bold text-xs px-3 py-1 rounded">
              {mostCommonReport.type.toUpperCase()}
            </div>
          </div>

          {/* Incident Severity */}
          <div className="bg-[#8A252C] p-4 rounded-lg shadow-md h-[165px]">
            <h2 className="text-sm font-bold text-white mb-2">Incident Severity</h2>
            <div className="w-full h-[100px] flex justify-center items-center">
              <Pie data={severityPieData} options={pieOptions2} />
            </div>
          </div>

          {/* Resolution Status */}
          <div className="bg-white p-4 rounded-lg shadow-md h-[165px]">
            <div className="text-center">
              <h2 className="text-md font-bold mb-2">Resolution Status</h2>
              <div className="flex justify-around mb-2">
                <div className="flex items-center mr-3">
                  <div className="w-2 h-2 bg-green-500 mr-1"></div>
                  <p className="text-xs">Resolved</p>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 mr-1"></div>
                  <p className="text-xs">Unresolved</p>
                </div>
              </div>
              <div className="w-full h-[80px]">
                <Pie data={resolutionPieData} options={pieOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YearlyAnalytics;
