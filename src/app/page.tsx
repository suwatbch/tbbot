'use client'
import { useState, useEffect } from "react";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import RouteOutlinedIcon from '@mui/icons-material/RouteOutlined';
import AddRoadOutlinedIcon from '@mui/icons-material/AddRoadOutlined';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import StopOutlinedIcon from '@mui/icons-material/StopOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

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
  type: 'info' | 'error';
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
      selected: false
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

  const addAlert = (message: string, type: 'info' | 'error') => {
    const newAlert = {
      id: Date.now(),
      message,
      type
    };
    setAlerts([newAlert]);
  };

  const removeAlert = (id: number) => {
    setAlerts([]);
  };

  const handleCheckStatus = () => {
    addAlert("กำลังตรวจสอบสถานะการทำงาน...", "info");
  };

  const handleStop = () => {
    addAlert("ระบบได้หยุดการทำงานแล้ว", "error");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg">
        {/* Header */}
        <div className="text-center">
          <DirectionsCarOutlinedIcon 
            style={{ fontSize: 48 }} 
            className="text-blue-600 mb-4"
          />
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
            Turbo Bot
          </h2>
          
          {/* Alert Area */}
          <div className="mt-2 h-12 overflow-y-auto">
            {alerts.map(alert => (
              <div
                key={alert.id}
                className={`flex items-center justify-between p-1.5 rounded-lg text-sm ${
                  alert.type === 'info' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'bg-red-50 text-red-700'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  {alert.type === 'info' ? (
                    <InfoOutlinedIcon className="text-blue-500" style={{ fontSize: 14 }} />
                  ) : (
                    <ErrorOutlineIcon className="text-red-500" style={{ fontSize: 14 }} />
                  )}
                  <span>{alert.message}</span>
                </div>
                <button
                  onClick={() => removeAlert(alert.id)}
                  className="p-0.5 hover:bg-gray-200 rounded-full"
                >
                  <CloseIcon style={{ fontSize: 14 }} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <form className="mt-4 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                <DirectionsCarOutlinedIcon className="text-gray-400" />
                ประเภทและจำนวนรถ
              </label>
              <div className="space-y-3 mt-1">
                {carTypes.map((car, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={car.isActive}
                        onChange={() => handleToggleCarType(index)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={car.type || ''}
                        onChange={(e) => {
                          const newValue = e.target.value.replace(/[^A-Za-z0-9\s.-]/g, '').toUpperCase();
                          const newCarTypes = [...carTypes];
                          newCarTypes[index].type = newValue;
                          setCarTypes(newCarTypes);
                        }}
                        className={`appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${!car.isActive ? 'bg-gray-100 text-gray-500' : ''}`}
                        placeholder="ประเภทรถ"
                        disabled={!car.isActive}
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="number"
                        min="0"
                        value={car.quantity || 0}
                        onChange={(e) => {
                          const newCarTypes = [...carTypes];
                          newCarTypes[index].quantity = parseInt(e.target.value, 10) || 0;
                          setCarTypes(newCarTypes);
                        }}
                        className={`appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${!car.isActive ? 'bg-gray-100 text-gray-500' : ''}`}
                        placeholder="จำนวน"
                        disabled={!car.isActive}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveCarType(index)}
                      className={`p-2 rounded-lg text-red-600 bg-red-100 hover:text-red-700 hover:bg-red-200 transition-colors duration-200 ${carTypes.length === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={carTypes.length === 1}
                    >
                      <DeleteOutlineIcon style={{ fontSize: 24 }} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={handleAddCarType}
                className="mt-3 w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 transition-colors duration-200"
              >
                <DirectionsCarOutlinedIcon />
                เพิ่มประเภทรถ
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                <RouteOutlinedIcon className="text-gray-400" />
                เส้นทางรถ
              </label>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={currentRoute}
                    onChange={(e) => {
                      const newValue = e.target.value.replace(/[^A-Za-z0-9\s.-]/g, '').toUpperCase();
                      setCurrentRoute(newValue);
                    }}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="กรอกเส้นทางเดินรถ"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddRoute}
                  disabled={!currentRoute.trim()}
                  className={`flex justify-center items-center gap-2 px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium ${
                    currentRoute.trim() 
                      ? 'text-blue-600 bg-blue-100 hover:bg-blue-200 focus:ring-blue-300' 
                      : 'text-gray-400 bg-gray-100 cursor-not-allowed'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200`}
                >
                  <RouteOutlinedIcon />
                  เพิ่มเส้นทาง
                </button>
              </div>

              {/* แสดงรายการเส้นทาง */}
              <div className="mt-4 border border-gray-200 rounded-lg p-2">
                {routes.length === 0 ? (
                  <div className="text-center text-gray-500 text-sm">ไม่มีเส้นทางเดินรถ</div>
                ) : (
                  <div className="space-y-1">
                    {routes.map((route) => (
                      <div key={route.id} className="flex items-center space-x-2 p-1 bg-gray-50 rounded-lg text-sm">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={route.selected}
                            onChange={() => handleToggleRouteSelect(route.id)}
                            className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
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

          <div className="space-y-4">
            <button
              type="button"
              onClick={handleCheckStatus}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-400 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-300 transition-colors duration-200"
            >
              <SearchOutlinedIcon />
              ตรวจสอบสถานะ
            </button>

            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-400 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-300 transition-colors duration-200"
            >
              <PlayArrowOutlinedIcon />
              รับงานอัตโนมัติ
            </button>

            <button
              type="button"
              onClick={handleStop}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-400 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-300 transition-colors duration-200"
            >
              <StopOutlinedIcon />
              หยุดการทำงาน
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}