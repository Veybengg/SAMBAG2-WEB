import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { database } from '../../Firebase';
import { ref, get } from 'firebase/database';
import AnalyticsComponent from '../../Components/AnalyticsComponent';
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
  const [severityStats, setSeverityStats] = useState({});

  const fetchData = async (month, year) => {
    const historyRef = ref(database, 'History');
    try {
      const historySnapshot = await get(historyRef);
      const historyData = historySnapshot.val();

      if (historyData) {
        const historyList = Object.values(historyData);
        let incidentCounts = { fire: 0, theft: 0, noise: 0, accident: 0, others: 0 };
        let totalCount = 0;
        let resolvedCount = 0;
        let unresolvedCount = 0;

        historyList.forEach(report => {
          const reportDate = new Date(report.timestamp);
          if (reportDate.getMonth() === month && reportDate.getFullYear() === year) {
            totalCount++;
            if (report.type === 'FIRE') incidentCounts.fire++;
            else if (report.type === 'CRIME OR THIEF') incidentCounts.theft++;
            else if (report.type === 'NOISE') incidentCounts.noise++;
            else if (report.type === 'ACCIDENT') incidentCounts.accident++;
            else incidentCounts.others++;

            if (report.success === "Yes") resolvedCount++;
            else unresolvedCount++;
          }
        });

        setSeverityStats(incidentCounts);
        setTotalReports(totalCount);
        setResolvedReports(resolvedCount);
        setUnresolvedReports(unresolvedCount);
      }
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  useEffect(() => {
    fetchData(currentMonth, currentYear);
  }, [currentMonth, currentYear]);

  // Function to calculate the severity labels
  const getSeverityLabels = (incidentCounts) => {
    const incidentArray = Object.entries(incidentCounts);
    incidentArray.sort((a, b) => b[1] - a[1]); // Sort by count

    let severityLabels = { high: '', medium: '', low: '' };
    if (incidentArray.length > 0) severityLabels.high = incidentArray[0][0]; // Highest report
    if (incidentArray.length > 1) severityLabels.medium = incidentArray[1][0]; // Second highest
    if (incidentArray.length > 2) severityLabels.low = incidentArray[2][0]; // Third highest

    return severityLabels;
  };

  // Get severity labels after fetching data
  const severityLabels = getSeverityLabels(severityStats);

  const barData = {
    labels: ['Fire', 'Crime or Theft', 'Noise', 'Accident', 'Others'],
    datasets: [{
      label: 'Total Reports',
      data: [severityStats.fire || 0, severityStats.theft || 0, severityStats.noise || 0, severityStats.accident || 0, severityStats.others || 0],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FF9F40'],
    }]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: 'black' },
      },
      x: {
        ticks: { color: 'black' },
      },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: { color: 'white' },
      },
      datalabels: {
        color: 'black',
        anchor: 'end',
        align: 'top',
        font: { size: 12, weight: 'bold' },
      },
    },
  };

  const resolutionPieData = {
    datasets: [{
      data: [resolvedReports, unresolvedReports],
      backgroundColor: ['#4CAF50', '#F44336'],
    }]
  };

  const severityPieData = {
    labels: ['Fire', 'Crime or Theft', 'Noise', 'Accident', 'Others'],
    datasets: [{
      data: [severityStats.fire || 0, severityStats.theft || 0, severityStats.noise || 0, severityStats.accident || 0, severityStats.others || 0],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FF9F40'],
    }]
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: 'white', // Ensures legend text color is white
          font: {
            size: 12, // Adjusts the font size (optional)
            weight: 'bold', // Optional: Makes the font bold
          },
          boxWidth: 20,
          padding: 15,
          // Custom legend to display High, Medium, Low with matching report colors
          generateLabels: (chart) => {
            const { high, medium, low } = severityLabels;
            const colors = {
              fire: '#FF6384',
              theft: '#36A2EB',
              noise: '#FFCE56',
              accident: '#4BC0C0',
              others: '#FF9F40',
            };
            return [
              {
                text: `High: ${high}`, // Highest reported
                fillStyle: colors[high],  // Color of the most reported incident
                fontColor: 'white', // Set individual legend text color to white
              },
              {
                text: `Medium: ${medium}`, // Second highest
                fillStyle: colors[medium], // Color for the second
                fontColor: 'white', // Set individual legend text color to white
              },
              {
                text: `Low: ${low}`, // Third highest
                fillStyle: colors[low], // Color for the third
                fontColor: 'white', // Set individual legend text color to white
              },
            ];
          }
        }
      },
      datalabels: {
        color: 'white',
        font: { weight: 'bold', size: 9 },
        formatter: (value, context) => {
          const total = context.chart._metasets[0].total;
          const percentage = ((value / total) * 100).toFixed(0);
          return `${percentage}%`;
        },
      },
    },
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const handleMonthChange = (event) => setCurrentMonth(parseInt(event.target.value, 10));

  return (
    <div>
      <AnalyticsComponent />
      <div className="container mx-auto p-2">
        <div className="flex flex-col lg:flex-row items-start gap-6">
          <div className="flex-1">
            <h1 className='text-1xl font-bold'>Monthly Report</h1>
            <div className="mt-2">
              <label htmlFor="month" className="mr-2">Select Month:</label>
              <select
                id="month"
                value={currentMonth}
                onChange={handleMonthChange}
                className="border p-2 rounded"
              >
                {monthNames.map((month, index) => (
                  <option key={index} value={index}>{month}</option>
                ))}
              </select>
            </div>
            <div className="bg-white mt-2 p-6 rounded-lg shadow-md">
              <p className="text-gray-500 font-bold mb-1">Reports for {monthNames[currentMonth]} {currentYear}</p>
              <div className="w-full h-[330px]">
                <Bar data={barData} options={barOptions} />
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-2 lg:w-[300px] mt-[20px]">
            <div className="h-[90px] bg-[#8A252C] text-white p-2 rounded-lg shadow-md flex flex-col justify-center items-center">
              <h2 className="text-sm font-bold">TOTAL OF REPORTS</h2>
              <p className="text-4xl font-bold">{totalReports}</p>
            </div>

            {/* Resolution Status Section */}
            <div className="bg-white p-4 rounded-lg shadow-md h-[195px]">
              <h2 className="text-md font-bold mb-2">Resolution Status</h2>
              <div className="h-[120px] w-full">
                <Pie data={resolutionPieData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>

            {/* Severity Status Section */}
            <div className="bg-[#8A252C] p-4 rounded-lg shadow-md h-[185px]">
              <h2 className="text-md font-bold mb-2 text-white">Severity Status</h2>
              <div className="h-[130px] w-full">
                <Pie data={severityPieData} options={pieOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyAnalytics;
