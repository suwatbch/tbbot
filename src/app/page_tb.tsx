'use client'
import { useState, useEffect } from "react";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import RouteOutlinedIcon from '@mui/icons-material/RouteOutlined';
import AddRoadOutlinedIcon from '@mui/icons-material/AddRoadOutlined';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import StopOutlinedIcon from '@mui/icons-material/StopOutlined';

interface RoutePoint {
  id: number;
  start: string;
}

export default function Home() {
  const [carTypes, setCarTypes] = useState([
    { type: '4W', quantity: 1 },
    { type: '4WJ', quantity: 0 },
    { type: '6W5.5', quantity: 0 },
    { type: '6W7.2', quantity: 0 }
  ]);
  const [routes, setRoutes] = useState<RoutePoint[]>([
    { id: 1, start: '' }
  ]);

  useEffect(() => {
    document.title = "Turbo Bot";
  }, []);

  const handleAddRoute = () => {
    const newId = routes.length + 1;
    setRoutes([...routes, { id: newId, start: '' }]);
  };

  const handleRouteChange = (id: number, field: 'start', value: string) => {
    setRoutes(routes.map(route => 
      route.id === id ? { ...route, [field]: value } : route
    ));
  };

  const handleDeleteRoute = (id: number) => {
    if (routes.length > 1) {
      const updatedRoutes = routes.filter(route => route.id !== id);
      const reindexedRoutes = updatedRoutes.map((route, index) => ({
        ...route,
        id: index + 1,
      }));
      setRoutes(reindexedRoutes);
    }
  };

  const handleAddCarType = () => {
    setCarTypes([...carTypes, { type: '', quantity: 0 }]);
  };

  const handleRemoveCarType = (index: number) => {
    if (carTypes.length > 1) {
      const newCarTypes = carTypes.filter((_, i) => i !== index);
      setCarTypes(newCarTypes);
    }
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
        </div>

        <form className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <DirectionsCarOutlinedIcon className="text-gray-400" />
                ประเภทและจำนวนรถ
              </label>
              <div className="space-y-3 mt-1">
                {carTypes.map((car, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={car.type}
                        onChange={(e) => {
                          const newCarTypes = [...carTypes];
                          newCarTypes[index].type = e.target.value;
                          setCarTypes(newCarTypes);
                        }}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="ประเภท"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="number"
                        min="0"
                        value={car.quantity}
                        onChange={(e) => {
                          const newCarTypes = [...carTypes];
                          newCarTypes[index].quantity = parseInt(e.target.value, 10);
                          setCarTypes(newCarTypes);
                        }}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="จำนวน"
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
                เพิ่มประเภทรถ
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <RouteOutlinedIcon className="text-gray-400" />
                เส้นทางรถ
              </label>
              <div className="space-y-3 mt-1">
                {routes.map((route) => (
                  <div key={route.id} className="flex items-center space-x-4">
                    <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full">
                      <span className="text-blue-600 font-medium">{route.id}</span>
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        required
                        value={route.start}
                        onChange={(e) => handleRouteChange(route.id, 'start', e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="เริ่มต้น"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteRoute(route.id)}
                      className={`p-2 rounded-lg text-red-600 bg-red-100 hover:text-red-700 hover:bg-red-200 transition-colors duration-200 ${routes.length === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={routes.length === 1}
                    >
                      <DeleteOutlineIcon style={{ fontSize: 24 }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              type="button"
              onClick={handleAddRoute}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <AddRoadOutlinedIcon />
              เพิ่มเส้นทางรถ
            </button>

            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
            >
              <PlayArrowOutlinedIcon />
              รับงานอัตโนมัติ
            </button>

            <button
              type="button"
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
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