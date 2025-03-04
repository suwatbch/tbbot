"use client";

import { useState } from "react";
import { Button, Stack } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";

export default function Home() {
  const [isRunning, setIsRunning] = useState(false);

  const handleStart = () => {
    setIsRunning(true);
    fetch('http://localhost:5000/fetch-table')
      .then(response => response.json())
      .then(data => {
        console.log('Data fetched:', data);
        // Handle the data fetched from the server
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const handleStop = () => {
    setIsRunning(false);
    // Add your stop logic here
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleStart}
          startIcon={<PlayArrowIcon />}
          sx={{
            borderRadius: 2,
            px: 4,
            py: 1,
            fontSize: '1rem',
            backgroundColor: '#2196f3',
            '&:hover': {
              backgroundColor: '#1976d2',
            },
          }}
        >
          เริ่ม
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleStop}
          startIcon={<StopIcon />}
          sx={{
            borderRadius: 2,
            px: 4,
            py: 1,
            fontSize: '1rem',
            backgroundColor: '#f44336',
            '&:hover': {
              backgroundColor: '#d32f2f',
            },
          }}
        >
          หยุด
        </Button>
      </Stack>
    </div>
  );
}
