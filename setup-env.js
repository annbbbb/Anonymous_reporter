// Simple script to help create .env file
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envContent = `# Supabase Configuration
# Replace these with your actual Supabase project credentials
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Example:
# VITE_SUPABASE_URL=https://your-project-id.supabase.co
# VITE_SUPABASE_ANON_KEY=your-anon-key-here
`;

const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env file');
  console.log('📝 Please edit .env file with your Supabase credentials');
} else {
  console.log('⚠️  .env file already exists');
}

console.log('\n📋 Next steps:');
console.log('1. Get your Supabase URL and anon key from supabase.com');
console.log('2. Edit the .env file with your credentials');
console.log('3. Restart your development server');
console.log('4. Test report submission');
