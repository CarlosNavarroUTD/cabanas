'use client'

import { motion } from 'framer-motion'
import CountUp from 'react-countup'
import Image from 'next/image'
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react'
import 'swiper/css'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useCabanas } from '@/hooks/useCabanas'
import { Users, Star, PawPrint, Home } from 'lucide-react'
import { CabanaList } from '@/types/cabanasTypes'

// Configuración del slider
const sliderSettings = {
  slidesPerView: 1,
  spaceBetween: 50,
  breakpoints: {
    480: {
      slidesPerView: 1
    },
    600: {
      slidesPerView: 2
    },
    750: {
      slidesPerView: 3
    },
    1100: {
      slidesPerView: 4
    }
  }
}

const Hero = () => {
  const { cabanas, loading, fetchCabanas } = useCabanas();
  const [featuredCabanas, setFeaturedCabanas] = useState<CabanaList[]>([]);

  useEffect(() => {
    fetchCabanas();
  }, []);

  useEffect(() => {
    if (cabanas.length > 0) {
      // Seleccionar las primeras 4 cabañas o las disponibles
      const availableCabanas = cabanas.filter(cabana => cabana.estado === 'disponible');
      setFeaturedCabanas(availableCabanas.slice(0, 4));
    }
  }, [cabanas]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <>
      <section className="text-[#2e3b1f] bg-white relative pb-8 z-10 min-h-[500px]">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-end justify-around gap-10 lg:gap-40">
          {/* Lado izquierdo */}
          <div className="flex flex-col items-start gap-12">
            <div className="relative z-10">
              <div className="h-16 w-16 bg-[#cfe0b0] rounded-full absolute -right-12 -top-4 -z-10" />
              <motion.h1
                initial={{ y: '2rem', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 2, type: 'spring' }}
                className="font-semibold text-4xl sm:text-5xl lg:text-6xl leading-tight lg:leading-[4rem] text-[#2e3b1f]"
              >
                Descubre <br />
                Las Mejores <br />
                Cabañas para Ti
              </motion.h1>
            </div>

            <div className="flex flex-col items-start gap-2">
              <span className="text-[#4a4a4a] text-base font-medium">
                Encuentra cabañas únicas en lugares increíbles
              </span>
              <span className="text-[#4a4a4a] text-base font-medium">
                Reserva fácil, vive la naturaleza sin complicaciones
              </span>
            </div>

            {/* Estadísticas */}
            <div className="w-full flex flex-wrap justify-center lg:justify-between gap-8 lg:gap-12 mt-6 font-poppins">
              <div className="flex flex-col items-center">
                <span className="text-2xl sm:text-3xl lg:text-4xl text-[#2e3b1f] mb-1 font-bold">
                  <CountUp start={0} end={cabanas.length || 5} duration={4} />
                  <span className="text-[#2e3b1f]">+</span>
                </span>
                <span className="text-[#2e3b1f] font-semibold text-sm sm:text-base text-center">
                  Cabañas disponibles
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl sm:text-3xl lg:text-4xl text-[#2e3b1f] mb-1 font-bold">
                  <CountUp start={0} end={100} duration={4} />
                  <span className="text-[#2e3b1f]">+</span>
                </span>
                <span className="text-[#2e3b1f] font-semibold text-sm sm:text-base text-center">
                  Clientes felices
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl sm:text-3xl lg:text-4xl text-[#2e3b1f] mb-1 font-bold">
                  <CountUp end={12} />
                  <span className="text-[#2e3b1f]">+</span>
                </span>
                <span className="text-[#2e3b1f] font-semibold text-sm sm:text-base text-center">
                  Lugares únicos
                </span>
              </div>
            </div>
          </div>

          {/* Lado derecho */}
          <div className="flex items-center justify-center">
            <div className="w-full h-96 lg:w-[30rem] lg:h-[35rem] overflow-hidden rounded-t-full border-8 border-[rgba(47,79,79,0.12)]">
              {featuredCabanas.length > 0 ? (
                <Image
                  src={featuredCabanas[0].imagen_principal || '/cabin3.jpg'}
                  alt={featuredCabanas[0].nombre || 'Cabaña destacada'}
                  width={480}
                  height={560}
                  className="w-full h-full object-cover"
                  priority
                />
              ) : (
                <Image
                  src="/cabin3.jpg"
                  alt="Cabaña destacada"
                  width={480}
                  height={560}
                  className="w-full h-full object-cover"
                  priority
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Cabañas */}
      <section className="py-16 bg-white">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-visible">
          <div className="flex flex-col items-start sm:items-center gap-2 mb-8">
            <span className="text-orange-500 font-semibold text-lg">
              Nuestras Mejores Opciones
            </span>
            <span className="text-[#2e3b1f] text-3xl sm:text-4xl font-bold">
              Cabañas Populares
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2e3b1f]"></div>
            </div>
          ) : (
            <Swiper {...sliderSettings}>
              <SliderButtons />
              {featuredCabanas.map((cabana, i) => (
                <SwiperSlide key={i}>
                  <Link href={`/cabanas/${cabana.id}`} className="block">
                    <div className="flex flex-col items-start gap-2 p-4 rounded-lg max-w-max mx-auto transition-all duration-300 bg-[#3a2a1c] text-[#f5f5dc] hover:scale-105 hover:cursor-pointer hover:bg-gradient-to-b hover:from-transparent hover:to-[rgba(207,224,176,0.46)] hover:shadow-[0px_72px_49px_-51px_rgba(207,224,176,0.4)] hover:text-[#2e3b1f] group">
                      <div className="relative w-full max-w-[15rem] h-[12.5rem] rounded-lg overflow-hidden">
                        {cabana.imagen_principal ? (
                          <Image
                            src={cabana.imagen_principal}
                            alt={cabana.nombre}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                            <Home className="w-12 h-12 text-gray-500" />
                          </div>
                        )}
                        
                        {/* Status badge */}
                        <div className="absolute top-2 left-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            cabana.estado === 'disponible' 
                              ? 'bg-green-100 text-green-800'
                              : cabana.estado === 'ocupada'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {cabana.estado}
                          </span>
                        </div>

                        {/* Rating */}
                        {cabana.calificacion_promedio > 0 && (
                          <div className="absolute top-2 right-2 flex items-center bg-white/90 px-2 py-1 rounded-full">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="ml-1 text-xs text-gray-800">
                              {cabana.calificacion_promedio.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <span className="text-2xl font-semibold text-[#cfe0b0] transition-colors duration-300 group-hover:text-[#2e3b1f]">
                        {formatPrice(cabana.costo_por_noche)}
                      </span>
                      
                      <span className="text-xl text-[#f5f5dc] transition-colors duration-300 group-hover:text-[#2e3b1f] truncate w-60">
                        {cabana.nombre}
                      </span>
                      
                      <span className="text-xs w-60 text-[#ddd9c3] transition-colors duration-300 group-hover:text-[#2e3b1f] line-clamp-2">
                        {cabana.descripcion}
                      </span>

                      {/* Detalles adicionales */}
                      <div className="flex items-center gap-3 text-xs text-[#ddd9c3] transition-colors duration-300 group-hover:text-[#2e3b1f] mt-1">
                        <div className="flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          <span>{cabana.capacidad}</span>
                        </div>
                        {cabana.permite_mascotas && (
                          <PawPrint className="w-3 h-3 text-green-400" />
                        )}
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </section>
    </>
  )
}

const SliderButtons = () => {
  const swiper = useSwiper()
  return (
    <div className="absolute top-0 right-0 z-10 flex items-center gap-4 sm:static sm:justify-center sm:mt-4">
      <button
        aria-label="Previous slide"
        onClick={() => swiper.slidePrev()}
        className="text-xl px-3 py-1 text-[#556B2F] border-none rounded bg-[#cfe0b0] cursor-pointer transition-all duration-300 hover:bg-[#2E3B1F] hover:text-[#F5F5DC] shadow-[0px_0px_5px_1px_rgba(46,59,31,0.5)]"
      >
        &lt;
      </button>
      <button
        aria-label="Next slide"
        onClick={() => swiper.slideNext()}
        className="text-xl px-3 py-1 text-[#556B2F] border-none rounded bg-[#cfe0b0] cursor-pointer transition-all duration-300 hover:bg-[#2E3B1F] hover:text-[#F5F5DC] shadow-[0px_0px_5px_1px_rgba(46,59,31,0.5)]"
      >
        &gt;
      </button>
    </div>
  )
}

export default Hero