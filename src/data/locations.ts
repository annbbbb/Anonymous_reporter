export interface Location {
  id: string;
  name: string;
  address: string;
  postalCode: string;
  voivodeship: string;
  county: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// Supabase database types for locations
export interface DatabaseLocation {
  id: string;
  name: string;
  address: string;
  postal_code: string;
  voivodeship: string;
  county: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  created_at: string;
}

// Baza danych wszystkich województw Polski z głównymi miastami i lokalizacjami
export const mockLocations: Location[] = [
  // MAŁOPOLSKA
  {
    id: "mal_1",
    name: "Kraków - Rynek Główny",
    address: "Rynek Główny, 31-042 Kraków",
    postalCode: "31-042",
    voivodeship: "Małopolska",
    county: "Kraków",
    coordinates: { lat: 50.0614, lng: 19.9372 }
  },
  {
    id: "mal_2",
    name: "Kraków - Wawel",
    address: "Wawel 5, 31-001 Kraków",
    postalCode: "31-001",
    voivodeship: "Małopolska",
    county: "Kraków",
    coordinates: { lat: 50.0547, lng: 19.9352 }
  },
  {
    id: "mal_3",
    name: "Tarnów - Rynek",
    address: "Rynek, 33-100 Tarnów",
    postalCode: "33-100",
    voivodeship: "Małopolska",
    county: "Tarnów",
    coordinates: { lat: 50.0121, lng: 20.9858 }
  },
  {
    id: "mal_4",
    name: "Nowy Sącz - Rynek",
    address: "Rynek, 33-300 Nowy Sącz",
    postalCode: "33-300",
    voivodeship: "Małopolska",
    county: "Nowy Sącz",
    coordinates: { lat: 49.6218, lng: 20.6969 }
  },
  {
    id: "mal_5",
    name: "Zakopane - Krupówki",
    address: "ul. Krupówki, 34-500 Zakopane",
    postalCode: "34-500",
    voivodeship: "Małopolska",
    county: "Tatrzański",
    coordinates: { lat: 49.2992, lng: 19.9496 }
  },
  {
    id: "mal_6",
    name: "Oświęcim - Centrum",
    address: "Rynek Główny, 32-600 Oświęcim",
    postalCode: "32-600",
    voivodeship: "Małopolska",
    county: "Oświęcim",
    coordinates: { lat: 50.0344, lng: 19.2214 }
  },

  // PODKARPACIE
  {
    id: "pod_1",
    name: "Rzeszów - Rynek",
    address: "Rynek, 35-064 Rzeszów",
    postalCode: "35-064",
    voivodeship: "Podkarpacie",
    county: "Rzeszów",
    coordinates: { lat: 50.0412, lng: 22.0041 }
  },
  {
    id: "pod_2",
    name: "Przemyśl - Rynek",
    address: "Rynek, 37-700 Przemyśl",
    postalCode: "37-700",
    voivodeship: "Podkarpacie",
    county: "Przemyśl",
    coordinates: { lat: 49.7826, lng: 22.7673 }
  },
  {
    id: "pod_3",
    name: "Jarosław - Rynek",
    address: "Rynek, 37-500 Jarosław",
    postalCode: "37-500",
    voivodeship: "Podkarpacie",
    county: "Jarosław",
    coordinates: { lat: 50.0162, lng: 22.6772 }
  },
  {
    id: "pod_4",
    name: "Sanok - Rynek",
    address: "Rynek, 38-500 Sanok",
    postalCode: "38-500",
    voivodeship: "Podkarpacie",
    county: "Sanok",
    coordinates: { lat: 49.5558, lng: 22.2056 }
  },
  {
    id: "pod_5",
    name: "Krosno - Rynek",
    address: "Rynek, 38-400 Krosno",
    postalCode: "38-400",
    voivodeship: "Podkarpacie",
    county: "Krosno",
    coordinates: { lat: 49.6885, lng: 21.7645 }
  },

  // MAZOWIECKIE
  {
    id: "maz_1",
    name: "Warszawa - Plac Zamkowy",
    address: "Plac Zamkowy, 00-001 Warszawa",
    postalCode: "00-001",
    voivodeship: "Mazowieckie",
    county: "Warszawa",
    coordinates: { lat: 52.2479, lng: 21.0137 }
  },
  {
    id: "maz_2",
    name: "Warszawa - Rynek Starego Miasta",
    address: "Rynek Starego Miasta, 00-272 Warszawa",
    postalCode: "00-272",
    voivodeship: "Mazowieckie",
    county: "Warszawa",
    coordinates: { lat: 52.2500, lng: 21.0125 }
  },
  {
    id: "maz_3",
    name: "Radom - Rynek",
    address: "Rynek, 26-600 Radom",
    postalCode: "26-600",
    voivodeship: "Mazowieckie",
    county: "Radom",
    coordinates: { lat: 51.4025, lng: 21.1471 }
  },
  {
    id: "maz_4",
    name: "Płock - Rynek",
    address: "Rynek, 09-400 Płock",
    postalCode: "09-400",
    voivodeship: "Mazowieckie",
    county: "Płock",
    coordinates: { lat: 52.5468, lng: 19.7064 }
  },
  {
    id: "maz_5",
    name: "Siedlce - Rynek",
    address: "Rynek, 08-110 Siedlce",
    postalCode: "08-110",
    voivodeship: "Mazowieckie",
    county: "Siedlce",
    coordinates: { lat: 52.1677, lng: 22.2901 }
  },

  // ŚLĄSKIE
  {
    id: "sla_1",
    name: "Katowice - Rynek",
    address: "Rynek, 40-001 Katowice",
    postalCode: "40-001",
    voivodeship: "Śląskie",
    county: "Katowice",
    coordinates: { lat: 50.2584, lng: 19.0215 }
  },
  {
    id: "sla_2",
    name: "Częstochowa - Rynek",
    address: "Rynek, 42-200 Częstochowa",
    postalCode: "42-200",
    voivodeship: "Śląskie",
    county: "Częstochowa",
    coordinates: { lat: 50.7969, lng: 19.1241 }
  },
  {
    id: "sla_3",
    name: "Sosnowiec - Centrum",
    address: "ul. 3 Maja, 41-200 Sosnowiec",
    postalCode: "41-200",
    voivodeship: "Śląskie",
    county: "Sosnowiec",
    coordinates: { lat: 50.2863, lng: 19.1040 }
  },
  {
    id: "sla_4",
    name: "Gliwice - Rynek",
    address: "Rynek, 44-100 Gliwice",
    postalCode: "44-100",
    voivodeship: "Śląskie",
    county: "Gliwice",
    coordinates: { lat: 50.2945, lng: 18.6714 }
  },
  {
    id: "sla_5",
    name: "Zabrze - Centrum",
    address: "ul. Wolności, 41-800 Zabrze",
    postalCode: "41-800",
    voivodeship: "Śląskie",
    county: "Zabrze",
    coordinates: { lat: 50.3249, lng: 18.7857 }
  },

  // WIELKOPOLSKA
  {
    id: "wiel_1",
    name: "Poznań - Stary Rynek",
    address: "Stary Rynek, 61-772 Poznań",
    postalCode: "61-772",
    voivodeship: "Wielkopolska",
    county: "Poznań",
    coordinates: { lat: 52.4064, lng: 16.9252 }
  },
  {
    id: "wiel_2",
    name: "Kalisz - Rynek",
    address: "Rynek, 62-800 Kalisz",
    postalCode: "62-800",
    voivodeship: "Wielkopolska",
    county: "Kalisz",
    coordinates: { lat: 51.7619, lng: 18.0912 }
  },
  {
    id: "wiel_3",
    name: "Konin - Rynek",
    address: "Rynek, 62-500 Konin",
    postalCode: "62-500",
    voivodeship: "Wielkopolska",
    county: "Konin",
    coordinates: { lat: 52.2233, lng: 18.2512 }
  },
  {
    id: "wiel_4",
    name: "Piła - Centrum",
    address: "ul. Bydgoska, 64-920 Piła",
    postalCode: "64-920",
    voivodeship: "Wielkopolska",
    county: "Piła",
    coordinates: { lat: 53.1514, lng: 16.7378 }
  },

  // DOLNOŚLĄSKIE
  {
    id: "dol_1",
    name: "Wrocław - Rynek",
    address: "Rynek, 50-101 Wrocław",
    postalCode: "50-101",
    voivodeship: "Dolnośląskie",
    county: "Wrocław",
    coordinates: { lat: 51.1079, lng: 17.0385 }
  },
  {
    id: "dol_2",
    name: "Wałbrzych - Rynek",
    address: "Rynek, 58-300 Wałbrzych",
    postalCode: "58-300",
    voivodeship: "Dolnośląskie",
    county: "Wałbrzych",
    coordinates: { lat: 50.7708, lng: 16.2842 }
  },
  {
    id: "dol_3",
    name: "Legnica - Rynek",
    address: "Rynek, 59-220 Legnica",
    postalCode: "59-220",
    voivodeship: "Dolnośląskie",
    county: "Legnica",
    coordinates: { lat: 51.2104, lng: 16.1619 }
  },
  {
    id: "dol_4",
    name: "Jelenia Góra - Rynek",
    address: "Rynek, 58-500 Jelenia Góra",
    postalCode: "58-500",
    voivodeship: "Dolnośląskie",
    county: "Jelenia Góra",
    coordinates: { lat: 50.9044, lng: 15.7289 }
  },

  // POMORSKIE
  {
    id: "pom_1",
    name: "Gdańsk - Długi Targ",
    address: "Długi Targ, 80-828 Gdańsk",
    postalCode: "80-828",
    voivodeship: "Pomorskie",
    county: "Gdańsk",
    coordinates: { lat: 54.3520, lng: 18.6466 }
  },
  {
    id: "pom_2",
    name: "Gdynia - Skwer Kościuszki",
    address: "Skwer Kościuszki, 81-372 Gdynia",
    postalCode: "81-372",
    voivodeship: "Pomorskie",
    county: "Gdynia",
    coordinates: { lat: 54.5189, lng: 18.5305 }
  },
  {
    id: "pom_3",
    name: "Słupsk - Rynek",
    address: "Rynek, 76-200 Słupsk",
    postalCode: "76-200",
    voivodeship: "Pomorskie",
    county: "Słupsk",
    coordinates: { lat: 54.4642, lng: 17.0285 }
  },
  {
    id: "pom_4",
    name: "Sopot - Monciak",
    address: "ul. Bohaterów Monte Cassino, 81-767 Sopot",
    postalCode: "81-767",
    voivodeship: "Pomorskie",
    county: "Sopot",
    coordinates: { lat: 54.4416, lng: 18.5601 }
  },

  // ZACHODNIOPOMORSKIE
  {
    id: "zach_1",
    name: "Szczecin - Wały Chrobrego",
    address: "Wały Chrobrego, 70-502 Szczecin",
    postalCode: "70-502",
    voivodeship: "Zachodniopomorskie",
    county: "Szczecin",
    coordinates: { lat: 53.4285, lng: 14.5528 }
  },
  {
    id: "zach_2",
    name: "Koszalin - Rynek",
    address: "Rynek, 75-004 Koszalin",
    postalCode: "75-004",
    voivodeship: "Zachodniopomorskie",
    county: "Koszalin",
    coordinates: { lat: 54.1943, lng: 16.1719 }
  },
  {
    id: "zach_3",
    name: "Stargard - Rynek",
    address: "Rynek, 73-110 Stargard",
    postalCode: "73-110",
    voivodeship: "Zachodniopomorskie",
    county: "Stargard",
    coordinates: { lat: 53.3367, lng: 15.0499 }
  },

  // LUBUSKIE
  {
    id: "lub_1",
    name: "Zielona Góra - Rynek",
    address: "Rynek, 65-001 Zielona Góra",
    postalCode: "65-001",
    voivodeship: "Lubuskie",
    county: "Zielona Góra",
    coordinates: { lat: 51.9356, lng: 15.5064 }
  },
  {
    id: "lub_2",
    name: "Gorzów Wielkopolski - Rynek",
    address: "Rynek, 66-400 Gorzów Wielkopolski",
    postalCode: "66-400",
    voivodeship: "Lubuskie",
    county: "Gorzów Wielkopolski",
    coordinates: { lat: 52.7368, lng: 15.2287 }
  },

  // LUBELSKIE
  {
    id: "lubel_1",
    name: "Lublin - Rynek",
    address: "Rynek, 20-111 Lublin",
    postalCode: "20-111",
    voivodeship: "Lubelskie",
    county: "Lublin",
    coordinates: { lat: 51.2465, lng: 22.5684 }
  },
  {
    id: "lubel_2",
    name: "Zamość - Rynek Wielki",
    address: "Rynek Wielki, 22-400 Zamość",
    postalCode: "22-400",
    voivodeship: "Lubelskie",
    county: "Zamość",
    coordinates: { lat: 50.7181, lng: 23.2520 }
  },
  {
    id: "lubel_3",
    name: "Puławy - Centrum",
    address: "ul. Lubelska, 24-100 Puławy",
    postalCode: "24-100",
    voivodeship: "Lubelskie",
    county: "Puławy",
    coordinates: { lat: 51.4164, lng: 21.9692 }
  },

  // PODLASKIE
  {
    id: "podl_1",
    name: "Białystok - Rynek Kościuszki",
    address: "Rynek Kościuszki, 15-001 Białystok",
    postalCode: "15-001",
    voivodeship: "Podlaskie",
    county: "Białystok",
    coordinates: { lat: 53.1325, lng: 23.1688 }
  },
  {
    id: "podl_2",
    name: "Suwałki - Rynek",
    address: "Rynek, 16-400 Suwałki",
    postalCode: "16-400",
    voivodeship: "Podlaskie",
    county: "Suwałki",
    coordinates: { lat: 54.1115, lng: 22.9309 }
  },
  {
    id: "podl_3",
    name: "Łomża - Rynek",
    address: "Rynek, 18-400 Łomża",
    postalCode: "18-400",
    voivodeship: "Podlaskie",
    county: "Łomża",
    coordinates: { lat: 53.1784, lng: 22.0594 }
  },

  // ŚWIĘTOKRZYSKIE
  {
    id: "swiet_1",
    name: "Kielce - Rynek",
    address: "Rynek, 25-001 Kielce",
    postalCode: "25-001",
    voivodeship: "Świętokrzyskie",
    county: "Kielce",
    coordinates: { lat: 50.8703, lng: 20.6286 }
  },
  {
    id: "swiet_2",
    name: "Ostrowiec Świętokrzyski - Rynek",
    address: "Rynek, 27-400 Ostrowiec Świętokrzyski",
    postalCode: "27-400",
    voivodeship: "Świętokrzyskie",
    county: "Ostrowiec Świętokrzyski",
    coordinates: { lat: 50.9294, lng: 21.3853 }
  },

  // ŁÓDZKIE
  {
    id: "lodz_1",
    name: "Łódź - Plac Wolności",
    address: "Plac Wolności, 90-001 Łódź",
    postalCode: "90-001",
    voivodeship: "Łódzkie",
    county: "Łódź",
    coordinates: { lat: 51.7592, lng: 19.4560 }
  },
  {
    id: "lodz_2",
    name: "Piotrków Trybunalski - Rynek",
    address: "Rynek, 97-300 Piotrków Trybunalski",
    postalCode: "97-300",
    voivodeship: "Łódzkie",
    county: "Piotrków Trybunalski",
    coordinates: { lat: 51.4054, lng: 19.7032 }
  },
  {
    id: "lodz_3",
    name: "Pabianice - Rynek",
    address: "Rynek, 95-200 Pabianice",
    postalCode: "95-200",
    voivodeship: "Łódzkie",
    county: "Pabianice",
    coordinates: { lat: 51.6644, lng: 19.3547 }
  },

  // KUJAWSKO-POMORSKIE
  {
    id: "kuj_1",
    name: "Bydgoszcz - Stary Rynek",
    address: "Stary Rynek, 85-001 Bydgoszcz",
    postalCode: "85-001",
    voivodeship: "Kujawsko-Pomorskie",
    county: "Bydgoszcz",
    coordinates: { lat: 53.1235, lng: 18.0084 }
  },
  {
    id: "kuj_2",
    name: "Toruń - Rynek Staromiejski",
    address: "Rynek Staromiejski, 87-100 Toruń",
    postalCode: "87-100",
    voivodeship: "Kujawsko-Pomorskie",
    county: "Toruń",
    coordinates: { lat: 53.0103, lng: 18.6042 }
  },
  {
    id: "kuj_3",
    name: "Włocławek - Rynek",
    address: "Rynek, 87-800 Włocławek",
    postalCode: "87-800",
    voivodeship: "Kujawsko-Pomorskie",
    county: "Włocławek",
    coordinates: { lat: 52.6482, lng: 19.0678 }
  },

  // WARMINSKO-MAZURSKIE
  {
    id: "warm_1",
    name: "Olsztyn - Rynek",
    address: "Rynek, 10-101 Olsztyn",
    postalCode: "10-101",
    voivodeship: "Warmińsko-Mazurskie",
    county: "Olsztyn",
    coordinates: { lat: 53.7784, lng: 20.4801 }
  },
  {
    id: "warm_2",
    name: "Elbląg - Stary Rynek",
    address: "Stary Rynek, 82-300 Elbląg",
    postalCode: "82-300",
    voivodeship: "Warmińsko-Mazurskie",
    county: "Elbląg",
    coordinates: { lat: 54.1561, lng: 19.4045 }
  },
  {
    id: "warm_3",
    name: "Ełk - Rynek",
    address: "Rynek, 19-300 Ełk",
    postalCode: "19-300",
    voivodeship: "Warmińsko-Mazurskie",
    county: "Ełk",
    coordinates: { lat: 53.8283, lng: 22.3647 }
  },

  // OPOLSKIE
  {
    id: "opol_1",
    name: "Opole - Rynek",
    address: "Rynek, 45-001 Opole",
    postalCode: "45-001",
    voivodeship: "Opolskie",
    county: "Opole",
    coordinates: { lat: 50.6711, lng: 17.9263 }
  },
  {
    id: "opol_2",
    name: "Kędzierzyn-Koźle - Centrum",
    address: "ul. Piastowska, 47-220 Kędzierzyn-Koźle",
    postalCode: "47-220",
    voivodeship: "Opolskie",
    county: "Kędzierzyn-Koźle",
    coordinates: { lat: 50.3494, lng: 18.2261 }
  }
];
