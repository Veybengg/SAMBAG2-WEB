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
  const [severityStats, setSeverityStats] = useState({ high: 0, medium: 0, low: 0 });
  const [reportStats, setReportStats] = useState({ fire: 0, theft: 0, noise: 0, accident: 0, others: 0 });

  // Severity thresholds
  const SEVERITY_THRESHOLDS = {
    HIGH: 10,  // 10 or more reports is considered High severity
    MEDIUM: 6, // 6-9 reports is considered Medium severity
    LOW: 1     // 1-5 reports is considered Low severity
  };

  const fetchData = async (month, year) => {
    const historyRef = ref(database, 'History');
    try {
      const historySnapshot = await get(historyRef);
      const historyData = historySnapshot.val();

      if (historyData) {
        const historyList = Object.values(historyData);
        let fireCount = 0, theftCount = 0, noiseCount = 0, accidentCount = 0, othersCount = 0;
        let totalCount = 0;
        let resolvedCount = 0;
        let unresolvedCount = 0;

        historyList.forEach(report => {
          const reportDate = new Date(report.timestamp);
          if (reportDate.getMonth() === month && reportDate.getFullYear() === year) {
            totalCount++;
            if (report.type === 'FIRE') fireCount++;
            else if (report.type === 'CRIME OR THIEF') theftCount++;
            else if (report.type === 'NOISE') noiseCount++;
            else if (report.type === 'ACCIDENT') accidentCount++;
            else othersCount++;

            if (report.success === "Yes") resolvedCount++;
            else unresolvedCount++;
          }
        });

        setReportStats({ fire: fireCount, theft: theftCount, noise: noiseCount, accident: accidentCount, others: othersCount });
        setTotalReports(totalCount);
        setResolvedReports(resolvedCount);
        setUnresolvedReports(unresolvedCount);

        // Calculate severity based on the number of reports
        const highSeverityCount = [fireCount, theftCount, noiseCount, accidentCount, othersCount].filter(count => count >= SEVERITY_THRESHOLDS.HIGH).length;
        const mediumSeverityCount = [fireCount, theftCount, noiseCount, accidentCount, othersCount].filter(count => count >= SEVERITY_THRESHOLDS.MEDIUM && count < SEVERITY_THRESHOLDS.HIGH).length;
        const lowSeverityCount = [fireCount, theftCount, noiseCount, accidentCount, othersCount].filter(count => count < SEVERITY_THRESHOLDS.MEDIUM && count >= SEVERITY_THRESHOLDS.LOW).length;

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
  const handleMonthChange = (event) => setCurrentMonth(parseInt(event.target.value, 10));

  const barData = {
    labels: ['Fire', 'Crime or Theft', 'Noise', 'Accident', 'Others'],
    datasets: [{
      label: 'Total Reports',
      data: [reportStats.fire, reportStats.theft, reportStats.noise, reportStats.accident, reportStats.others],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FF9F40'],
    }]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: 'black',
        },
      },
      x: {
        ticks: {
          color: 'black',
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white',
        },
      },
      datalabels: {
        color: 'black',
        anchor: 'end',
        align: 'top',
        font: {
          size: 12,
          weight: 'bold',
        },
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
    labels: ['High (10+ Reports)', 'Medium (6-10 Reports)', 'Low (1-5 Reports)'],
    datasets: [{
      data: [severityStats.high, severityStats.medium, severityStats.low],
      backgroundColor: ['#FF0000', '#FFA500', '#FFFF00'],
    }]
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,  // Important to fit the pie inside the container
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: 'white',
          boxWidth: 20,
          padding: 15,
        },
      },
      datalabels: {
        color: 'white',
        font: {
          weight: 'bold',
          size: 9,
        },
        formatter: (value, context) => {
          const total = context.chart._metasets[0].total;
          const percentage = ((value / total) * 100).toFixed(0);
          return `${percentage}%`;
        },
      },
    },
  };

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

          {/* Report Summary Section */}
          <div className="flex flex-col space-y-2 lg:w-[300px] mt-[20px]">
            <div className="h-[90px] bg-[#8A252C] text-white p-2 rounded-lg shadow-md flex flex-col justify-center items-center">
              <h2 className="text-sm font-bold">TOTAL OF REPORTS</h2>
              <p className="text-4xl font-bold">{totalReports}</p>
            </div>

            {/* Resolution Status Section */}
            <div className="bg-white p-4 rounded-lg shadow-md h-[195px]">
              <h2 className="text-md font-bold mb-2">Resolution Status</h2>
              <div className="flex justify-around mb-2">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 mr-2"></div>
                  <p className="text-xs">Resolved</p>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 mr-2"></div>
                  <p className="text-xs">Unresolved</p>
                </div>
              </div>
              <div className="w-full h-[110px] flex justify-center items-center">
                <Pie data={resolutionPieData} options={pieOptions} />
              </div>
            </div>

            {/* Incident Severity Section */}
            <div className="bg-[#8A252C] p-4 rounded-lg shadow-md h-[185px]">
              <h2 className="text-md font-bold text-white">Incident Severity</h2>
              <div className="w-full h-[130px]">
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
