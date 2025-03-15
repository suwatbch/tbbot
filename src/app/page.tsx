'use client'
import { useState, useEffect, useCallback } from "react";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import RouteOutlinedIcon from '@mui/icons-material/RouteOutlined';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import StopOutlinedIcon from '@mui/icons-material/StopOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const URL_TBSERVICE = 'https://tbservice.swmaxnet.com';

interface RoutePoint {
  id: number;
  start: string;
  selected?: boolean;
}

interface CarType {
  type: string;
  quantity: number;
  isActive: boolean;
}

interface Alert {
  id: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export default function Home() {
  const [carTypes, setCarTypes] = useState<CarType[]>([
    { type: '4W', quantity: 1, isActive: true },
    { type: '4WJ', quantity: 0, isActive: true },
    { type: '6W5.5', quantity: 0, isActive: true },
    { type: '6W7.2', quantity: 0, isActive: true }
  ]);
  const [currentRoute, setCurrentRoute] = useState('');
  const [routes, setRoutes] = useState<RoutePoint[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [statusValue, setStatusValue] = useState<boolean | null>(null);

  useEffect(() => {
    document.title = "Turbo Bot";
    
    // โหลดค่าเริ่มต้นจาก localStorage
    const defaultCarTypes = localStorage.getItem('defaultCarTypes');
    if (defaultCarTypes) {
      setCarTypes(JSON.parse(defaultCarTypes));
    }
    
    // โหลดข้อมูลปัจจุบันจาก localStorage
    const savedCarTypes = localStorage.getItem('carTypes');
    if (savedCarTypes) {
      setCarTypes(JSON.parse(savedCarTypes));
    }

    // โหลดข้อมูลเส้นทางจาก localStorage
    const savedRoutes = localStorage.getItem('routes');
    if (savedRoutes) {
      setRoutes(JSON.parse(savedRoutes));
    }

    // เช็คสถานะ Chrome เมื่อเริ่มต้นโปรแกรม
    handleCheckChrome();
  }, []);

  // บันทึกข้อมูลลง localStorage ทุกครั้งที่มีการเปลี่ยนแปลง
  useEffect(() => {
    localStorage.setItem('carTypes', JSON.stringify(carTypes));
  }, [carTypes]);

  useEffect(() => {
    localStorage.setItem('routes', JSON.stringify(routes));
  }, [routes]);

  const handleAddRoute = () => {
    if (!currentRoute.trim()) return;

    const newId = routes.length + 1;
    setRoutes([...routes, { 
      id: newId, 
      start: currentRoute.trim(),
      selected: true
    }]);
    setCurrentRoute('');
  };

  const handleDeleteRoute = (id: number) => {
    const updatedRoutes = routes.filter(route => route.id !== id);
    const reindexedRoutes = updatedRoutes.map((route, index) => ({
      ...route,
      id: index + 1,
    }));
    setRoutes(reindexedRoutes);
  };

  const handleToggleRouteSelect = (id: number) => {
    setRoutes(routes.map(route => 
      route.id === id ? { ...route, selected: !route.selected } : route
    ));
  };

  const handleAddCarType = () => {
    setCarTypes([...carTypes, { type: '', quantity: 0, isActive: true }]);
  };

  const handleRemoveCarType = (index: number) => {
    if (carTypes.length > 1) {
      const newCarTypes = carTypes.filter((_, i) => i !== index);
      setCarTypes(newCarTypes);
      // บันทึกค่าเริ่มต้นใหม่ลง localStorage
      localStorage.setItem('defaultCarTypes', JSON.stringify(newCarTypes));
    }
  };

  const handleToggleCarType = (index: number) => {
    const newCarTypes = [...carTypes];
    newCarTypes[index].isActive = !newCarTypes[index].isActive;
    setCarTypes(newCarTypes);
  };

  const addAlert = (message: string, type: 'info' | 'success' | 'warning' | 'error') => {
    const newAlert = {
      id: Date.now(),
      message,
      type
    };
    setAlerts([newAlert]);
  };

  const removeAlert = () => {
    setAlerts([]);
  };

  const handleCheckStatus = async () => {
    try {
      const response = await fetch(`${URL_TBSERVICE}/status`, {
        method: 'GET'
      });

      const data = await response.json();
      
      // สร้างข้อความแสดงรายละเอียด
      let statusMessage = '';
      
      // ถ้า currentRound = 0 แสดงแค่ message
      if (data.currentRound === 0) {
        statusMessage = data.message;
      } else {
        // ถ้า currentRound > 0 แสดงรายละเอียดเพิ่มเติม
        statusMessage = data.message;

        // เพิ่มข้อมูลรถที่ว่าง
        if (data.details?.availableCars) {
          if (Array.isArray(data.details.availableCars)) {
            data.details.availableCars.forEach((car: string) => {
              statusMessage += `\nว่าง: ${car}`;
            });
          } else {
            statusMessage += `\nว่าง: ${data.details.availableCars}`;
          }
        }
        
        // เพิ่มข้อมูลรถที่รับงานแล้ว
        if (data.details?.acceptedJobs) {
          if (Array.isArray(data.details.acceptedJobs)) {
            data.details.acceptedJobs.forEach((job: string) => {
              statusMessage += `\nรับงานแล้ว: ${job}`;
            });
          } else {
            statusMessage += `\nรับงานแล้ว: ${data.details.acceptedJobs}`;
          }
        }
      }
      
      // แสดงข้อความตามสถานะ
      const alertType = data.status === 'running' ? 'success' : 'error';
      addAlert(statusMessage, alertType);
      
    } catch {
      addAlert("ไม่สามารถเชื่อมต่อกับ API ได้", "error");
    }
  };

  const handleStop = async () => {
    try {
      const response = await fetch(`${URL_TBSERVICE}/stop`, {
        method: 'GET'
      });

      const data = await response.json();
      addAlert(data.message, "error");
    } catch {
      addAlert("ไม่สามารถเชื่อมต่อกับ API ได้", "error");
    }
  };

  const handleCheckChrome = useCallback(async () => {
    try {
      const response = await fetch(`${URL_TBSERVICE}/check-chrome`, {
        method: 'GET',
      });

      const data = await response.json();
      
      setStatusValue(data.status);

      if (data.status === true) {
        addAlert(data.message, "success");
      } else {
        addAlert(data.message, "warning");
      }
    } catch {
      addAlert("ไม่สามารถเชื่อมต่อกับ API ได้", "error");
    }
  }, []);

  const handleCloseChrome = () => {
    try {
      fetch(`${URL_TBSERVICE}/close-chrome`, {
        method: 'GET'
      });
    } catch {
      console.error('Error closing Chrome');
      addAlert("ไม่สามารถปิด Chrome ได้", "error");
    }
  };

  const handleStartJob = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // เก็บรถที่เลือก (isActive = true)
    const selectedCars = carTypes.filter(car => car.isActive && car.quantity > 0)
      .map(car => ({ type: car.type, quantity: car.quantity }));

    // เก็บเส้นทางที่เลือก (selected = true)
    const selectedRoutes = routes.filter(route => route.selected)
      .map(route => route.start);

    if (selectedCars.length === 0) {
      addAlert("กรุณาเลือกประเภทรถที่ต้องการใช้งาน", "warning");
      return;
    }

    if (selectedRoutes.length === 0) {
      addAlert("กรุณาเลือกเส้นทางที่ต้องการทำงาน", "warning");
      return;
    }

    try {
      const response = await fetch(`${URL_TBSERVICE}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cars: selectedCars,
          routes: selectedRoutes
        })
      });

      const data = await response.json();
      addAlert(data.message, data.status === 'success' ? 'success' : 'error');
    } catch {
      addAlert("ไม่สามารถเชื่อมต่อกับ API ได้", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-6 rounded-xl shadow-lg">
        {/* Header */}
        <div className="text-center">
          <DirectionsCarOutlinedIcon 
            style={{ fontSize: 42 }} 
            className="text-blue-600 mb-2"
          />
          <h2 className="mt-2 text-2xl font-extrabold text-gray-900">
            Turbo Bot
          </h2>
          
          {/* Alert Area */}
          <div className="mt-2 min-h-[2.5rem]">
            {alerts.map(alert => (
              <div
                key={alert.id}
                className={`flex items-start gap-1.5 p-1.5 rounded-lg text-xs whitespace-pre-line ${
                  alert.type === 'info' 
                    ? 'bg-blue-50 text-blue-700'
                    : alert.type === 'success'
                    ? 'bg-green-50 text-green-700'
                    : alert.type === 'warning'
                    ? 'bg-orange-50 text-orange-700'
                    : 'bg-red-50 text-red-700'
                }`}
              >
                {alert.type === 'info' ? (
                  <InfoOutlinedIcon className="text-blue-500 mt-0.5 ml-1 flex-shrink-0" style={{ fontSize: 14 }} />
                ) : alert.type === 'success' ? (
                  <PlayArrowOutlinedIcon className="text-green-500 mt-0.5 ml-1 flex-shrink-0" style={{ fontSize: 14 }} />
                ) : alert.type === 'warning' ? (
                  <ErrorOutlineIcon className="text-orange-500 mt-0.5 ml-1 flex-shrink-0" style={{ fontSize: 14 }} />
                ) : (
                  <ErrorOutlineIcon className="text-red-500 mt-0.5 ml-1 flex-shrink-0" style={{ fontSize: 14 }} />
                )}
                <span className="flex-1 mt-0.5">{alert.message}</span>
                <button
                  onClick={() => removeAlert()}
                  className="p-0.5 hover:bg-gray-200 rounded-full flex-shrink-0"
                >
                  <CloseIcon style={{ fontSize: 14 }} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <form className="space-y-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                <DirectionsCarOutlinedIcon className="text-gray-400" style={{ fontSize: 20 }} />
                ประเภทและจำนวนรถ
              </label>
              <div className="space-y-2 mt-2">
                {carTypes.map((car, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-none">
                      <input
                        type="checkbox"
                        checked={car.isActive}
                        onChange={() => handleToggleCarType(index)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="flex-[2]">
                      <input
                        type="text"
                        value={car.type || ''}
                        onChange={(e) => {
                          const newValue = e.target.value.replace(/[^A-Za-z0-9\s.-]/g, '').toUpperCase();
                          const newCarTypes = [...carTypes];
                          newCarTypes[index].type = newValue;
                          setCarTypes(newCarTypes);
                        }}
                        className={`appearance-none block w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${!car.isActive ? 'bg-gray-100 text-gray-500' : ''}`}
                        placeholder="ประเภทรถ"
                        disabled={!car.isActive}
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="number"
                        min="0"
                        value={car.quantity === 0 ? '' : car.quantity}
                        onChange={(e) => {
                          const newCarTypes = [...carTypes];
                          newCarTypes[index].quantity = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
                          setCarTypes(newCarTypes);
                        }}
                        className={`appearance-none block w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${!car.isActive ? 'bg-gray-100 text-gray-500' : ''}`}
                        placeholder="จำนวน"
                        disabled={!car.isActive}
                      />
                    </div>
                    <div className="flex-none">
                      <button
                        type="button"
                        onClick={() => handleRemoveCarType(index)}
                        className={`p-1 rounded-lg text-red-600 bg-red-100 hover:text-red-700 hover:bg-red-200 transition-colors duration-200 ${carTypes.length === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={carTypes.length === 1}
                      >
                        <DeleteOutlineIcon style={{ fontSize: 16 }} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={handleAddCarType}
                className="mt-2 w-full flex justify-center items-center gap-2 py-1.5 px-3 text-sm border border-transparent rounded-lg shadow-sm font-medium text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 transition-colors duration-200"
              >
                <DirectionsCarOutlinedIcon style={{ fontSize: 16 }} />
                เพิ่มประเภทรถ
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                <RouteOutlinedIcon className="text-gray-400" style={{ fontSize: 20 }} />
                เส้นทางรถ
              </label>
              <div className="flex gap-3">
                <div className="flex-[3]">
                  <input
                    type="text"
                    value={currentRoute}
                    onChange={(e) => {
                      const newValue = e.target.value.replace(/[^A-Za-z0-9\s.-]/g, '').toUpperCase();
                      setCurrentRoute(newValue);
                    }}
                    className="appearance-none block w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="กรอกเส้นทางเดินรถ"
                  />
                </div>
                <div className="flex-none">
                  <button
                    type="button"
                    onClick={handleAddRoute}
                    disabled={!currentRoute.trim()}
                    className={`flex justify-center items-center gap-2 px-3 py-1.5 text-sm border border-transparent rounded-lg shadow-sm font-medium ${
                      currentRoute.trim() 
                        ? 'text-blue-600 bg-blue-100 hover:bg-blue-200 focus:ring-blue-300' 
                        : 'text-gray-400 bg-gray-100 cursor-not-allowed'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200`}
                  >
                    <RouteOutlinedIcon style={{ fontSize: 16 }} />
                    เพิ่มเส้นทาง
                  </button>
                </div>
              </div>

              {/* แสดงรายการเส้นทาง */}
              <div className="mt-2 border border-gray-200 rounded-lg p-2">
                {routes.length === 0 ? (
                  <div className="text-center text-gray-500 text-sm">ไม่มีเส้นทางเดินรถ</div>
                ) : (
                  <div className="space-y-2">
                    {routes.map((route) => (
                      <div key={route.id} className="flex items-center gap-2 p-1.5 bg-gray-50 rounded-lg text-sm">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={route.selected}
                            onChange={() => handleToggleRouteSelect(route.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </div>
                        <div className="w-5 h-5 flex items-center justify-center bg-blue-100 rounded-full">
                          <span className="text-blue-600 font-medium text-xs">{route.id}</span>
                        </div>
                        <div className="flex-1">
                          <span className="text-gray-700 text-sm">{route.start}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteRoute(route.id)}
                          className="p-1 rounded-lg text-red-600 bg-red-100 hover:text-red-700 hover:bg-red-200 transition-colors duration-200"
                        >
                          <DeleteOutlineIcon style={{ fontSize: 16 }} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={handleCheckStatus}
              disabled={!statusValue}
              className={`w-full flex justify-center items-center gap-2 py-1.5 px-3 text-sm border border-transparent rounded-lg shadow-sm font-medium text-white ${
                !statusValue 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-orange-400 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-300'
              } transition-colors duration-200`}
            >
              <SearchOutlinedIcon style={{ fontSize: 16 }} />
              ตรวจสอบสถานะ
            </button>

            <button
              type="submit"
              onClick={handleStartJob}
              disabled={!statusValue}
              className={`w-full flex justify-center items-center gap-2 py-1.5 px-3 text-sm border border-transparent rounded-lg shadow-sm font-medium text-white ${
                !statusValue 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-400 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-300'
              } transition-colors duration-200`}
            >
              <PlayArrowOutlinedIcon style={{ fontSize: 16 }} />
              รับงานอัตโนมัติ
            </button>

            <button
              type="button"
              onClick={handleStop}
              disabled={!statusValue}
              className={`w-full flex justify-center items-center gap-2 py-1.5 px-3 text-sm border border-transparent rounded-lg shadow-sm font-medium text-white ${
                !statusValue 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-red-400 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-300'
              } transition-colors duration-200`}
            >
              <StopOutlinedIcon style={{ fontSize: 16 }} />
              หยุดการทำงาน
            </button>

            <div className="flex justify-between items-center text-sm px-1">
              <button
                type="button"
                onClick={handleCheckChrome}
                className="text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center gap-1"
              >
                <CheckCircleOutlineIcon style={{ fontSize: 14 }} />
                Check-Chrome
              </button>
              {!statusValue ? (
                <button
                  type="button"
                  onClick={handleCloseChrome}
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center gap-1"
                >
                  <RestartAltIcon style={{ fontSize: 14 }} />
                  Reset-Chrome
                </button>
              ) : null}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}