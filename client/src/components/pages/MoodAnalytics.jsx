import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import { Line, Bar } from "react-chartjs-2";
import axios from "axios";

function MoodAnalytics() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch journal data
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await axios.get("/api/journal");
        setEntries(response.data);
      } catch (err) {
        setError("Failed to fetch journal entries");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  // Transform data for Chart and build Chart Options
  const processTimeSeriesData = () => {
    if (!entries.length) return null;

    const sortedEntries = [...entries].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    );

    return {
      labels: sortedEntries.map((entry) =>
        new Date(entry.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      ),
      datasets: [
        {
          label: "Mood Score",
          data: sortedEntries.map((entry) => entry.normalizedSentiment),
          borderColor: "#AED9E0",
          backgroundColor: "#B8F2E6",
          tension: 0.4,
        },
      ],
    };
  };

  const processMoodDistribution = () => {
    if (!entries.length) return null;

    const moodCounts = entries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(moodCounts),
      datasets: [
        {
          label: "Mood Distribution",
          data: Object.values(moodCounts),
          backgroundColor: [
            "#FFA69E",
            "#FAF3DD",
            "#B8F2E6",
            "#AED9E0",
            "#5E6472",
          ],
        },
      ],
    };
  };

  return (
    <Container maxWidth="xl">
      <Box className="glass-panel" sx={{ mb: 4, p: 3 }}>
        <Typography
          variant="h4"
          sx={{
            background:
              "linear-gradient(45deg, var(--pink) 30%, var(--blue) 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: "bold",
          }}
        >
          Mood Analytics
        </Typography>
      </Box>

      <Stack spacing={4}>
        {/* Mood Over Time */}
        <Card className="glass-panel">
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Mood Trends Over Time
            </Typography>
            <Box sx={{ height: 400 }}>
              {processTimeSeriesData() && (
                <Line
                  data={processTimeSeriesData()}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                          color: "rgba(255, 255, 255, 0.1)",
                        },
                      },
                      x: {
                        grid: {
                          color: "rgba(255, 255, 255, 0.1)",
                        },
                      },
                    },
                  }}
                />
              )}
            </Box>
          </CardContent>
        </Card>

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={4}
          sx={{ width: "100%" }}
        >
          {/* Mood Distribution */}
          <Card className="glass-panel">
            {" "}
            sx={{ flex: 1 }}
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Mood Distribution
              </Typography>
              <Box sx={{ height: 300 }}>
                {processMoodDistribution() && (
                  <Bar
                    data={processMoodDistribution()}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: {
                            color: "rgba(255, 255, 255, 0.1)",
                          },
                        },
                        x: {
                          grid: {
                            color: "rgba(255, 255, 255, 0.1)",
                          },
                        },
                      },
                    }}
                  />
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Mood Statistics */}
          <Card className="glass-panel">
            {" "}
            sx={{ flex: 1 }}
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Mood Statistics
              </Typography>
              <Box sx={{ p: 2 }}>
                {entries.length > 0 && (
                  <>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      Average Mood Score:{" "}
                      {Math.round(
                        entries.reduce(
                          (acc, entry) => acc + entry.normalizedSentiment,
                          0,
                        ) / entries.length,
                      )}
                      %
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      Total Entries: {entries.length}
                    </Typography>
                    <Typography variant="body1">
                      Most Common Mood:{" "}
                      {
                        Object.entries(
                          entries.reduce((acc, entry) => {
                            acc[entry.mood] = (acc[entry.mood] || 0) + 1;
                            return acc;
                          }, {}),
                        ).sort((a, b) => b[1] - a[1])[0][0]
                      }
                    </Typography>
                  </>
                )}
              </Box>
            </CardContent>
          </Card>
        </Stack>
      </Stack>
    </Container>
  );
}

export default MoodAnalytics;
