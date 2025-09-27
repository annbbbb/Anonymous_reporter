import { supabase } from '@/lib/supabase';
import { Location, DatabaseLocation } from '@/data/locations';

// Convert Supabase row to Location interface
const convertSupabaseRowToLocation = (row: DatabaseLocation): Location => {
  return {
    id: row.id,
    name: row.name,
    address: row.address,
    postalCode: row.postal_code,
    voivodeship: row.voivodeship,
    county: row.county,
    coordinates: row.coordinates,
  };
};

// Get all locations from Supabase
export const getAllLocations = async (): Promise<Location[]> => {
  try {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error loading locations from Supabase:', error);
      return [];
    }

    return data ? data.map(convertSupabaseRowToLocation) : [];
  } catch (error) {
    console.error('Error loading locations from Supabase:', error);
    return [];
  }
};

// Search locations by query
export const searchLocations = async (query: string): Promise<Location[]> => {
  try {
    if (!query.trim()) {
      return getAllLocations();
    }

    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .or(`name.ilike.%${query}%,address.ilike.%${query}%,postal_code.ilike.%${query}%,voivodeship.ilike.%${query}%,county.ilike.%${query}%`)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error searching locations from Supabase:', error);
      return [];
    }

    return data ? data.map(convertSupabaseRowToLocation) : [];
  } catch (error) {
    console.error('Error searching locations from Supabase:', error);
    return [];
  }
};

// Get locations by voivodeship
export const getLocationsByVoivodeship = async (voivodeship: string): Promise<Location[]> => {
  try {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('voivodeship', voivodeship)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error loading locations by voivodeship from Supabase:', error);
      return [];
    }

    return data ? data.map(convertSupabaseRowToLocation) : [];
  } catch (error) {
    console.error('Error loading locations by voivodeship from Supabase:', error);
    return [];
  }
};

// Reverse geocoding - get location details from coordinates
export const reverseGeocode = async (lat: number, lng: number): Promise<Location | null> => {
  try {
    // Use OpenStreetMap Nominatim API for reverse geocoding
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=en`
    );
    
    if (!response.ok) {
      throw new Error('Reverse geocoding failed');
    }
    
    const data = await response.json();
    
    if (!data || !data.address) {
      return null;
    }
    
    // Extract location details
    const address = data.address;
    const city = address.city || address.town || address.village || address.municipality || 'Unknown City';
    const street = address.road || address.street || '';
    const houseNumber = address.house_number || '';
    const postalCode = address.postcode || '00-000';
    const state = address.state || address.region || 'Unknown Region';
    const country = address.country || 'Poland';
    
    // Create full address
    const fullAddress = [street, houseNumber].filter(Boolean).join(' ') || city;
    
    return {
      id: `reverse_${Date.now()}`,
      name: city,
      address: fullAddress,
      postalCode: postalCode,
      voivodeship: state,
      county: address.county || state,
      coordinates: { lat, lng }
    };
  } catch (error) {
    console.error('Error in reverse geocoding:', error);
    return null;
  }
};