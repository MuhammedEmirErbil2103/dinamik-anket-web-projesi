import React, { useEffect, useState, useCallback } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useParams } from "react-router-dom";

// Register necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, ArcElement, Title, Tooltip, Legend);

const HocaGrafik = () => {
  const [chartsData, setChartsData] = useState([]);
  const { id } = useParams();
  const apiUrl = `https://localhost:7230/api/Report/GetAllQuestionsReport/${id}`;

  // Fetch data from API and render the charts
  const fetchAndRenderChart = useCallback(async () => {
    try {
      const response = await fetch(apiUrl);
      if (response.ok) {
        const data = await response.json();
        console.log("API'den Gelen Veri:", data);

        // Group data by questionText
        const groupedData = groupBy(data, "questionText");

        // Prepare the charts data
        const charts = Object.keys(groupedData).map((questionText, index) => {
          const questionData = groupedData[questionText];
          const optionTexts = questionData.map((item) => item.optionText.trim());
          const selectionCounts = questionData.map((item) => item.selectionCount);

          // Return chart data for this question
          return {
            questionText: `Soru ${index + 1}: ${questionText}`, // Sorunun başına sırasını ekliyoruz
            optionTexts,
            selectionCounts,
          };
        });

        setChartsData(charts); // Update the state with the charts data
      } else {
        console.error("API request failed with status:", response.status);
        alert("Veri alınamadı. Lütfen API'yi kontrol edin.");
      }
    } catch (error) {
      console.error("Error fetching data from API:", error);
    }
  }, [apiUrl]);

  // Helper function to group data by a specific key
  const groupBy = (array, key) => {
    return array.reduce((result, currentItem) => {
      const groupKey = currentItem[key].trim();
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(currentItem);
      return result;
    }, {});
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchAndRenderChart();
  }, [fetchAndRenderChart]);

  return (
    <div className="container">
      <h1>Soru Bazlı Değerlendirmeler</h1>
      <div className="charts-container">
        {chartsData.map((chartData, index) => (
          <div key={chartData.questionText} className="chart-container">
            <h2>{chartData.questionText}</h2>
            <Pie
              data={{
                labels: chartData.optionTexts,
                datasets: [
                  {
                    label: `Seçenekler`,
                    data: chartData.selectionCounts,
                    backgroundColor: [
                      "rgba(255, 99, 132, 0.6)",
                      "rgba(54, 162, 235, 0.6)",
                      "rgba(255, 206, 86, 0.6)",
                      "rgba(75, 192, 192, 0.6)",
                      "rgba(153, 102, 255, 0.6)",
                      "rgba(255, 159, 64, 0.6)",
                    ],
                    borderColor: [
                      "rgba(255, 99, 132, 1)",
                      "rgba(54, 162, 235, 1)",
                      "rgba(255, 206, 86, 1)",
                      "rgba(75, 192, 192, 1)",
                      "rgba(153, 102, 255, 1)",
                      "rgba(255, 159, 64, 1)",
                    ],
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1.5,
                plugins: {
                  legend: {
                    display: true,
                    position: "top",
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        return `${context.label}: ${context.raw}`;
                      },
                    },
                  },
                },
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HocaGrafik;
