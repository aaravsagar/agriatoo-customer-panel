import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps-api';
import { saveUserAddress, getUserAddress, reverseGeocode, Address } from '../../services/addressService';
import { useAuth } from '../../hooks/useAuth';
import { MapPin, Navigation, Save, CreditCard as Edit3 } from 'lucide-react';

const libraries: ("places")[] = ["places"];

const mapContainerStyle = {
  width: '100%',
  height: '300px'
};

const defaultCenter = {
  lat: 28.6139,
  lng: 77.2090 // Delhi
};

const AddressSelector: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState(defaultCenter);
  const [address, setAddress] = useState<Partial<Address>>({
    fullAddress: '',
    city: '',
    area: '',
    pincode: '',
    lat: defaultCenter.lat,
    lng: defaultCenter.lng
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      loadExistingAddress();
    }
  }, [user]);

  const loadExistingAddress = async () => {
    if (!user) return;
    
    const existingAddress = await getUserAddress(user.id);
    if (existingAddress) {
      setAddress(existingAddress);
      setMarker({ lat: existingAddress.lat, lng: existingAddress.lng });
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const newPosition = { lat: latitude, lng: longitude };
          
          setMarker(newPosition);
          if (map) {
            map.panTo(newPosition);
          }
          
          await handleLocationChange(latitude, longitude);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setError('Unable to get your current location. Please select manually on the map.');
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  const handleLocationChange = async (lat: number, lng: number) => {
    const geocodedAddress = await reverseGeocode(lat, lng);
    if (geocodedAddress) {
      setAddress(prev => ({
        ...prev,
        ...geocodedAddress
      }));
    }
  };

  const handleMapClick = useCallback(async (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      
      setMarker({ lat, lng });
      await handleLocationChange(lat, lng);
    }
  }, []);

  const handlePlaceSelect = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        
        setMarker({ lat, lng });
        if (map) {
          map.panTo({ lat, lng });
        }
        
        handleLocationChange(lat, lng);
      }
    }
  };

  const handleSaveAddress = async () => {
    if (!user) return;
    
    if (!address.fullAddress || !address.pincode) {
      setError('Please select a location and ensure all fields are filled');
      return;
    }

    setLoading(true);
    setError('');

    const success = await saveUserAddress(user.id, address as Address);
    
    if (success) {
      navigate('/home');
    } else {
      setError('Failed to save address. Please try again.');
    }
    
    setLoading(false);
  };

  const handleInputChange = (field: keyof Address, value: string) => {
    setAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-green-600 text-white p-6">
            <h1 className="text-2xl font-bold mb-2">Select Your Address</h1>
            <p className="text-green-100">
              Choose your location to see available products in your area
            </p>
          </div>

          {/* Map Section */}
          <div className="p-6">
            <div className="mb-4">
              <div className="flex space-x-2 mb-4">
                <input
                  ref={(input) => {
                    if (input && !autocomplete) {
                      const auto = new google.maps.places.Autocomplete(input);
                      auto.addListener('place_changed', handlePlaceSelect);
                      setAutocomplete(auto);
                    }
                  }}
                  type="text"
                  placeholder="Search for a location..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={getCurrentLocation}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Current</span>
                </button>
              </div>

              <LoadScript
                googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}
                libraries={libraries}
              >
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={marker}
                  zoom={15}
                  onClick={handleMapClick}
                  onLoad={setMap}
                >
                  <Marker
                    position={marker}
                    draggable={true}
                    onDragEnd={async (event) => {
                      if (event.latLng) {
                        const lat = event.latLng.lat();
                        const lng = event.latLng.lng();
                        setMarker({ lat, lng });
                        await handleLocationChange(lat, lng);
                      }
                    }}
                  />
                </GoogleMap>
              </LoadScript>
            </div>

            {/* Address Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Address
                </label>
                <textarea
                  value={address.fullAddress || ''}
                  onChange={(e) => handleInputChange('fullAddress', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter complete address..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Area/Locality
                  </label>
                  <input
                    type="text"
                    value={address.area || ''}
                    onChange={(e) => handleInputChange('area', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Area"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={address.city || ''}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="City"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PIN Code
                </label>
                <input
                  type="text"
                  value={address.pincode || ''}
                  onChange={(e) => handleInputChange('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="123456"
                  maxLength={6}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleSaveAddress}
                disabled={loading || !address.fullAddress || !address.pincode}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Save Address & Continue</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressSelector;