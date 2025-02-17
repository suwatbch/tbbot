'use client'
import { useState, useEffect } from "react";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import RouteOutlinedIcon from '@mui/icons-material/RouteOutlined';
import AddRoadOutlinedIcon from '@mui/icons-material/AddRoadOutlined';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import StopOutlinedIcon from '@mui/icons-material/StopOutlined';

interface RoutePoint {
  id: number;
  start: string;
  end: string;
}

export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [carCount, setCarCount] = useState('');
  const [routes, setRoutes] = useState<RoutePoint[]>([
    { id: 1, start: '', end: '' }
  ]);

  useEffect(() => {
    document.title = "Turbo Bot";
  }, []);

  const handleAddRoute = () => {
    const newId = routes.length + 1;
    setRoutes([...routes, { id: newId, start: '', end: '' }]);
  };

  const handleRouteChange = (id: number, field: 'start' | 'end', value: string) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement login logic here
    console.log('Login attempt:', { username, password });
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

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <PersonOutlineIcon className="text-gray-400" />
                ชื่อผู้ใช้
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="กรุณากรอกชื่อผู้ใช้"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <LockOutlinedIcon className="text-gray-400" />
                รหัสผ่าน
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="กรุณากรอกรหัสผ่าน"
                />
              </div>
            </div>

            <div>
              <label htmlFor="carCount" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <DirectionsCarOutlinedIcon className="text-gray-400" />
                จำนวนรถที่ว่าง
              </label>
              <div className="mt-1">
                <input
                  id="carCount"
                  name="carCount"
                  type="number"
                  required
                  min="1"
                  value={carCount}
                  onChange={(e) => setCarCount(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="กรุณากรอกจำนวนรถ"
                />
              </div>
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

                    <ArrowRightAltIcon 
                      className="text-gray-400" 
                      style={{ fontSize: 28 }}
                    />

                    <div className="flex-1">
                      <input
                        type="text"
                        required
                        value={route.end}
                        onChange={(e) => handleRouteChange(route.id, 'end', e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="สิ้นสุด"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteRoute(route.id)}
                      className={`p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-200 ${routes.length === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
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