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

const getIncidentImage = (type) => {
  const normalizedType = type.trim().toUpperCase();

  if (normalizedType === 'FIRE') return fire;
  if (normalizedType === 'CRIME OR THIEF') return thief;
  if (normalizedType === 'NOISE') return noise;
  if (normalizedType === 'ACCIDENT') return accident;
  return others;
};

const YearlyAnalytics = () => {
  const [data, setData] = useState({
    noiseCounts: [],
    thiefCounts: [],
    fireCounts: [],
    accidentCounts: [],
    othersCounts: [],
  });
  const [currentYear, setCurrentYear] = useState(2024);
  const [totalReports, setTotalReports] = useState(0);
  const [mostCommonReport, setMostCommonReport] = useState({ type: 'Noise', count: 0 });
  const [severityStats, setSeverityStats] = useState({ fire: 0, theft: 0, noise: 0, accident: 0, others: 0 });
  const [resolutionStats, setResolutionStats] = useState({ resolved: 0, unresolved: 0 });

  const fetchData = async (year) => {
    const reportRef = ref(database, 'History');

    try {
      const reportSnapshot = await get(reportRef);
      const reportData = reportSnapshot.val();

      if (reportData) {
        const reportList = Object.values(reportData);
        let totalCount = 0;
        let noiseCount = 0, theftCount = 0, fireCount = 0, accidentCount = 0, othersCount = 0;
        let resolvedCount = 0, unresolvedCount = 0;

        reportList.forEach(report => {
          const reportDate = new Date(report.timestamp);
          const reportYear = reportDate.getFullYear();

          if (reportYear === year) {
            totalCount++;
            if (report.type === 'NOISE') noiseCount++;
            else if (report.type === 'CRIME OR THIEF') theftCount++;
            else if (report.type === 'FIRE') fireCount++;
            else if (report.type === 'ACCIDENT') accidentCount++;
            else othersCount++;

            if (report.success === 'Yes') {
              resolvedCount++;
            } else {
              unresolvedCount++;
            }
          }
        });

        setTotalReports(totalCount);
        const mostCommon = Math.max(noiseCount, theftCount, fireCount, accidentCount, othersCount);
        if (mostCommon === noiseCount) setMostCommonReport({ type: 'Noise', count: noiseCount });
        else if (mostCommon === theftCount) setMostCommonReport({ type: 'Thief', count: theftCount });
        else if (mostCommon === fireCount) setMostCommonReport({ type: 'Fire', count: fireCount });
        else if (mostCommon === accidentCount) setMostCommonReport({ type: 'Accident', count: accidentCount });
        else setMostCommonReport({ type: 'Others', count: othersCount });

        let incidentCounts = { fire: fireCount, theft: theftCount, noise: noiseCount, accident: accidentCount, others: othersCount };
        
        setSeverityStats(incidentCounts);
        setResolutionStats({ resolved: resolvedCount, unresolved: unresolvedCount });

        const noiseCounts = [], thiefCounts = [], fireCounts = [], accidentCounts = [], othersCounts = [];
        for (let month = 0; month < 12; month++) {
          const monthlyReports = reportList.filter(r => new Date(r.timestamp).getMonth() === month && new Date(r.timestamp).getFullYear() === year);
          noiseCounts.push(monthlyReports.filter(r => r.type === 'NOISE').length);
          thiefCounts.push(monthlyReports.filter(r => r.type === 'CRIME OR THIEF').length);
          fireCounts.push(monthlyReports.filter(r => r.type === 'FIRE').length);
          accidentCounts.push(monthlyReports.filter(r => r.type === 'ACCIDENT').length);
          othersCounts.push(monthlyReports.filter(r => r.type === 'OTHERS').length);
        }

        setData({
          noiseCounts,
          thiefCounts,
          fireCounts,
          accidentCounts,
          othersCounts,
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

  const getSeverityLabels = (incidentCounts) => {
    const incidentArray = Object.entries(incidentCounts)
      .filter(([_, count]) => count > 0);
  
    incidentArray.sort((a, b) => b[1] - a[1]);
  
    let severityLabels = { high: '', medium: '', low: '' };
    if (incidentArray.length > 0) severityLabels.high = incidentArray[0][0];
    if (incidentArray.length > 1) severityLabels.medium = incidentArray[1][0];
    if (incidentArray.length > 2) severityLabels.low = incidentArray[2][0];
  
    return severityLabels;
  };

  const severityLabels = getSeverityLabels(severityStats);

  const chartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'Noise',
        data: data.noiseCounts,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Thief',
        data: data.thiefCounts,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Fire',
        data: data.fireCounts,
        borderColor: 'rgba(255, 206, 86, 1)',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Accident',
        data: data.accidentCounts,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Others',
        data: data.othersCounts,
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],  
  };

  const severityPieData = {
    labels: ['Fire', 'Crime or Theft', 'Noise', 'Accident', 'Others'].filter((_, index) => {
      const counts = [severityStats.fire, severityStats.theft, severityStats.noise, severityStats.accident, severityStats.others];
      return counts[index] > 0;
    }),
    datasets: [{
      data: [severityStats.fire, severityStats.theft, severityStats.noise, severityStats.accident, severityStats.others].filter(count => count > 0),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FF9F40'],
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
    }
  };
  
  const pieOptions2 = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    }
  };

  const pieOptions3 = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: 'white',
          font: {
            size: 12,
            weight: 'bold',
          },
          boxWidth: 20,
          padding: 15,
          generateLabels: () => {
            const colors = {
              fire: '#FF6384',
              theft: '#36A2EB',
              noise: '#FFCE56',
              accident: '#4BC0C0',
              others: '#FF9F40',
            };
            return [
              { text: `High: ${severityLabels.high}`, fillStyle: colors[severityLabels.high], fontColor: 'white' },
              { text: `Medium: ${severityLabels.medium}`, fillStyle: colors[severityLabels.medium] },
              { text: `Low: ${severityLabels.low}`, fillStyle: colors[severityLabels.low] },
            ];
          },
        },
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

  return (
    <>
    <AnalyticsComponent/>
    <div className="flex flex-col items-center justify-center p-4">
      
      <div className="flex flex-col items-center justify-center w-full">
        <div className="flex flex-col items-center mb-4">
          <div className="flex items-center mb-2">
            <h1 className="text-xl font-bold mr-4">Yearly Report</h1>
            <label htmlFor="year" className="text-lg mr-2">Select Year:</label>
            <select id="year" value={currentYear} onChange={handleYearChange} className="border p-2 rounded">
              {Array.from({ length: 11 }, (_, i) => 2024 + i).map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Line Chart */}
        <div className="w-full max-w-6xl" style={{ height: '260px', marginBottom: '2rem' }}>
          <Line data={chartData} options={pieOptions2} />
        </div>

        {/* Summary Cards */}
        <div className="flex flex-wrap justify-around w-full max-w-5xl space-y-4 md:space-y-0 md:space-x-4">
          {/* Total Reports */}
          <div className="bg-[#8A252C] text-white p-4 rounded-lg shadow-md text-center flex flex-col justify-center items-center w-full md:w-[200px]">
            <h2 className="text-md font-bold">Total Reports</h2>
            <p className="text-3xl font-bold">{totalReports}</p>
          </div>

          {/* Most Common Report */}
          <div className="bg-white text-black p-4 rounded-lg shadow-md text-center flex flex-col justify-center items-center w-full md:w-[250px]">
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
          <div className="bg-[#8A252C] p-4 rounded-lg shadow-md w-full md:w-[250px]">
            <h2 className="text-sm font-bold text-white mb-2">Incident Severity</h2>
            <div className="w-full h-[100px] flex justify-center items-center">
              <Pie data={severityPieData} options={pieOptions3} />
            </div>
          </div>

          {/* Resolution Status */}
          <div className="bg-white p-4 rounded-lg shadow-md w-full md:w-[250px]">
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
    </>
  );
};

export default YearlyAnalytics;
