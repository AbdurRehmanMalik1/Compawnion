import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PetDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const [showOperatingHours, setShowOperatingHours] = useState(false);
  const [pet, setPet] = useState<any>(null);
  const [shelter, setShelter] = useState<any>(null);

  // Dummy pet data with shelterId reference
  const petData = {
    _id: '12345',
    shelterId: '67890', // Reference to the shelter
    name: 'Buddy',
    species: 'dog',
    breed: 'Golden Retriever',
    age: { value: 3, unit: 'years' },
    gender: 'male',
    size: 'large',
    color: 'Golden',
    images: [
      'https://placedog.net/800/400?id=1',
      'https://placedog.net/800/400?id=2',
      'https://placedog.net/800/400?id=3',
    ],
    description:
      'Buddy is a friendly and energetic golden retriever who loves to play and cuddle.',
    adoptionStatus: 'available',
    adoptionFee: 150,
    location: { x: 40.7128, y: -74.006 },
  };

  // Dummy shelter data (simulating a shelter from the DB)
  const shelterData = {
    _id: '67890',
    shelterName: 'Happy Tails Shelter',
    description: 'A warm and caring shelter dedicated to finding homes for pets.',
    contactEmail: 'info@happytails.com',
    contactPhone: '+1 234 567 890',
    logo: 'https://via.placeholder.com/100',
    coverImage: 'https://via.placeholder.com/600x300',
    rating: 4.5,
    socialMedia: {
      facebook: 'https://facebook.com/happytails',
      instagram: 'https://instagram.com/happytails',
      twitter: 'https://twitter.com/happytails',
    },
    adoptionPolicy: 'All pets are spayed/neutered before adoption.',
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
    // Set pet and shelter data (simulating database fetch)
    setPet(petData);
    setShelter(shelterData);
  }, []);

  if (!pet || !shelter) {
    return <div>Loading...</div>; // Show loading state until data is fetched
  }

  const statusColor =
    pet.adoptionStatus === 'available'
      ? 'bg-[var(--color-primary-dark)]'
      : pet.adoptionStatus === 'pending'
      ? 'bg-[var(--color-accent)]'
      : 'bg-gray-500';

  return (
    <div className="min-h-screen bg-[--color-light] text-[--color-text] px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 text-[var(--color-primary-dark)] hover:text-[var(--color-secondary)] transition cursor-pointer"
        >
          <ArrowLeft size={20} />
          <span className="text-lg font-medium">Back</span>
        </button>

        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden border border-white/30">
          {/* Image Carousel */}
          <div className="w-full overflow-x-auto whitespace-nowrap">
            {pet.images.map((img: string, idx: number) => (
              <img
                key={idx}
                src={img}
                alt={`${pet.name} ${idx + 1}`}
                className="inline-block w-full h-96 object-cover"
              />
            ))}
          </div>

          <div className="p-8 space-y-6">
            {/* Pet Name and Adoption Status */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h1 className="text-4xl text-[var(--color-primary-dark)] font-bold tracking-tight">{pet.name}</h1>
              <span
                className={`text-white px-4 py-1 rounded-full font-semibold text-sm ${statusColor}`}
              >
                {pet.adoptionStatus.toUpperCase()}
              </span>
            </div>

            {/* Section Label: Pet Profile */}
            <div className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
                <InfoItem label="Species" value={pet.species} />
                <InfoItem label="Breed" value={pet.breed} />
                <InfoItem label="Age" value={`${pet.age.value} ${pet.age.unit}`} />
                <InfoItem label="Gender" value={pet.gender} />
                <InfoItem label="Size" value={pet.size} />
                <InfoItem label="Color" value={pet.color} />
                <InfoItem label="Adoption Fee" value={`$${pet.adoptionFee}`} />
                <InfoItem label="Location" value={`Lat: ${pet.location.x}, Long: ${pet.location.y}`} />
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-semibold text-[var(--color-primary)] mb-2">
                <strong>About {pet.name}</strong>
              </h2>
              <p className="text-gray-700 leading-relaxed">{pet.description}</p>
            </div>

            {/* Presented by Shelter Name */}
            <p className="text-lg font-semibold text-[var(--color-primary-dark)]">
              Presented by {shelter.shelterName}
            </p>
            {/* Shelter Info below the Pet Description */}
            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-[var(--color-primary)] mb-2"><center>🏠 Shelter Info</center></h2>
              <h1 className="text-4xl text-[var(--color-primary-dark)] font-bold tracking-tight">{shelter.shelterName}</h1>
                <br/>
              <p className="text-gray-700 leading-relaxed">{shelter.description}</p>
                <br/>
              {/* Shelter Details */}
              <div className="flex gap-6 text-lg">
                <InfoItem label="Contact Email" value={shelter.contactEmail} />
                <InfoItem label="Contact Phone" value={shelter.contactPhone} />
                <InfoItem label="Rating" value={`⭐ ${shelter.rating}`} />
              </div>
            <br/>
              {/* Social Media */}
              <div className="flex gap-4 text-lg">
                <a href={shelter.socialMedia.facebook} className="text-blue-600">Facebook</a>
                <a href={shelter.socialMedia.instagram} className="text-pink-600">Instagram</a>
                <a href={shelter.socialMedia.twitter} className="text-blue-400">Twitter</a>
              </div>

              {/* Operating Hours Button */}
              <div className="mt-4">
                <button
                  onClick={() => setShowOperatingHours(!showOperatingHours)} // Toggle visibility
                  className="text-[var(--color-primary-dark)] font-semibold text-lg"
                >
                  {showOperatingHours ? 'Hide Operating Hours' : 'Show Operating Hours'}
                </button>
              </div>

              {/* Operating Hours Section */}
              {showOperatingHours && (
                <div className="text-lg mt-4">
                  {Object.keys(shelter.operatingHours).map((day) => (
                    <InfoItem
                      key={day}
                      label={day.charAt(0).toUpperCase() + day.slice(1)}
                      value={`${shelter.operatingHours[day].open} - ${shelter.operatingHours[day].close}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Adopt Me Button */}
            <div className="text-center mt-8">
              <button className="inline-block px-8 py-3 bg-[var(--color-primary-dark)] hover:bg-[var(--color-secondary)] text-white font-semibold text-lg rounded-xl transition-all transition cursor-pointer duration-300 shadow-md">
                Adopt Me
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <span className="font-semibold text-[var(--color-dark)]">{label}:</span>{' '}
    <span className="text-[var(--color-text)]">{value}</span>
  </div>
);

export default PetDetailsPage;
