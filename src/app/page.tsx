"use client";

import { useState } from "react";
import { Button, Stack, CircularProgress, Alert } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import SearchIcon from "@mui/icons-material/Search";

// const API_URL = 'http://localhost:5000';
const API_URL = 'https://tbserver.swmaxnet.com';

export default function Home() {
  const [startDisabled, setStartDisabled] = useState(false);
  const [stopDisabled, setStopDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const handleStart = async () => {
    try {
      setIsLoading(true);
      setStartDisabled(true);
      setStopDisabled(false);
      
      const response = await fetch(`${API_URL}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setMessage(data.message);
      console.log('Started:', data);
    } catch (error) {
      console.error('Error starting:', error);
      setStartDisabled(false);
      setStopDisabled(true);
      setMessage('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStop = async () => {
    try {
      setIsLoading(true);
      setStopDisabled(true);
      setStartDisabled(false);
      
      const response = await fetch(`${API_URL}/stop`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMessage(data.message);
      console.log('Stopped:', data);
    } catch (error) {
      console.error('Error stopping:', error);
      setStopDisabled(false);
      setStartDisabled(true);
      setMessage('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckStatus = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`${API_URL}/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMessage(data.message);
      console.log('Status:', data);
    } catch (error) {
      console.error('Error checking status:', error);
      setMessage('ไม่สามารถตรวจสอบสถานะได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setIsClosing(true);
    setTimeout(() => {
      setMessage(null);
      setIsClosing(false);
    }, 500); // ต้องตรงกับเวลา transition
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div style={{ height: '80px', width: '100%', maxWidth: '400px', marginBottom: '20px' }}>
        <div
          style={{
            opacity: isClosing ? 0 : message ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out',
            visibility: message ? 'visible' : 'hidden',
          }}
        >
          <Alert 
            severity="info" 
            onClose={handleCloseAlert}
            sx={{ 
              width: '100%',
              transition: 'opacity 0.5s ease-in-out',
            }}
          >
            {message}
          </Alert>
        </div>
      </div>
      
      <Stack direction="column" spacing={2} alignItems="center">
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleStart}
            disabled={startDisabled || isLoading}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <PlayArrowIcon />}
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1,
              fontSize: '1rem',
              backgroundColor: '#2196f3',
              width: '150px',
              height: '48px',
              '&:hover': {
                backgroundColor: '#1976d2',
              },
              '& .MuiButton-startIcon': {
                margin: '0 8px 0 0',
                width: '24px',
              },
            }}
          >
            {isLoading ? 'กำลังทำงาน...' : 'เริ่ม'}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleStop}
            disabled={stopDisabled || isLoading}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <StopIcon />}
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1,
              fontSize: '1rem',
              backgroundColor: '#f44336',
              width: '150px',
              height: '48px',
              '&:hover': {
                backgroundColor: '#d32f2f',
              },
              '& .MuiButton-startIcon': {
                margin: '0 8px 0 0',
                width: '24px',
              },
            }}
          >
            {isLoading ? 'กำลังทำงาน...' : 'หยุด'}
          </Button>
        </Stack>
        
        <Button
          variant="contained"
          color="warning"
          onClick={handleCheckStatus}
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
          sx={{
            borderRadius: 2,
            px: 4,
            py: 1,
            fontSize: '1rem',
            backgroundColor: '#ff9800',
            width: '324px',
            height: '48px',
            '&:hover': {
              backgroundColor: '#f57c00',
            },
            '& .MuiButton-startIcon': {
              margin: '0 8px 0 0',
              width: '24px',
            },
          }}
        >
          {isLoading ? 'กำลังตรวจสอบ...' : 'ตรวจสอบสถานะ'}
        </Button>
      </Stack>
    </div>
  );
}
