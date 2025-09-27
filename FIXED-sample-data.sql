-- FIXED Sample Data - simple INSERT with ON CONFLICT
-- This script can be run multiple times without errors

-- Insert sample reports (will skip if already exist)
INSERT INTO reports (id, category, description, location, photos, send_to_authorities, status, priority, ai_analysis, ai_suggested_category, ai_urgency_score, ai_confidence_score, created_at, updated_at) VALUES

-- Critical priority report
('550e8400-e29b-41d4-a716-446655440001', 'safety', 'Emergency situation at the construction site on Main Street. Workers are not wearing safety helmets and there are exposed electrical wires. This is extremely dangerous and needs immediate attention.', 
 '{"postalCode": "31-042", "name": "Kraków - Rynek Główny", "address": "Rynek Główny, 31-042 Kraków", "coordinates": {"lat": 50.0614, "lng": 19.9372}}', 
 ARRAY[]::text[], true, 'pending', 'critical',
 '{"sentiment": "negative", "urgency": "critical", "suggestedCategory": "safety", "keyEntities": ["construction site", "safety helmets", "electrical wires"], "riskScore": 95, "confidence": 0.9}',
 'safety', 95, 0.9,
 NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours'),

-- High priority report
('550e8400-e29b-41d4-a716-446655440002', 'workplace', 'My supervisor is creating a hostile work environment. He constantly makes inappropriate comments about female employees and threatens to fire anyone who complains.', 
 '{"postalCode": "40-001", "name": "Katowice - Rynek", "address": "Rynek, 40-001 Katowice", "coordinates": {"lat": 50.2584, "lng": 19.0215}}',
 ARRAY[]::text[], true, 'in_review', 'high',
 '{"sentiment": "negative", "urgency": "high", "suggestedCategory": "workplace", "keyEntities": ["supervisor", "hostile work environment", "inappropriate comments"], "riskScore": 85, "confidence": 0.8}',
 'workplace', 85, 0.8,
 NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),

-- Medium priority report
('550e8400-e29b-41d4-a716-446655440003', 'environmental', 'There is illegal dumping of chemical waste in the forest near the industrial zone. I noticed strange containers and a strong chemical smell.', 
 '{"postalCode": "50-101", "name": "Wrocław - Rynek", "address": "Rynek, 50-101 Wrocław", "coordinates": {"lat": 51.1079, "lng": 17.0385}}',
 ARRAY[]::text[], false, 'pending', 'medium',
 '{"sentiment": "negative", "urgency": "medium", "suggestedCategory": "environmental", "keyEntities": ["illegal dumping", "chemical waste", "forest"], "riskScore": 65, "confidence": 0.7}',
 'environmental', 65, 0.7,
 NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),

-- Low priority report
('550e8400-e29b-41d4-a716-446655440004', 'other', 'The public library needs better accessibility features. There are no ramps for wheelchair users and the elevator is often out of order.', 
 '{"postalCode": "80-828", "name": "Gdańsk - Długi Targ", "address": "Długi Targ, 80-828 Gdańsk", "coordinates": {"lat": 54.3520, "lng": 18.6466}}',
 ARRAY[]::text[], false, 'resolved', 'low',
 '{"sentiment": "neutral", "urgency": "low", "suggestedCategory": "other", "keyEntities": ["public library", "accessibility", "wheelchair users"], "riskScore": 30, "confidence": 0.6}',
 'other', 30, 0.6,
 NOW() - INTERVAL '1 week', NOW() - INTERVAL '2 days'),

-- Financial misconduct report
('550e8400-e29b-41d4-a716-446655440005', 'financial', 'I suspect embezzlement in our company. The accounting department has been reporting inflated expenses and I have evidence of unauthorized transactions.', 
 '{"postalCode": "00-001", "name": "Warszawa - Plac Zamkowy", "address": "Plac Zamkowy, 00-001 Warszawa", "coordinates": {"lat": 52.2479, "lng": 21.0137}}',
 ARRAY[]::text[], true, 'in_review', 'high',
 '{"sentiment": "negative", "urgency": "high", "suggestedCategory": "financial", "keyEntities": ["embezzlement", "accounting department", "inflated expenses"], "riskScore": 80, "confidence": 0.85}',
 'financial', 80, 0.85,
 NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),

-- Legal violation report
('550e8400-e29b-41d4-a716-446655440006', 'legal', 'The local restaurant is operating without proper health permits and serving expired food. This poses a serious health risk to customers.', 
 '{"postalCode": "61-772", "name": "Poznań - Stary Rynek", "address": "Stary Rynek, 61-772 Poznań", "coordinates": {"lat": 52.4064, "lng": 16.9252}}',
 ARRAY[]::text[], true, 'pending', 'high',
 '{"sentiment": "negative", "urgency": "high", "suggestedCategory": "legal", "keyEntities": ["restaurant", "health permits", "expired food"], "riskScore": 75, "confidence": 0.8}',
 'legal', 75, 0.8,
 NOW() - INTERVAL '6 hours', NOW() - INTERVAL '6 hours'),

-- Resolved report
('550e8400-e29b-41d4-a716-446655440007', 'safety', 'The broken streetlight on Oak Avenue has been fixed. Thank you for the quick response. The area is now much safer for pedestrians at night.', 
 '{"postalCode": "70-502", "name": "Szczecin - Wały Chrobrego", "address": "Wały Chrobrego, 70-502 Szczecin", "coordinates": {"lat": 53.4285, "lng": 14.5528}}',
 ARRAY[]::text[], false, 'resolved', 'low',
 '{"sentiment": "positive", "urgency": "low", "suggestedCategory": "safety", "keyEntities": ["streetlight", "Oak Avenue", "pedestrians"], "riskScore": 20, "confidence": 0.7}',
 'safety', 20, 0.7,
 NOW() - INTERVAL '2 weeks', NOW() - INTERVAL '1 week'),

-- Rejected report
('550e8400-e29b-41d4-a716-446655440008', 'other', 'The noise from the construction site is too loud. I cannot sleep at night because of the constant drilling and heavy machinery.', 
 '{"postalCode": "35-064", "name": "Rzeszów - Rynek", "address": "Rynek, 35-064 Rzeszów", "coordinates": {"lat": 50.0412, "lng": 22.0041}}',
 ARRAY[]::text[], false, 'rejected', 'low',
 '{"sentiment": "negative", "urgency": "low", "suggestedCategory": "other", "keyEntities": ["noise", "construction site", "drilling"], "riskScore": 25, "confidence": 0.5}',
 'other', 25, 0.5,
 NOW() - INTERVAL '5 days', NOW() - INTERVAL '3 days')

-- Use ON CONFLICT to skip if already exists
ON CONFLICT (id) DO NOTHING;

-- Success message
SELECT 'Sample data inserted successfully!' as message;
