// src/pages/public/CabinDetail.js
'use client'
import { useState } from 'react'
// Importamos las imágenes
import cabaña1 from '../../assets/imgs/CabinDetails/cabaña1/img1.jpg'
import cabaña2 from '../../assets/imgs/CabinDetails/cabaña1/img2.jpg'
import cabaña3 from '../../assets/imgs/CabinDetails/cabaña1/img3.jpg'
import cabaña4 from '../../assets/imgs/CabinDetails/cabaña1/img4.jpg'
import cabaña5 from '../../assets/imgs/CabinDetails/cabaña1/img5.jpg'
import cabaña6 from '../../assets/imgs/CabinDetails/cabaña1/img6.jpg'

// Importamos los iconos
import cocinaIcon from '../../assets/imgs/CabinDetails/icons/cosina.png'
import barraIcon from '../../assets/imgs/CabinDetails/icons/barra.png'
import chimeneaIcon from '../../assets/imgs/CabinDetails/icons/chimenea.png'
import salaIcon from '../../assets/imgs/CabinDetails/icons/sala.png'
import televisionIcon from '../../assets/imgs/CabinDetails/icons/television.png'
import leniaIcon from '../../assets/imgs/CabinDetails/icons/lenia.png'
import aguaIcon from '../../assets/imgs/CabinDetails/icons/agua.png'
import asadorIcon from '../../assets/imgs/CabinDetails/icons/asador.png'
import cocheIcon from '../../assets/imgs/CabinDetails/icons/coche.png'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import { Select} from '../../components/Select'

export default function CabinDetail() {
  const [currentImage, setCurrentImage] = useState(0)
  const [guestCount, setGuestCount] = useState('')
  const [dates, setDates] = useState({ checkIn: '', checkOut: '' })

  const images = [cabaña1, cabaña2, cabaña3, cabaña4, cabaña5, cabaña6]
  
  const guestOptions = [1, 2, 3, 4, 5, 6, 7].map(num => ({
    value: num.toString(),
    label: `${num} ${num === 1 ? 'huésped' : 'huéspedes'}`
  }))

  const amenities = [
    { icon: cocinaIcon, text: 'Cocina equipada' },
    { icon: barraIcon, text: 'Barra desayunadora' },
    { icon: chimeneaIcon, text: 'Chimenea' },
    { icon: salaIcon, text: 'Sala' },
    { icon: televisionIcon, text: 'Pantalla con Sky' },
    { icon: leniaIcon, text: 'Leña para chimenea' },
    { icon: aguaIcon, text: 'Agua caliente' },
    { icon: asadorIcon, text: 'Asador' },
    { icon: cocheIcon, text: 'Estacionamiento en las instalaciones' },
  ]

  const changeImage = (index) => setCurrentImage(index)
  const prevImage = () => setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  const nextImage = () => setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))

  const handleDateChange = (e) => {
    setDates(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-[2fr,1fr] gap-10">
        <div className="flex gap-5">
          <div className="flex flex-col gap-2.5">
            {images.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Thumbnail ${index + 1}`}
                width={64}
                height={64}
                className={`w-16 h-16 object-cover cursor-pointer rounded ${
                  currentImage === index ? 'border-2 border-[#617321]' : 'border-2 border-transparent'
                }`}
                onClick={() => changeImage(index)}
              />
            ))}
          </div>
          <div className="relative flex-grow">
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <img
              src={images[currentImage]}
              alt="Imagen Principal"
              width={800}
              height={600}
              className="w-full h-[500px] object-cover rounded-lg"
            />
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="mb-5">
            <span className="text-2xl font-semibold">$2,000 MXN</span>
            <span className="text-gray-500"> / noche</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 mb-5">
            <Input
              type="date"
              id="checkIn"
              label="ENTRADA"
              value={dates.checkIn}
              onChange={handleDateChange}
            />
            <Input
              type="date"
              id="checkOut"
              label="SALIDA"
              value={dates.checkOut}
              onChange={handleDateChange}
            />
          </div>

          <div className="mb-5">
            <Select
              id="guestCount"
              label="HUÉSPEDES"
              value={guestCount}
              onChange={(e) => setGuestCount(e.target.value)}
              options={guestOptions}
              placeholder="Seleccionar huéspedes"
            />
          </div>

          <Button className="w-full">Reservar</Button>

          <div className="mt-5 pt-5 border-t">
            <div className="flex justify-between mb-2.5">
              <span>$2,000 MXN x 5 noches</span>
              <span>$10,000 MXN</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>$10,000 MXN</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-6 text-center">Servicios Incluidos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {amenities.map((amenity) => (
            <div key={amenity.text} className="flex items-center gap-3">
              <img src={amenity.icon} alt={amenity.text} width={24} height={24} />
              <span>{amenity.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
