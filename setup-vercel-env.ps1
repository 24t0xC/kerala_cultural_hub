# Kerala Cultural Hub - Vercel Environment Setup
# Run this script to set up environment variables

Write-Host "Setting up Vercel Environment Variables..." -ForegroundColor Green

# Add environment variables to Vercel
vercel env add VITE_SUPABASE_URL "https://ydxfbmhvapdowmawypsf.supabase.co" production preview development
vercel env add VITE_SUPABASE_ANON_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkeGZibWh2YXBkb3dtYXd5cHNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyNDMwMzUsImV4cCI6MjA2OTgxOTAzNX0._NAXzf9hlPkdXpDJqKExvRMf7nGP3CAopJjRDQkQ4mk" production preview development
vercel env add VITE_STRIPE_PUBLISHABLE_KEY "pk_test_51Rs5wvRzGfvY7ay7VBmVNT5tVPKbKE5r1q2YZ4eh7dJVrbTMxbnDINjGMI9bMCUisnfktbTs77naXf93JzSf4zgm008qj7nLCM" production preview development

Write-Host "Environment variables set up successfully!" -ForegroundColor Green
Write-Host "Triggering redeploy..." -ForegroundColor Yellow

# Trigger redeploy
vercel --prod