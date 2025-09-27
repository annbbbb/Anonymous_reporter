-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  location JSONB NOT NULL,
  photos TEXT[] DEFAULT '{}',
  send_to_authorities BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'resolved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- Create locations table
CREATE TABLE IF NOT EXISTS locations (
  id VARCHAR(20) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  postal_code VARCHAR(10) NOT NULL,
  voivodeship VARCHAR(50) NOT NULL,
  county VARCHAR(50) NOT NULL,
  coordinates JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert Polish locations data
INSERT INTO locations (id, name, address, postal_code, voivodeship, county, coordinates) VALUES
-- MAŁOPOLSKA
('mal_1', 'Kraków - Rynek Główny', 'Rynek Główny, 31-042 Kraków', '31-042', 'Małopolska', 'Kraków', '{"lat": 50.0614, "lng": 19.9372}'),
('mal_2', 'Kraków - Wawel', 'Wawel 5, 31-001 Kraków', '31-001', 'Małopolska', 'Kraków', '{"lat": 50.0547, "lng": 19.9352}'),
('mal_3', 'Tarnów - Rynek', 'Rynek, 33-100 Tarnów', '33-100', 'Małopolska', 'Tarnów', '{"lat": 50.0121, "lng": 20.9858}'),
('mal_4', 'Nowy Sącz - Rynek', 'Rynek, 33-300 Nowy Sącz', '33-300', 'Małopolska', 'Nowy Sącz', '{"lat": 49.6218, "lng": 20.6969}'),
('mal_5', 'Zakopane - Krupówki', 'ul. Krupówki, 34-500 Zakopane', '34-500', 'Małopolska', 'Tatrzański', '{"lat": 49.2992, "lng": 19.9496}'),
('mal_6', 'Oświęcim - Centrum', 'Rynek Główny, 32-600 Oświęcim', '32-600', 'Małopolska', 'Oświęcim', '{"lat": 50.0344, "lng": 19.2214}'),

-- PODKARPACIE
('pod_1', 'Rzeszów - Rynek', 'Rynek, 35-064 Rzeszów', '35-064', 'Podkarpacie', 'Rzeszów', '{"lat": 50.0412, "lng": 22.0041}'),
('pod_2', 'Przemyśl - Rynek', 'Rynek, 37-700 Przemyśl', '37-700', 'Podkarpacie', 'Przemyśl', '{"lat": 49.7826, "lng": 22.7673}'),
('pod_3', 'Jarosław - Rynek', 'Rynek, 37-500 Jarosław', '37-500', 'Podkarpacie', 'Jarosław', '{"lat": 50.0162, "lng": 22.6772}'),
('pod_4', 'Sanok - Rynek', 'Rynek, 38-500 Sanok', '38-500', 'Podkarpacie', 'Sanok', '{"lat": 49.5558, "lng": 22.2056}'),
('pod_5', 'Krosno - Rynek', 'Rynek, 38-400 Krosno', '38-400', 'Podkarpacie', 'Krosno', '{"lat": 49.6885, "lng": 21.7645}'),

-- MAZOWIECKIE
('maz_1', 'Warszawa - Plac Zamkowy', 'Plac Zamkowy, 00-001 Warszawa', '00-001', 'Mazowieckie', 'Warszawa', '{"lat": 52.2479, "lng": 21.0137}'),
('maz_2', 'Warszawa - Rynek Starego Miasta', 'Rynek Starego Miasta, 00-272 Warszawa', '00-272', 'Mazowieckie', 'Warszawa', '{"lat": 52.2500, "lng": 21.0125}'),
('maz_3', 'Radom - Rynek', 'Rynek, 26-600 Radom', '26-600', 'Mazowieckie', 'Radom', '{"lat": 51.4025, "lng": 21.1471}'),
('maz_4', 'Płock - Rynek', 'Rynek, 09-400 Płock', '09-400', 'Mazowieckie', 'Płock', '{"lat": 52.5468, "lng": 19.7064}'),
('maz_5', 'Siedlce - Rynek', 'Rynek, 08-110 Siedlce', '08-110', 'Mazowieckie', 'Siedlce', '{"lat": 52.1677, "lng": 22.2901}'),

-- ŚLĄSKIE
('sla_1', 'Katowice - Rynek', 'Rynek, 40-001 Katowice', '40-001', 'Śląskie', 'Katowice', '{"lat": 50.2584, "lng": 19.0215}'),
('sla_2', 'Częstochowa - Rynek', 'Rynek, 42-200 Częstochowa', '42-200', 'Śląskie', 'Częstochowa', '{"lat": 50.7969, "lng": 19.1241}'),
('sla_3', 'Sosnowiec - Centrum', 'ul. 3 Maja, 41-200 Sosnowiec', '41-200', 'Śląskie', 'Sosnowiec', '{"lat": 50.2863, "lng": 19.1040}'),
('sla_4', 'Gliwice - Rynek', 'Rynek, 44-100 Gliwice', '44-100', 'Śląskie', 'Gliwice', '{"lat": 50.2945, "lng": 18.6714}'),
('sla_5', 'Zabrze - Centrum', 'ul. Wolności, 41-800 Zabrze', '41-800', 'Śląskie', 'Zabrze', '{"lat": 50.3249, "lng": 18.7857}'),

-- WIELKOPOLSKA
('wiel_1', 'Poznań - Stary Rynek', 'Stary Rynek, 61-772 Poznań', '61-772', 'Wielkopolska', 'Poznań', '{"lat": 52.4064, "lng": 16.9252}'),
('wiel_2', 'Kalisz - Rynek', 'Rynek, 62-800 Kalisz', '62-800', 'Wielkopolska', 'Kalisz', '{"lat": 51.7619, "lng": 18.0912}'),
('wiel_3', 'Konin - Rynek', 'Rynek, 62-500 Konin', '62-500', 'Wielkopolska', 'Konin', '{"lat": 52.2233, "lng": 18.2512}'),
('wiel_4', 'Piła - Centrum', 'ul. Bydgoska, 64-920 Piła', '64-920', 'Wielkopolska', 'Piła', '{"lat": 53.1514, "lng": 16.7378}'),

-- DOLNOŚLĄSKIE
('dol_1', 'Wrocław - Rynek', 'Rynek, 50-101 Wrocław', '50-101', 'Dolnośląskie', 'Wrocław', '{"lat": 51.1079, "lng": 17.0385}'),
('dol_2', 'Wałbrzych - Rynek', 'Rynek, 58-300 Wałbrzych', '58-300', 'Dolnośląskie', 'Wałbrzych', '{"lat": 50.7708, "lng": 16.2842}'),
('dol_3', 'Legnica - Rynek', 'Rynek, 59-220 Legnica', '59-220', 'Dolnośląskie', 'Legnica', '{"lat": 51.2104, "lng": 16.1619}'),
('dol_4', 'Jelenia Góra - Rynek', 'Rynek, 58-500 Jelenia Góra', '58-500', 'Dolnośląskie', 'Jelenia Góra', '{"lat": 50.9044, "lng": 15.7289}'),

-- POMORSKIE
('pom_1', 'Gdańsk - Długi Targ', 'Długi Targ, 80-828 Gdańsk', '80-828', 'Pomorskie', 'Gdańsk', '{"lat": 54.3520, "lng": 18.6466}'),
('pom_2', 'Gdynia - Skwer Kościuszki', 'Skwer Kościuszki, 81-372 Gdynia', '81-372', 'Pomorskie', 'Gdynia', '{"lat": 54.5189, "lng": 18.5305}'),
('pom_3', 'Słupsk - Rynek', 'Rynek, 76-200 Słupsk', '76-200', 'Pomorskie', 'Słupsk', '{"lat": 54.4642, "lng": 17.0285}'),
('pom_4', 'Sopot - Monciak', 'ul. Bohaterów Monte Cassino, 81-767 Sopot', '81-767', 'Pomorskie', 'Sopot', '{"lat": 54.4416, "lng": 18.5601}'),

-- ZACHODNIOPOMORSKIE
('zach_1', 'Szczecin - Wały Chrobrego', 'Wały Chrobrego, 70-502 Szczecin', '70-502', 'Zachodniopomorskie', 'Szczecin', '{"lat": 53.4285, "lng": 14.5528}'),
('zach_2', 'Koszalin - Rynek', 'Rynek, 75-004 Koszalin', '75-004', 'Zachodniopomorskie', 'Koszalin', '{"lat": 54.1943, "lng": 16.1719}'),
('zach_3', 'Stargard - Rynek', 'Rynek, 73-110 Stargard', '73-110', 'Zachodniopomorskie', 'Stargard', '{"lat": 53.3367, "lng": 15.0499}'),

-- LUBUSKIE
('lub_1', 'Zielona Góra - Rynek', 'Rynek, 65-001 Zielona Góra', '65-001', 'Lubuskie', 'Zielona Góra', '{"lat": 51.9356, "lng": 15.5064}'),
('lub_2', 'Gorzów Wielkopolski - Rynek', 'Rynek, 66-400 Gorzów Wielkopolski', '66-400', 'Lubuskie', 'Gorzów Wielkopolski', '{"lat": 52.7368, "lng": 15.2287}'),

-- LUBELSKIE
('lubel_1', 'Lublin - Rynek', 'Rynek, 20-111 Lublin', '20-111', 'Lubelskie', 'Lublin', '{"lat": 51.2465, "lng": 22.5684}'),
('lubel_2', 'Zamość - Rynek Wielki', 'Rynek Wielki, 22-400 Zamość', '22-400', 'Lubelskie', 'Zamość', '{"lat": 50.7181, "lng": 23.2520}'),
('lubel_3', 'Puławy - Centrum', 'ul. Lubelska, 24-100 Puławy', '24-100', 'Lubelskie', 'Puławy', '{"lat": 51.4164, "lng": 21.9692}'),

-- PODLASKIE
('podl_1', 'Białystok - Rynek Kościuszki', 'Rynek Kościuszki, 15-001 Białystok', '15-001', 'Podlaskie', 'Białystok', '{"lat": 53.1325, "lng": 23.1688}'),
('podl_2', 'Suwałki - Rynek', 'Rynek, 16-400 Suwałki', '16-400', 'Podlaskie', 'Suwałki', '{"lat": 54.1115, "lng": 22.9309}'),
('podl_3', 'Łomża - Rynek', 'Rynek, 18-400 Łomża', '18-400', 'Podlaskie', 'Łomża', '{"lat": 53.1784, "lng": 22.0594}'),

-- ŚWIĘTOKRZYSKIE
('swiet_1', 'Kielce - Rynek', 'Rynek, 25-001 Kielce', '25-001', 'Świętokrzyskie', 'Kielce', '{"lat": 50.8703, "lng": 20.6286}'),
('swiet_2', 'Ostrowiec Świętokrzyski - Rynek', 'Rynek, 27-400 Ostrowiec Świętokrzyski', '27-400', 'Świętokrzyskie', 'Ostrowiec Świętokrzyski', '{"lat": 50.9294, "lng": 21.3853}'),

-- ŁÓDZKIE
('lodz_1', 'Łódź - Plac Wolności', 'Plac Wolności, 90-001 Łódź', '90-001', 'Łódzkie', 'Łódź', '{"lat": 51.7592, "lng": 19.4560}'),
('lodz_2', 'Piotrków Trybunalski - Rynek', 'Rynek, 97-300 Piotrków Trybunalski', '97-300', 'Łódzkie', 'Piotrków Trybunalski', '{"lat": 51.4054, "lng": 19.7032}'),
('lodz_3', 'Pabianice - Rynek', 'Rynek, 95-200 Pabianice', '95-200', 'Łódzkie', 'Pabianice', '{"lat": 51.6644, "lng": 19.3547}'),

-- KUJAWSKO-POMORSKIE
('kuj_1', 'Bydgoszcz - Stary Rynek', 'Stary Rynek, 85-001 Bydgoszcz', '85-001', 'Kujawsko-Pomorskie', 'Bydgoszcz', '{"lat": 53.1235, "lng": 18.0084}'),
('kuj_2', 'Toruń - Rynek Staromiejski', 'Rynek Staromiejski, 87-100 Toruń', '87-100', 'Kujawsko-Pomorskie', 'Toruń', '{"lat": 53.0103, "lng": 18.6042}'),
('kuj_3', 'Włocławek - Rynek', 'Rynek, 87-800 Włocławek', '87-800', 'Kujawsko-Pomorskie', 'Włocławek', '{"lat": 52.6482, "lng": 19.0678}'),

-- WARMINSKO-MAZURSKIE
('warm_1', 'Olsztyn - Rynek', 'Rynek, 10-101 Olsztyn', '10-101', 'Warmińsko-Mazurskie', 'Olsztyn', '{"lat": 53.7784, "lng": 20.4801}'),
('warm_2', 'Elbląg - Stary Rynek', 'Stary Rynek, 82-300 Elbląg', '82-300', 'Warmińsko-Mazurskie', 'Elbląg', '{"lat": 54.1561, "lng": 19.4045}'),
('warm_3', 'Ełk - Rynek', 'Rynek, 19-300 Ełk', '19-300', 'Warmińsko-Mazurskie', 'Ełk', '{"lat": 53.8283, "lng": 22.3647}'),

-- OPOLSKIE
('opol_1', 'Opole - Rynek', 'Rynek, 45-001 Opole', '45-001', 'Opolskie', 'Opole', '{"lat": 50.6711, "lng": 17.9263}'),
('opol_2', 'Kędzierzyn-Koźle - Centrum', 'ul. Piastowska, 47-220 Kędzierzyn-Koźle', '47-220', 'Opolskie', 'Kędzierzyn-Koźle', '{"lat": 50.3494, "lng": 18.2261}')
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous access (only if they don't exist)
DO $$ 
BEGIN
    -- Policy for locations read access
    IF NOT EXISTS (SELECT 1 FROM pg_policies 
                   WHERE tablename = 'locations' AND policyname = 'Allow anonymous read access to locations') THEN
        CREATE POLICY "Allow anonymous read access to locations" ON locations
          FOR SELECT USING (true);
    END IF;
    
    -- Policy for reports insert
    IF NOT EXISTS (SELECT 1 FROM pg_policies 
                   WHERE tablename = 'reports' AND policyname = 'Allow anonymous insert to reports') THEN
        CREATE POLICY "Allow anonymous insert to reports" ON reports
          FOR INSERT WITH CHECK (true);
    END IF;
    
    -- Policy for reports read access
    IF NOT EXISTS (SELECT 1 FROM pg_policies 
                   WHERE tablename = 'reports' AND policyname = 'Allow anonymous read access to reports') THEN
        CREATE POLICY "Allow anonymous read access to reports" ON reports
          FOR SELECT USING (true);
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_category ON reports(category);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at);
CREATE INDEX IF NOT EXISTS idx_locations_voivodeship ON locations(voivodeship);
CREATE INDEX IF NOT EXISTS idx_locations_postal_code ON locations(postal_code);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for reports table (only if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_reports_updated_at') THEN
        CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;
