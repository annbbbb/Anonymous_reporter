import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MapPin, Search, X, Check, Map } from "lucide-react";
import { cn } from "@/lib/utils";
import { Location } from "@/data/locations";
import { searchLocations } from "@/services/locationService";
import { MapSelector } from "./MapSelector";

interface LocationSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}


export const LocationSearch = ({ value, onChange, placeholder = "Search for location...", className }: LocationSearchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showMap, setShowMap] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter locations based on search query
  useEffect(() => {
    const searchLocationsAsync = async () => {
      try {
        const locations = await searchLocations(searchQuery);
        setFilteredLocations(locations);
      } catch (error) {
        console.error('Error searching locations:', error);
        setFilteredLocations([]);
      }
    };

    searchLocationsAsync();
  }, [searchQuery]);

  // Find selected location based on current value
  useEffect(() => {
    const findSelectedLocation = async () => {
      if (value) {
        try {
          const locations = await searchLocations(value);
          const location = locations.find(loc => 
            loc.postalCode === value || 
            loc.address === value ||
            loc.name === value
          );
          setSelectedLocation(location || null);
        } catch (error) {
          console.error('Error finding selected location:', error);
          setSelectedLocation(null);
        }
      } else {
        setSelectedLocation(null);
      }
    };

    findSelectedLocation();
  }, [value]);

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    onChange(location.postalCode);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleMapLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    onChange(location.postalCode);
    setShowMap(false);
    setIsOpen(false); // Zamknij również główne okno wyszukiwania
  };

  const handleClear = () => {
    setSelectedLocation(null);
    onChange("");
    setSearchQuery("");
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setSearchQuery("");
      // Load initial locations when popover opens
      searchLocations("").then(setFilteredLocations);
      // Focus the search input when popover opens
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Popover open={isOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full h-12 text-left justify-start font-normal",
              !selectedLocation && "text-muted-foreground"
            )}
          >
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            {selectedLocation ? (
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{selectedLocation.name}</div>
                <div className="text-sm text-muted-foreground truncate">
                  {selectedLocation.address}
                </div>
              </div>
            ) : (
              <span className="flex-1">{placeholder}</span>
            )}
            {selectedLocation && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-muted-foreground/10"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                ref={inputRef}
                placeholder="Search for location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="mt-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  setShowMap(true);
                  setIsOpen(false); // Zamknij małe okno natychmiast
                }}
              >
                <Map className="w-4 h-4 mr-2" />
                Select from map
              </Button>
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filteredLocations.length > 0 ? (
              <div className="p-1">
                {filteredLocations.map((location) => (
                  <Card
                    key={location.id}
                    className={cn(
                      "p-3 cursor-pointer transition-colors hover:bg-muted/50",
                      selectedLocation?.id === location.id && "bg-primary/5 border-primary/20"
                    )}
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
                          Kod pocztowy: {location.postalCode}
                        </div>
                      </div>
                      {selectedLocation?.id === location.id && (
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-muted-foreground">
                <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No locations found</p>
                <p className="text-xs mt-1">Try a different search term</p>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
      
      {showMap && (
        <MapSelector
          onLocationSelect={handleMapLocationSelect}
          selectedLocation={selectedLocation}
          onClose={() => setShowMap(false)}
        />
      )}
    </div>
  );
};
