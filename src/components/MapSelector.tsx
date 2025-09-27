import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, X, Search, Check } from "lucide-react";
import { Location, mockLocations } from "@/data/locations";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { reverseGeocode } from '@/services/locationService';

interface MapSelectorProps {
  onLocationSelect: (location: Location) => void;
  selectedLocation?: Location | null;
  onClose: () => void;
}

// Fix Leaflet icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export const MapSelector = ({ onLocationSelect, selectedLocation, onClose }: MapSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([52.2297, 21.0122]); // Warszawa
  const [selectedMapLocation, setSelectedMapLocation] = useState<Location | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      // Symulacja wyszukiwania - w rzeczywistej aplikacji użyłbyś API geocoding
      const filtered = mockLocations.filter(location =>
        location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.voivodeship.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.county.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
    } catch (error) {
      console.error("Błąd podczas wyszukiwania:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSelect = (location: Location) => {
    onLocationSelect(location);
  };

  // Map click handler
  const MapClickHandler = () => {
    const map = useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;
        
        // Zoom to the clicked location
        map.setView([lat, lng], 15); // Zoom level 15 for street level view
        
        // Show loading state
        setSelectedMapLocation({
          id: `loading_${Date.now()}`,
          name: "Loading...",
          address: "Getting location details...",
          postalCode: "00-000",
          voivodeship: "Loading",
          county: "Loading",
          coordinates: { lat, lng }
        });
        
        try {
          // Use reverse geocoding to get real location details
          const location = await reverseGeocode(lat, lng);
          
          if (location) {
            setSelectedMapLocation(location);
          } else {
            // Fallback if reverse geocoding fails
            setSelectedMapLocation({
              id: `map_${Date.now()}`,
              name: `Selected Location`,
              address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
              postalCode: "00-000",
              voivodeship: "Selected from map",
              county: "Selected from map",
              coordinates: { lat, lng }
            });
          }
        } catch (error) {
          console.error('Error getting location details:', error);
          // Fallback if reverse geocoding fails
          setSelectedMapLocation({
            id: `map_${Date.now()}`,
            name: `Selected Location`,
            address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
            postalCode: "00-000",
            voivodeship: "Selected from map",
            county: "Selected from map",
            coordinates: { lat, lng }
          });
        }
        
        setMapCenter([lat, lng]);
      }
    });
    return null;
  };

  const handleManualLocation = () => {
    const newLocation: Location = {
      id: `custom_${Date.now()}`,
      name: `Selected Location - ${searchQuery}`,
      address: searchQuery,
      postalCode: "00-000",
      voivodeship: "Unknown Region",
      county: "Unknown County",
      coordinates: { lat: 52.2297, lng: 21.0122 } // Warszawa jako domyślne
    };
    onLocationSelect(newLocation);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl h-[90vh] flex">
        {/* Left Sidebar - Search */}
        <div className="w-80 border-r flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Select Location</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="p-4 border-b">
            <div className="flex gap-2 mb-3">
              <Input
                placeholder="Search city or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={isLoading}>
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-2">
                {searchResults.map((location) => (
                  <Card
                    key={location.id}
                    className="p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleLocationSelect(location)}
                  >
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{location.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {location.address}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {location.voivodeship}, {location.county}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Postal Code: {location.postalCode}
                        </div>
                      </div>
                      {selectedLocation?.id === location.id && (
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ) : searchQuery ? (
              <div className="text-center py-8">
                <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground mb-4">No location found</p>
                <Button onClick={handleManualLocation} variant="outline">
                  Use as location: "{searchQuery}"
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground">Search for a location or click on the map</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Right Side - Map */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Map of Poland</h3>
              </div>
              <div className="text-sm text-muted-foreground">
                Click on the map to select location
              </div>
            </div>
          </div>
          
          <div className="flex-1 relative">
            <MapContainer
              center={mapCenter}
              zoom={6}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <MapClickHandler />
              {selectedMapLocation && (
                <Marker position={[selectedMapLocation.coordinates.lat, selectedMapLocation.coordinates.lng]}>
                  <Popup>
                    <div className="p-2">
                      <p className="font-semibold">{selectedMapLocation.name}</p>
                      <p className="text-sm text-gray-600">{selectedMapLocation.address}</p>
                      <Button 
                        size="sm" 
                        className="mt-2"
                        onClick={() => handleLocationSelect(selectedMapLocation)}
                      >
                        Select this location
                      </Button>
                    </div>
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
          
          {selectedMapLocation && (
            <div className="p-4 border-t bg-muted/30">
              <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{selectedMapLocation.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedMapLocation.address}</p>
                    {selectedMapLocation.postalCode !== "00-000" && (
                      <p className="text-xs text-muted-foreground">Postal Code: {selectedMapLocation.postalCode}</p>
                    )}
                    {selectedMapLocation.id.startsWith('loading_') ? (
                      <div className="flex items-center gap-2 mt-2">
                        <div className="animate-spin w-3 h-3 border border-primary border-t-transparent rounded-full"></div>
                        <span className="text-xs text-muted-foreground">Getting location details...</span>
                      </div>
                    ) : (
                      <div className="flex gap-2 mt-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleLocationSelect(selectedMapLocation)}
                          className="flex-1"
                        >
                          Confirm Location
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedMapLocation(null)}
                        >
                          Change Point
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};