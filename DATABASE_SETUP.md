# Database Setup Guide

Your application needs to initialize the database tables. Choose one of these methods:

## Option 1: Use the Database Init API (Easiest for Development)

### Step 1: Start your development server
```bash
npm run dev
```

### Step 2: Open in your browser
Navigate to: `http://localhost:3000/api/db/init` and make a POST request

**Using curl:**
```bash
curl -X POST http://localhost:3000/api/db/init
```

**Using VS Code REST Client extension:**
Create a file `test.http` with:
```http
POST http://localhost:3000/api/db/init
```

**Using JavaScript fetch:**
```javascript
fetch('http://localhost:3000/api/db/init', { method: 'POST' })
  .then(r => r.json())
  .then(console.log)
```

### Expected Response:
```json
{
  "success": true,
  "message": "Database initialized successfully"
}
```

---

## Option 2: Run SQL Directly (Using psql)

### Step 1: Connect to your PostgreSQL database
```bash
psql postgresql://user:password@localhost:5432/resume_analyzer
```

### Step 2: Run the migration SQL
Copy the entire content from `src/lib/db/migrations/0000_warm_colossus.sql` and paste it into psql.

Or run it as a file:
```bash
psql postgresql://user:password@localhost:5432/resume_analyzer < src/lib/db/migrations/0000_warm_colossus.sql
```

---

## Option 3: Use Drizzle Kit (Recommended for Production)

### Step 1: Ensure environment variables are set
Check your `.env.local` file has:
```
DATABASE_URL=postgresql://user:password@localhost:5432/resume_analyzer
```

### Step 2: Run migration
```bash
npx drizzle-kit migrate
```

If that has issues, try with explicit config:
```bash
npx drizzle-kit migrate --config drizzle.config.ts
```

---

## Troubleshooting

### Error: "Cannot find module 'postgres'"
**Solution:** Install postgres package
```bash
npm install postgres
```

### Error: "Connection refused"
**Solution:** Ensure PostgreSQL is running
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Or on Mac:
brew services list | grep postgres
```

### Error: "Database does not exist"
**Solution:** Create the database first
```bash
createdb resume_analyzer
```

### Error: "relation 'users' does not exist"
**Solution:** Run one of the database initialization methods above

---

## Database Schema

### Users Table
- `id`: UUID (Primary Key)
- `auth_id`: Text (Unique) - Supabase auth ID
- `email`: VARCHAR(255) (Unique)
- `name`: VARCHAR(255) (Optional)
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Resumes Table
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key → users.id)
- `file_name`: VARCHAR(255)
- `raw_text`: Text (PDF text content)
- `resume_data`: JSONB (Parsed resume structure)
- `selected_template`: VARCHAR(50) (Default: 'modern')
- `uploaded_at`: Timestamp
- `updated_at`: Timestamp

### Analyses Table
- `id`: UUID (Primary Key)
- `resume_id`: UUID (Foreign Key → resumes.id)
- `job_description`: Text (Optional)
- `overall_score`: Integer (0-100)
- `scores`: JSONB (Relevance, Experience, Skills, Education, Formatting, Impact)
- `extracted_data`: JSONB (Extracted resume content)
- `suggestions`: JSONB (Array of improvement suggestions)
- `job_match`: JSONB (Optional - Job matching data)
- `analyzed_at`: Timestamp

---

## Verify Installation

After running initialization, test the connection:

### Using the app
1. Login to the application
2. Go to `/dashboard/new`
3. Upload a resume PDF
4. Click "Analyze Resume"
5. Should complete successfully and redirect to results

### Using SQL
```bash
psql postgresql://user:password@localhost:5432/resume_analyzer

# Check tables exist
\dt

# Should output:
# users, resumes, analyses tables
```

---

## Next Steps

After database initialization:

1. ✅ Login to the application
2. ✅ Upload a resume PDF
3. ✅ Add job description (optional)
4. ✅ Click "Analyze Resume"
5. ✅ View results and edit resume
6. ✅ Check history tab for previous analyses

---

## For Production Deployment

1. Use `drizzle-kit migrate` as part of your CI/CD pipeline
2. Never use the `/api/db/init` endpoint in production
3. Run migrations before deploying application code
4. Always backup your database before running migrations
5. Test migrations in a staging environment first

