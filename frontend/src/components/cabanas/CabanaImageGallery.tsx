// src/components/cabanas/CabanaImageGallery.tsx
import React, { useState } from 'react';
import { ImagenCabana } from '@/types/cabanasTypes';

interface CabanaImageGalleryProps {
  imagenes: ImagenCabana[];
  nombreCabana: string;
}

const CabanaImageGallery: React.FC<CabanaImageGalleryProps> = ({ 
  imagenes, 
  nombreCabana 
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Ordenar imágenes: principal primero, luego por orden
  const sortedImages = [...imagenes].sort((a, b) => {
    if (a.es_principal && !b.es_principal) return -1;
    if (!a.es_principal && b.es_principal) return 1;
    return a.orden - b.orden;
  });

  const mainImage = sortedImages[0];
  const thumbnails = sortedImages.slice(1);

  const openModal = (imageSrc: string) => {
    setSelectedImage(imageSrc);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  if (sortedImages.length === 0) {
    return (
      <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
        <span className="text-gray-500">Sin imágenes disponibles</span>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-4 gap-2 h-96">
        {/* Main Image */}
        <div className="col-span-2 row-span-2">
          <img
            src={mainImage.imagen}
            alt={mainImage.descripcion || nombreCabana}
            className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => openModal(mainImage.imagen)}
          />
        </div>

        {/* Thumbnail Images */}
        {thumbnails.slice(0, 3).map((imagen, index) => (
          <div key={imagen.id} className="relative">
            <img
              src={imagen.imagen}
              alt={imagen.descripcion || `${nombreCabana} - Imagen ${index + 2}`}
              className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => openModal(imagen.imagen)}
            />
            {/* Show "+X more" overlay on last thumbnail if there are more images */}
            {index === 2 && thumbnails.length > 3 && (
              <div 
                className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center cursor-pointer"
                onClick={() => openModal(imagen.imagen)}
              >
                <span className="text-white font-semibold">
                  +{thumbnails.length - 3} más
                </span>
              </div>
            )}
          </div>
        ))}

        {/* Show all images button if less than 4 images */}
        {thumbnails.length < 3 && (
          <button
            onClick={() => openModal(mainImage.imagen)}
            className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
          >
            Ver todas
          </button>
        )}
      </div>

      {/* Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white text-3xl font-bold hover:text-gray-300 z-10"
            >
              ×
            </button>
            <img
              src={selectedImage}
              alt={nombreCabana}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CabanaImageGallery;