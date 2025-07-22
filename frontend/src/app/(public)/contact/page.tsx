'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from "next/link";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  userId?: number;
}

export default function Contact() {
  const { user, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  //const [isChatOpen, setIsChatOpen] = useState(false);
  //const [chatHistory, setChatHistory] = useState<Message[]>([]); //Este es el mimo de abajo con ChatHistory
  //const [setChatHistory] = useState<Message[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Cargar historial de chat del usuario
  useEffect(() => {
    if (isAuthenticated && user) {
      loadChatHistory();
    }
  }, [isAuthenticated, user]);

  // Auto scroll al final de los mensajes
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = async () => {
    try {
      // Cargar del localStorage como cache rápido
      const savedHistory = localStorage.getItem(`chat_history_${user?.id}`);
      if (savedHistory) {
        const history = JSON.parse(savedHistory);
        setMessages(history);
        //setChatHistory(history);
      }

      // También podrías cargar desde tu backend aquí
      // const history = await chatService.getChatHistory(user.id);
      // setMessages(history);
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const sendMessageToN8N = async (message: string, userId: number) => {
    try {
      // Configurar tu webhook de n8n aquí
      const response = await fetch('https://n8n-bot.fly.dev/webhook/8cc0aa61-2716-43de-8992-f7de0698983d', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          userId: userId,
          timestamp: new Date().toISOString(),
          // Puedes añadir más context del usuario
          userInfo: {
            name: user?.nombre_usuario,
            email: user?.email
          }
        }),
      });

      const botResponse = await response.json();
      return botResponse.message || 'Lo siento, no pude procesar tu mensaje en este momento.';
    } catch (error) {
      console.error('Error sending message to n8n:', error);
      return 'Error de conexión. Por favor intenta de nuevo.';
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !user) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      userId: user.id
    };

    // Agregar mensaje del usuario
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Enviar a n8n y esperar respuesta
      const botResponseText = await sendMessageToN8N(inputMessage, user.id);

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date(),
      };

      const finalMessages = [...updatedMessages, botMessage];
      setMessages(finalMessages);

      // Guardar en localStorage
      localStorage.setItem(`chat_history_${user.id}`, JSON.stringify(finalMessages));

    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: 'Lo siento, hubo un error. Por favor intenta de nuevo.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages([...updatedMessages, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    if (user) {
      localStorage.removeItem(`chat_history_${user.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative text-[#2e3b1f]">
        <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Contáctanos</h1>
            <p className="text-xl md:text-2xl text-[#2e3b1f] max-w-3xl mx-auto">
              Estamos aquí para ayudarte a planificar tu aventura perfecta
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Información de Contacto */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-[#2e3b1f] mb-8">Información de Contacto</h2>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#2E3B1F] via-[#556B2F] via-[#8B5E3C] to-[#4E3620] rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Ubicación</h3>
                    <p className="text-gray-600">Parque Natural Mexiquillo, Durango, México</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#2E3B1F] via-[#556B2F] via-[#8B5E3C] to-[#4E3620] rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Teléfono</h3>
                    <p className="text-gray-600">+52 (618) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#2E3B1F] via-[#556B2F] via-[#8B5E3C] to-[#4E3620] rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">info@mexiquillo.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#2E3B1F] via-[#556B2F] via-[#8B5E3C] to-[#4E3620] rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Horarios</h3>
                    <p className="text-gray-600">Lun - Dom: 8:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulario de Contacto */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Envíanos un mensaje</h3>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Asunto</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="¿En qué podemos ayudarte?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje</label>
                  <textarea
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Escribe tu mensaje aquí..."
                  />
                </div>
                <button
                  className="w-full bg-gradient-to-r from-[#2E3B1F] via-[#556B2F] via-[#8B5E3C] to-[#4E3620] text-white py-3 px-6 rounded-lg font-semibold hover:from-olive-700 hover:to-olive-900 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Enviar Mensaje
                </button>
              </div>
            </div>
          </div>

          {/* Chat Section */}
          <div className="space-y-8">
            {/* Chat Widget */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-[#2E3B1F] via-[#556B2F] via-[#8B5E3C] to-[#4E3620] p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Asistente Virtual</h3>
                      <p className="text-blue-100 text-sm">En línea</p>
                    </div>
                  </div>
                  {messages.length > 0 && (
                    <button
                      onClick={clearChat}
                      className="text-white hover:text-blue-100 p-2"
                      title="Limpiar chat"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {!isAuthenticated ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Inicia sesión para usar el chat</h4>
                  <p className="text-gray-600 mb-6">Necesitas estar autenticado para acceder al asistente virtual</p>
                  <Link
                    href="/login"
                    className="inline-block bg-gradient-to-r from-[#2E3B1F] via-[#556B2F] via-[#8B5E3C] to-[#4E3620] text-white px-6 py-2 rounded-lg font-medium hover:from-olive-700 hover:to-olive-900 transition-all duration-300"
                  >
                    Iniciar Sesión
                  </Link>

                </div>

              ) : (
                <>
                  {/* Chat Messages */}
                  <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {messages.length === 0 ? (
                      <div className="text-center text-gray-500 mt-8">
                        <p>¡Hola {user?.nombre_usuario}! 👋</p>
                        <p>¿En qué puedo ayudarte hoy?</p>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.sender === 'user'
                              ? 'bg-gradient-to-r from-[#2E3B1F] via-[#556B2F] via-[#8B5E3C] to-[#4E3620] text-white'
                              : 'bg-white shadow-md text-gray-800'
                              }`}
                          >
                            <p className="text-sm">{message.text}</p>
                            <p
                              className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}
                            >
                              {new Date(message.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>

                          </div>
                        </div>
                      ))
                    )}

                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white shadow-md rounded-lg px-4 py-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Chat Input */}
                  <div className="p-4 border-t">
                    <form onSubmit={handleSendMessage} className="flex space-x-2">
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Escribe tu mensaje..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isTyping}
                      />
                      <button
                        type="submit"
                        disabled={!inputMessage.trim() || isTyping}
                        className="bg-gradient-to-r from-[#2E3B1F] via-[#556B2F] via-[#8B5E3C] to-[#4E3620] text-white p-2 rounded-lg hover:from-blue-700 hover:to-purple-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </button>
                    </form>
                  </div>
                </>
              )}
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Preguntas Frecuentes</h3>
              <div className="space-y-4">
                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="font-medium">¿Cuáles son los horarios de operación?</span>
                    <svg className="w-5 h-5 text-gray-500 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="p-4 text-gray-600">Estamos abiertos todos los días de 8:00 AM a 6:00 PM. Durante temporadas altas podemos extender nuestros horarios.</p>
                </details>

                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="font-medium">¿Necesito reservar con anticipación?</span>
                    <svg className="w-5 h-5 text-gray-500 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="p-4 text-gray-600">Recomendamos hacer reservaciones, especialmente durante fines de semana y temporadas altas para garantizar disponibilidad.</p>
                </details>

                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="font-medium">¿Qué incluyen los paquetes?</span>
                    <svg className="w-5 h-5 text-gray-500 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="p-4 text-gray-600">Nuestros paquetes incluyen guía especializado, equipo de seguridad, y algunas actividades incluyen alimentación. Los detalles específicos varían por paquete.</p>
                </details>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}