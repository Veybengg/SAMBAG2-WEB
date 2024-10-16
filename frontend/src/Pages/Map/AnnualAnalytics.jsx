import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { database } from '../../Firebase';
import { ref, get } from 'firebase/database';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend, ChartDataLabels);

const MonthlyAnalytics = () => {
  const [data, setData] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [totalReports, setTotalReports] = useState(0);
  const [resolvedReports, setResolvedReports] = useState(0);
  const [unresolvedReports, setUnresolvedReports] = useState(0);
  const [severityStats, setSeverityStats] = useState({ high: 0, medium: 0, low: 0 });
  const [reportStats, setReportStats] = useState({ fire: 0, theft: 0, noise: 0, accident: 0 });

  const fetchData = async (month, year) => {
    const reportRef = ref(database, 'led/reports');

    try {
      const reportSnapshot = await get(reportRef);
      const reportData = reportSnapshot.val();

      if (reportData) {
        const reportList = Object.values(reportData);
        let fireCount = 0, theftCount = 0, noiseCount = 0, accidentCount = 0;
        let totalCount = 0;
        let resolvedCount = 0;
        let unresolvedCount = 0;
        let highSeverityCount = 0, mediumSeverityCount = 0, lowSeverityCount = 0;

        reportList.forEach(report => {
          const reportDate = new Date(report.timestamp);
          if (reportDate.getMonth() === month && reportDate.getFullYear() === year) {
            totalCount++;  // Count the total number of reports for the month

            // Count types of incidents
            if (report.type === 'FIRE') fireCount++;
            else if (report.type === 'THIEF') theftCount++;
            else if (report.type === 'NOISE') noiseCount++;
            else if (report.type === 'ACCIDENT') accidentCount++;

            // Count resolution status
            if (report.resolved) {
              resolvedCount++;  // Assuming 'resolved' is a boolean in the report data
            } else {
              unresolvedCount++;
            }

            // Count incident severity
            if (report.severity === 'HIGH') highSeverityCount++;
            else if (report.severity === 'MEDIUM') mediumSeverityCount++;
            else if (report.severity === 'LOW') lowSeverityCount++;
          }
        });

        // Update state
        setReportStats({ fire: fireCount, theft: theftCount, noise: noiseCount, accident: accidentCount });
        setTotalReports(totalCount);
        setResolvedReports(resolvedCount);
        setUnresolvedReports(unresolvedCount);
        setSeverityStats({ high: highSeverityCount, medium: mediumSeverityCount, low: lowSeverityCount });
      }
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  useEffect(() => {
    fetchData(currentMonth, currentYear);
  }, [currentMonth, currentYear]);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const barData = {
    labels: ['Fire', 'Theft', 'Noise', 'Accident'],
    datasets: [{
      label: 'Total Reports',
      data: [reportStats.fire, reportStats.theft, reportStats.noise, reportStats.accident],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
    }]
  };

  // Pie chart for resolution status based on fetched data
  const resolutionPieData = {
    labels: ['Resolved', 'Unresolved'],
    datasets: [{
      data: [resolvedReports, unresolvedReports],
      backgroundColor: ['#36A2EB', '#FF6384'],
    }]
  };

  // Pie chart for incident severity based on fetched data
  const severityPieData = {
    labels: ['High Severity', 'Medium Severity', 'Low Severity'],
    datasets: [{
      data: [severityStats.high, severityStats.medium, severityStats.low],
      backgroundColor: ['#FF6384', '#FFCD56', '#4BC0C0'],
    }]
  };

  const pieOptions = {
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] p-8">
      {/* Top Navbar */}
      <nav className="bg-[#8A252C] text-white px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">ALERT SYSTEM</h1>
        </div>
        <div className="flex space-x-4">
          <button className="text-white">Today's Report</button>
          <button className="text-white">History</button>
          <button className="text-white">Monthly</button>
        </div>
      </nav>

      {/* Main Section: Bar Chart and Sidebar */}
      <div className="flex mt-8">
        {/* Left Section: Bar Chart */}
        <div className="flex-1 pr-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-4">Report Rate This Month</h2>
            <Bar data={barData} />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-[300px] flex flex-col space-y-6">
          {/* Total Reports */}
          <div className="bg-[#8A252C] text-white p-6 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-bold">Total Reports</h2>
            <p className="text-6xl font-bold">{totalReports}</p> {/* Dynamic data */}
          </div>

          {/* Resolution Status */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-4">Resolution Status</h2>
            <Pie data={resolutionPieData} options={pieOptions} />
          </div>

          {/* Incident Severity */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-4">Incident Severity</h2>
            <Pie data={severityPieData} options={pieOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyAnalytics;
