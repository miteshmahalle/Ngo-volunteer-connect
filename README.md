
# NGO Volunteer Connect

A full-stack web application for the Indian market that connects NGOs with volunteers. The app uses:

- React + TypeScript + Tailwind CSS for the frontend
- Django REST Framework for the backend API
- MongoDB through PyMongo, not Djongo
- JWT authentication for NGO, volunteer, and admin users

## Project Structure

```text
backend/    Django REST API, PyMongo database access, JWT auth
frontend/   React + TypeScript + Tailwind public website and auth UI
```

## Quick Start

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python manage.py runserver
```

Set `MONGO_URI`, `MONGO_DB_NAME`, and `JWT_SECRET` in `backend/.env`.

Create the first platform admin in MongoDB:

```bash
python manage.py create_mongo_admin --name "Platform Admin" --email admin@sevasetu.in --password "ChangeMe123!"
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Set `VITE_API_BASE_URL` in `frontend/.env` if the backend is not running at `http://localhost:8000/api`.

## User Roles

- `ngo`: NGO organizations create campaigns and opportunities.
- `volunteer`: Volunteers discover NGOs and apply to opportunities.
- `admin`: Admins verify NGOs/volunteers and manage the platform.

## API Highlights

- `POST /api/auth/register/`: Register an NGO or volunteer.
- `POST /api/auth/login/`: Login with JWT response.
- `GET /api/auth/me/`: Current authenticated user.
- `GET /api/auth/admin/pending-users/`: Admin-only pending verification queue.
- `PATCH /api/auth/admin/verify-user/<user_id>/`: Admin-only verification update.
- `GET, POST /api/opportunities/`: List or create NGO opportunities.
- `POST /api/opportunities/<opportunity_id>/apply/`: Volunteer application endpoint.
**Admin Dashboard**
<img width="1350" height="594" alt="image" src="https://github.com/user-attachments/assets/c86dc14c-d47c-485e-b432-7250f1fbf22a" />
**VOLUNTEER Dashboard**
<img width="1349" height="600" alt="image" src="https://github.com/user-attachments/assets/d5997f3f-f846-4167-b56d-01392e7bfd4f" />
**NGO USER Dashboard**
  <img width="1335" height="598" alt="image" src="https://github.com/user-attachments/assets/8fd88d29-d6f4-402b-9f36-941d9bc51842" />
  <img width="1347" height="524" alt="image" src="https://github.com/user-attachments/assets/e80e0d0b-fff3-4f0d-ab9f-0d799d8c6c3a" />
  <img width="1347" height="595" alt="image" src="https://github.com/user-attachments/assets/c49fec49-a523-489f-9e09-87e53abaf6c6" />

