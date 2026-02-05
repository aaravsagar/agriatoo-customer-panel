import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface Address {
  fullAddress: string;
  city: string;
  area: string;
  pincode: string;
  lat: number;
  lng: number;
}

export const saveUserAddress = async (userId: string, address: Address): Promise<boolean> => {
  try {
    const addressRef = doc(db, 'users', userId, 'address', 'main');
    await setDoc(addressRef, {
      ...address,
      updatedAt: new Date()
    });
    return true;
  } catch (error) {
    console.error('Error saving address:', error);
    return false;
  }
};

export const getUserAddress = async (userId: string): Promise<Address | null> => {
  try {
    const addressRef = doc(db, 'users', userId, 'address', 'main');
    const addressDoc = await getDoc(addressRef);
    
    if (addressDoc.exists()) {
      return addressDoc.data() as Address;
    }
    return null;
  } catch (error) {
    console.error('Error getting address:', error);
    return null;
  }
};

export const reverseGeocode = async (lat: number, lng: number): Promise<Partial<Address> | null> => {
  try {
    const geocoder = new google.maps.Geocoder();
    const response = await geocoder.geocode({
      location: { lat, lng }
    });

    if (response.results && response.results.length > 0) {
      const result = response.results[0];
      const components = result.address_components;
      
      let city = '';
      let area = '';
      let pincode = '';
      
      components.forEach(component => {
        const types = component.types;
        if (types.includes('locality')) {
          city = component.long_name;
        }
        if (types.includes('sublocality') || types.includes('sublocality_level_1')) {
          area = component.long_name;
        }
        if (types.includes('postal_code')) {
          pincode = component.long_name;
        }
      });

      return {
        fullAddress: result.formatted_address,
        city,
        area,
        pincode,
        lat,
        lng
      };
    }
    return null;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
};