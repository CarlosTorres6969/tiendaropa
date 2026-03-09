'use client';

import { useState } from 'react';

interface LoginProps {
  onLogin: (rol: 'cliente' | 'admin' | 'cajero', usuario: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Usuarios de ejemplo
  const usuarios = {
    admin: { password: 'admin123', rol: 'admin' as const, nombre: 'Administrador' },
    cajero: { password: 'cajero123', rol: 'cajero' as const, nombre: 'Cajero Tienda' },
    cliente: { password: 'cliente123', rol: 'cliente' as const, nombre: 'Cliente Demo' },
    juan: { password: '1234', rol: 'cliente' as const, nombre: 'Juan Pérez' },
    maria: { password: '1234', rol: 'cliente' as const, nombre: 'María García' }
  };

  const handleLogin = () => {
    const user = usuarios[usuario.toLowerCase() as keyof typeof usuarios];
    
    if (!usuario || !password) {
      setError('Por favor ingrese usuario y contraseña');
      return;
    }

    if (user && user.password === password) {
      onLogin(user.rol, user.nombre);
    } else {
      setError('Usuario o contraseña incorrectos');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo y Título */}
        <div className="text-center mb-8">
          <div className="bg-white rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center shadow-2xl">
            <span className="text-5xl">👔</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
            Tienda de Ropa
          </h1>
          <p className="text-blue-100 text-lg">Sistema de Facturación</p>
        </div>

        {/* Formulario de Login */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Iniciar Sesión</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usuario
              </label>
              <input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Ingrese su usuario"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-lg font-medium placeholder:text-gray-400 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Ingrese su contraseña"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-lg font-medium placeholder:text-gray-400 bg-white"
              />
            </div>

            {error && (
              <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-lg text-center font-bold">
                {error}
              </div>
            )}

            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 font-bold text-lg shadow-lg"
            >
              Ingresar
            </button>
          </div>

          {/* Información de usuarios demo */}
          <div className="mt-6 pt-6 border-t-2 border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-3 text-center">
              Usuarios de Prueba:
            </p>
            <div className="space-y-2 text-sm">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="font-bold text-gray-900">👤 Cliente (Compras Online)</p>
                <p className="text-gray-700">Usuario: <span className="font-mono font-bold">cliente</span></p>
                <p className="text-gray-700">Contraseña: <span className="font-mono font-bold">cliente123</span></p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <p className="font-bold text-gray-900">🏪 Cajero (Tienda Física)</p>
                <p className="text-gray-700">Usuario: <span className="font-mono font-bold">cajero</span></p>
                <p className="text-gray-700">Contraseña: <span className="font-mono font-bold">cajero123</span></p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <p className="font-bold text-gray-900">🔑 Administrador (Gestión)</p>
                <p className="text-gray-700">Usuario: <span className="font-mono font-bold">admin</span></p>
                <p className="text-gray-700">Contraseña: <span className="font-mono font-bold">admin123</span></p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-white text-sm mt-6 opacity-90">
          © 2026 Tienda de Ropa - Honduras
        </p>
      </div>
    </div>
  );
}
