'use client'
import { useEffect, useState } from "react";
import axios from "axios";

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  password: string;
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://tbservice.swmaxnet.com/users');
        // const response = await axios.get('http://localhost:3000/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error getting users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <div 
              key={user.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">#{user.id}</span>
                <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 text-sm">{user.username[0].toUpperCase()}</span>
                </div>
              </div>
              <div className="mt-2">
                <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{user.username}</p>
                <p className="text-sm text-gray-400 mt-1">{user.email}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
