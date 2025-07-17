'use client';

import React, { useState } from 'react';
import { MessageCircle, Instagram, Phone, QrCode, Send, Plus, Settings, CheckCircle } from 'lucide-react';

const IntegrationsPage = () => {
  const [connectedIntegrations] = useState(new Set());

  const integrations = [
    {
      id: 'facebook',
      name: 'Facebook Messenger',
      description: 'Conecta tu página de Facebook para recibir mensajes directos',
      icon: MessageCircle,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      status: 'coming-soon'
    },
    {
      id: 'instagram', 
      name: 'Instagram',
      description: 'Gestiona mensajes directos y comentarios de Instagram',
      icon: Instagram,
      color: 'bg-pink-500',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      status: 'coming-soon'
    },
    {
      id: 'whatsapp-api',
      name: 'WhatsApp Business API',
      description: 'Integración oficial de WhatsApp para empresas',
      icon: Phone,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      status: 'coming-soon'
    },
    {
      id: 'whatsapp-qr',
      name: 'WhatsApp QR',
      description: 'Conexión rápida mediante código QR de WhatsApp Web',
      icon: QrCode,
      color: 'bg-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      status: 'coming-soon'
    },
    {
      id: 'telegram',
      name: 'Telegram',
      description: 'Recibe y responde mensajes de Telegram',
      icon: Send,
      color: 'bg-blue-400',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      status: 'coming-soon'
    },
    {
      id: 'twitter',
      name: 'Twitter/X',
      description: 'Gestiona mensajes directos y menciones',
      icon: MessageCircle,
      color: 'bg-black',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      status: 'coming-soon'
    }
  ];

/*
  const handleConnect = (integrationId: unknown) => {
    if (connectedIntegrations.has(integrationId)) {
      // Desconectar
      const newConnected = new Set(connectedIntegrations);
      newConnected.delete(integrationId);
      setConnectedIntegrations(newConnected);
    } else {
      // Conectar
      setConnectedIntegrations(prev => new Set([...prev, integrationId]));
    }
  };

  const handleConfigure = (integrationId: string) => {
    alert(`Configurando ${integrations.find(i => i.id === integrationId)?.name}`);
  };
*/
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Integraciones</h1>
          <p className="text-gray-600">Conecta tus redes sociales para centralizar todos tus mensajes en un solo lugar</p>
        </div>

        {/* Integration Cards Grid */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {integrations.map((integration) => {
            const Icon = integration.icon;
            const isConnected = connectedIntegrations.has(integration.id);
            const isComingSoon = integration.status === 'coming-soon';
            
            return (
              <div
                key={integration.id}
                className={`bg-white rounded-xl shadow-sm border-2 transition-all duration-300 hover:shadow-md ${
                  isConnected ? integration.borderColor : 'border-gray-200'
                }`}
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg ${integration.bgColor}`}>
                      <Icon className={`h-8 w-8 ${integration.color.replace('bg-', 'text-')}`} />
                    </div>
                    {isConnected && (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                    )}
                    {isComingSoon && (
                      <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full font-medium">
                        Próximamente
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {integration.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {integration.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      disabled
                      className="flex-1 py-2 px-4 rounded-lg font-medium bg-gray-100 text-gray-400 cursor-not-allowed"
                    >
                      No disponible
                    </button>
                  </div>
                </div>

                {/* Status Bar */}
                <div className="h-1 rounded-b-xl bg-gray-200" />
              </div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-gray-600">Conectadas</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Plus className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-gray-600">Disponibles</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Settings className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">6</p>
                <p className="text-gray-600">Próximamente</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">¿Necesitas ayuda?</h3>
          <p className="text-gray-600 mb-4">
            Si tienes problemas configurando alguna integración, consulta nuestra documentación o contacta con soporte.
          </p>
          <div className="flex space-x-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Ver Documentación
            </button>
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              Contactar Soporte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsPage;