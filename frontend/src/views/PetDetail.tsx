import React, { useState, useEffect } from 'react';

const PetDetailsPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showOperatingHours, setShowOperatingHours] = useState(false);
  const [pet, setPet] = useState<any>(null);
  const [shelter, setShelter] = useState<any>(null);

  const petData = {
    name: 'Buddy',
    species: 'dog',
    breed: 'Golden Retriever',
    age: { value: 3, unit: 'years' },
    gender: 'male',
    size: 'large',
    color: 'Golden',
    images: [
      'https://placedog.net/800/600?id=1',
      'https://placedog.net/800/600?id=2',
      'https://placedog.net/800/600?id=3',
      'https://placedog.net/800/600?id=3',
      'https://placedog.net/800/600?id=3',

    ],
    description: 'Buddy is a friendly and energetic golden retriever who loves to play and cuddle.',
    adoptionStatus: 'available',
    adoptionFee: 150,
    location: { x: 40.7128, y: -74.006 },
  };

  const shelterData = {
    shelterName: 'Happy Tails Shelter',
    description: 'A warm and caring shelter dedicated to finding homes for pets.',
    contactEmail: 'info@happytails.com',
    contactPhone: '+1 234 567 890',
    rating: 4.5,
    socialMedia: {
      facebook: 'https://facebook.com/happytails',
      instagram: 'https://instagram.com/happytails',
      twitter: 'https://twitter.com/happytails',
    },
    operatingHours: {
      monday: { open: '9:00 AM', close: '5:00 PM' },
      tuesday: { open: '9:00 AM', close: '5:00 PM' },
      wednesday: { open: '9:00 AM', close: '5:00 PM' },
      thursday: { open: '9:00 AM', close: '5:00 PM' },
      friday: { open: '9:00 AM', close: '5:00 PM' },
      saturday: { open: '10:00 AM', close: '4:00 PM' },
      sunday: { open: 'Closed', close: 'Closed' },
    },
  };

  useEffect(() => {
    setPet(petData);
    setShelter(shelterData);
  }, []);

  if (!pet || !shelter) return <div>Loading...</div>;

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto space-y-12">
      {/* Image Section */}
        <div className="flex flex-col lg:flex-row gap-6 justify-center items-center lg:items-start">
        {/* Main Image */}
        <div className="flex justify-center lg:w-[400px] lg:h-[400px]">
            <img
            src={pet.images[selectedImage]}
            alt="Main Pet"
            className="w-full max-w-[400px] h-[400px] object-cover rounded-xl"
            />
        </div>

        {/* Thumbnails */}
        <div className="flex gap-3 justify-center flex-wrap lg:flex-col lg:items-center lg:ml-6 lg:h-[400px] lg:overflow-y-auto">
            {pet.images.map((img: string, idx: number) => (
            <img
                key={idx}
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                onClick={() => setSelectedImage(idx)}
                className={`w-24 h-24 object-cover rounded-md cursor-pointer border-2 ${
                idx === selectedImage ? 'border-[var(--color-primary-dark)]' : 'border-transparent'
                }`}
            />
            ))}
        </div>
        </div>

      {/* Info Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Pet Info */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-[var(--color-primary-dark)]">{pet.name}</h1>
          <div className="grid grid-cols-2 gap-4 text-lg">
            <Info label="Species" value={pet.species} />
            <Info label="Breed" value={pet.breed} />
            <Info label="Age" value={`${pet.age.value} ${pet.age.unit}`} />
            <Info label="Gender" value={pet.gender} />
            <Info label="Size" value={pet.size} />
            <Info label="Color" value={pet.color} />
            <Info label="Adoption Fee" value={`$${pet.adoptionFee}`} />
            <Info label="Location" value={`Lat: ${pet.location.x}, Long: ${pet.location.y}`} />
          </div>

          {/* Description */}
          <div>
            <h2 className="text-2xl font-semibold text-[var(--color-primary-dark)] mt-6 mb-2">About {pet.name}</h2>
            <p className="text-gray-700 text-lg">{pet.description}</p>
          </div>

          {/* Chat Button */}
          <button className="mt-6 inline-block px-6 py-3 bg-[var(--color-primary-dark)] hover:bg-[var(--color-secondary)] text-white font-semibold text-lg rounded-lg transition-all">
            Chat with Shelter
          </button>
        </div>

        {/* Shelter Info */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-[var(--color-primary-dark)]">{shelter.shelterName}</h2>
          <p className="text-gray-700 text-lg">{shelter.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-lg">
            <Info label="Email" value={shelter.contactEmail} />
            <Info label="Phone" value={shelter.contactPhone} />
            <Info label="Rating" value={`⭐ ${shelter.rating}`} />
          </div>
          <div className="flex gap-4 text-lg">
            <a href={shelter.socialMedia.facebook} className="text-blue-600">Facebook</a>
            <a href={shelter.socialMedia.instagram} className="text-pink-600">Instagram</a>
            <a href={shelter.socialMedia.twitter} className="text-blue-400">Twitter</a>
          </div>

          {/* Operating Hours */}
          <div>
              <button
                onClick={() => setShowOperatingHours(!showOperatingHours)}
                className="text-[var(--color-primary-dark)] font-semibold"
              >
                {showOperatingHours ? 'Hide Operating Hours' : 'Show Operating Hours'}
              </button>
              {showOperatingHours && (
                <div className="mt-2 space-y-1">
                  {Object.entries(shelter.operatingHours).map(([day, hours]: any) => (
                    <Info
                      key={day}
                      label={day.charAt(0).toUpperCase() + day.slice(1)}
                      value={`${hours.open} - ${hours.close}`}
                    />
                  ))}
                </div>
              )}
            </div>
            </div>
          </div>
        </div>
  );
};

const Info = ({ label, value }: { label: string; value: string }) => (
  <div>
    <span className="font-semibold text-[var(--color-dark)]">{label}:</span>{' '}
    <span className="text-[var(--color-text)]">{value}</span>
  </div>
);


export default PetDetailsPage;

