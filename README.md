# Construction Site Petty Cash & Daily Expense Tracker

A full-stack petty cash management system for **Dhatri Constructions**. Site supervisors can record daily construction-site expenses with receipt images, while admins and project managers can monitor issued cash, spending, balances, and weekly summaries in real time.

## Project Goal

Dhatri Constructions manages multiple active construction sites where supervisors receive petty cash for day-to-day work such as labour payments, material purchases, tools, transport, and food. Without a digital tracker, receipts are collected manually and project managers only discover spending patterns after week-end or month-end reconciliation.

This application helps the team:

- Register construction projects and sites.
- Issue daily petty cash to supervisors.
- Record every site expense with category, amount, description, and optional receipt image.
- Track issued cash, spent amount, and current balance.
- Flag negative balances as cash shortfalls.
- Show project/site dashboards and category-wise spending.
- Generate weekly expense summaries.

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- Redux Toolkit
- React Router
- Axios
- Recharts
- Tailwind CSS

### Backend

- Python Flask
- Flask SQLAlchemy
- PostgreSQL
- Flask JWT Extended
- Flask CORS
- Flask Migrate
- Cloudinary for receipt image uploads

## Folder Structure

```text
FullStack_pettyCash/
├── backend/
│   ├── app.py
│   ├── init_db.py
│   ├── database/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── migrations/
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── app/
│   │   ├── components/
│   │   ├── features/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── utils/
│   ├── package.json
│   └── vite.config.ts
├── docs/
└── README.md
```

## Main User Roles

### Admin

Admins manage the complete system:

- Create projects.
- Register sites.
- Create users.
- Issue petty cash.
- View company-wide dashboards.
- View all expenses.
- Generate weekly reports.

### Project Manager

Project managers monitor their assigned project:

- View project dashboard.
- View sites under their project.
- View project-level cash issuances.
- View project-level expenses.
- Generate weekly reports for their project sites.

### Supervisor

Supervisors record site-level spending:

- View assigned site dashboard.
- View petty cash received.
- Add expenses.
- Upload receipt images.
- Edit/delete their own site expenses.
- See balance and cash shortfall warning.
- Change password.

## Core Workflow

1. Admin creates a project with a monthly petty cash budget.
2. Admin creates a construction site under that project.
3. Admin or project manager issues petty cash to the site.
4. Supervisor logs expenses during the day.
5. The system calculates the running balance.
6. If spent amount is greater than issued amount, the system flags a cash shortfall.
7. Admin/project manager reviews dashboards and weekly summaries.

## Test Credentials

Run `backend/init_db.py` first to create these users and sample data.

| Role | Username | Password | Notes |
| --- | --- | --- | --- |
| Admin | `admin` | `admin123` | Default super admin |
| Admin | `vikrambalai1002@gmail.com` | `password` | Additional admin test user |
| Project Manager | `PM001` | `default123` | Assigned to `SkyView Apartments` |
| Supervisor | `SITE001` | `default123` | Assigned to site `Tower A` |

Seeded sample data:

- Project: `SkyView Apartments`
- Monthly budget: `5000000`
- Site: `Tower A`
- Site code: `SITE001`
- Sample cash issuance: `10000`
- Sample expenses:
  - Labour: `1500`
  - Material: `4500`

## Backend Setup

Go to the backend directory:

```bash
cd backend
```

Create and activate a virtual environment:

```bash
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create `backend/.env`:

```env
DATABASE_URL=postgresql://username:password@host:port/database_name
JWT_SECRET_KEY=change-this-secret-in-production

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Initialize tables and seed test data:

```bash
python init_db.py
```

Start the Flask backend:

```bash
python app.py
```

Backend runs on:

```text
http://localhost:5000
```

API base URL:

```text
http://localhost:5000/api
```

## Frontend Setup

Go to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create `frontend/.env`:

```env
API_URL=http://localhost:5000/api
```

The frontend also supports Vite-style naming:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Frontend normally runs on:

```text
http://localhost:5173
```

If port `5173` is already busy, Vite will automatically use another port, such as `5174`.

## Useful Commands

### Backend

```bash
cd backend
source venv/bin/activate
python init_db.py
python app.py
```

Compile-check backend files:

```bash
python -m compileall .
```

### Frontend

```bash
cd frontend
npm run dev
npm run build
npm run lint
```

## Environment Variables

### Backend

| Key | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET_KEY` | Recommended | Secret used to sign JWT tokens |
| `CLOUDINARY_CLOUD_NAME` | Required for uploads | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Required for uploads | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Required for uploads | Cloudinary API secret |

### Frontend

| Key | Required | Purpose |
| --- | --- | --- |
| `API_URL` | Recommended | Backend API base URL |
| `VITE_API_URL` | Optional fallback | Vite-style backend API base URL |

The frontend checks API URLs in this order:

1. `API_URL`
2. `VITE_API_URL`
3. `http://localhost:5000/api`

## Main API Routes

All protected endpoints require a JWT token in the `Authorization` header:

```text
Authorization: Bearer <access_token>
```

### Auth

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/auth/login` | Login and receive JWT |
| `POST` | `/api/auth/change-password` | Change current user's password |

### Projects

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/projects/` | List projects |
| `POST` | `/api/projects/` | Create project |
| `GET` | `/api/projects/<id>` | Get project |
| `PUT` | `/api/projects/<id>` | Update project |
| `DELETE` | `/api/projects/<id>` | Delete project |

### Sites

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/sites/` | List sites |
| `POST` | `/api/sites/` | Create site |
| `GET` | `/api/sites/<id>` | Get site |
| `PUT` | `/api/sites/<id>` | Update site |
| `DELETE` | `/api/sites/<id>` | Delete site |

### Cash Issuances

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/cash-issuances/` | List cash issuances |
| `POST` | `/api/cash-issuances/` | Issue petty cash |
| `GET` | `/api/cash-issuances/<id>` | Get issuance |
| `PUT` | `/api/cash-issuances/<id>` | Update issuance |
| `DELETE` | `/api/cash-issuances/<id>` | Delete issuance |

### Expenses

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/expenses/` | List expenses |
| `POST` | `/api/expenses/` | Create expense |
| `GET` | `/api/expenses/<id>` | Get expense |
| `PUT` | `/api/expenses/<id>` | Update expense |
| `DELETE` | `/api/expenses/<id>` | Delete expense |

### Dashboard

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/dashboard/admin` | Admin dashboard |
| `GET` | `/api/dashboard/project` | Project manager dashboard |
| `GET` | `/api/dashboard/site` | Supervisor site dashboard |

### Reports

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/reports/weekly` | Weekly expense summary |

Query params:

```text
start_date=YYYY-MM-DD
end_date=YYYY-MM-DD
site_id=<optional_site_id>
```

### Receipt Upload

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/upload-receipt` | Upload receipt image |
| `POST` | `/api/upload-receipt/` | Upload receipt image |

Form field:

```text
receipt=<image_file>
```

## Receipt Upload Notes

Receipt upload uses Cloudinary. To test image upload:

1. Add valid Cloudinary keys in `backend/.env`.
2. Restart the Flask backend.
3. Login as supervisor `SITE001`.
4. Open `Add Expense`.
5. Choose an image file.

Supported frontend file type:

```text
image/*
```

If upload fails, check:

- Backend terminal logs for Cloudinary errors.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`.
- Frontend `API_URL`.
- Browser Network tab response body.

## Common Troubleshooting

### `relation "users" does not exist`

Run:

```bash
cd backend
python init_db.py
```

The initializer creates database tables and seed users.

### CORS error during upload

Make sure the Flask backend has been restarted after code changes. The upload route accepts both:

```text
/api/upload-receipt
/api/upload-receipt/
```

### Frontend still calls localhost after changing env

Restart Vite after editing `frontend/.env`:

```bash
npm run dev
```

Vite reads env variables when the dev server starts.

### `Upload failed. Please try again.`

Check Cloudinary env values. The backend returns this when Cloudinary upload fails or no file reaches Flask.

### Login redirects back to login

The JWT token may be missing or expired. Login again and confirm the backend is running at the URL configured in `API_URL`.

## Build Verification

Frontend production build:

```bash
cd frontend
npm run build
```

Backend syntax check:

```bash
cd backend
python -m compileall .
```

## Security Notes

- Do not commit real database passwords or Cloudinary secrets.
- Use a strong `JWT_SECRET_KEY` in production.
- Replace all test credentials before production use.
- Restrict CORS origins before deploying publicly.

## Current Default Local URLs

| Service | URL |
| --- | --- |
| Backend | `http://localhost:5000` |
| API | `http://localhost:5000/api` |
| Frontend | `http://localhost:5173` |

## Quick Start

Terminal 1:

```bash
cd backend
source venv/bin/activate
python init_db.py
python app.py
```

Terminal 2:

```bash
cd frontend
npm install
npm run dev
```

Open the frontend and login with:

```text
Username: admin
Password: admin123
```
