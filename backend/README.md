# AI-Powered Construction Site Vehicle & License Plate Monitoring System (Backend)

Modern, high-performance REST API backend built with **Python**, **FastAPI**, **OpenCV**, **YOLOv8**, **ByteTrack**, and **PaddleOCR / EasyOCR**.

---

## 🛠️ Technology Stack

* **API Framework**: FastAPI with Pydantic v2 schemas and automatic OpenAPI `/docs`
* **Vehicle Detection**: YOLOv8 (Detects trucks, concrete mixers, dump trucks, flatbeds, vans, pickups)
* **License Plate Detection**: YOLOv8 Plate Detector
* **Vehicle Tracking**: ByteTrack (correlating vehicles across consecutive CCTV frames)
* **OCR Character Extraction**: PaddleOCR & EasyOCR with multi-frame character fusion
* **Database**: SQLAlchemy ORM with SQLite (100% compatible with PostgreSQL & Supabase)

---

## 🚀 Quickstart & Installation

### 1. Create a Python Virtual Environment
```bash
cd backend
python -m venv venv

# On Linux/macOS:
source venv/bin/activate

# On Windows:
.\venv\Scripts\activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Launch FastAPI Server
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Interactive Swagger API Documentation will be available at:
`http://localhost:8000/docs`

---

## 🗄️ Database Architecture & Migration

By default, the backend initializes `sqlite:///./construction_anpr.db` with zero configuration.

### Switching to PostgreSQL or Supabase
Simply configure `DATABASE_URL` in your environment:
```bash
export DATABASE_URL="postgresql://postgres:password@localhost:5432/construction_anpr"
```
Or set it in a `.env` file. The SQLAlchemy schemas are database-agnostic.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health and pipeline readiness |
| `POST` | `/api/upload-video` | Upload CCTV video footage for processing |
| `GET` | `/api/vehicles` | List all registered contractor vehicles |
| `POST` | `/api/vehicles` | Register a new vehicle & permit |
| `PUT` | `/api/vehicles/{id}` | Update vehicle details and authorization |
| `DELETE` | `/api/vehicles/{id}` | Delete a vehicle permit from registry |
| `GET` | `/api/vehicle/{plate}` | Query vehicle profile by license plate |
| `GET` | `/api/detections` | Fetch recent CCTV detection stream |
| `GET` | `/api/alerts` | List gate security alerts |
| `PUT` | `/api/alerts/{id}` | Triage alert status (`new`, `reviewed`, `resolved`) |
| `GET` | `/api/history` | Gate ingress / egress audit logs |
| `GET` | `/api/analytics` | Telemetry, OCR accuracy, and turnaround metrics |

---

## 🧠 Multi-Frame OCR Fusion & Quality Assessment

1. **Image Quality Assessment (`cv/pipeline.py`)**:
   - Laplacian variance for dust and motion blur detection.
   - Contrast standard deviation and mean illumination analysis.
   - Automatically invokes CLAHE and bilateral filtering if quality drops below 65%.

2. **Multi-Frame Character Voting**:
   - Gathers plate character predictions across a 5-frame sliding window for each tracked vehicle ID (`V001`, `V002`, `V023`).
   - Performs position-by-position voting consensus to remove spurious noise and occlusions.
