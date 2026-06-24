# AI Code Helper

A full-stack web application for developers to paste their code and get AI-powered help, utilizing FastAPI for the backend and pure Vanilla HTML/CSS/JS for the frontend.

## Features

1. **Code Explanation**: Paste code and get a beginner-friendly explanation.
2. **Code Debugging**: Find possible errors and get suggested fixes.
3. **Code Improvement**: Get an optimized, cleaner version of the code.
4. **History**: Automatically save all interactions (Explain, Debug, Improve) in the SQLite database and view them later.
5. **Contact System**: Send messages that get saved straight to the database.

## Prerequisites

- Python 3.8+
- Gemini API Key

## Setup Instructions

1. **Set your API Key**
   Open the `.env` file in the root directory and add your Google Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
   *(If you leave this empty, the backend will return mock responses.)*

2. **Install Dependencies**
   It is recommended to use a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r backend/requirements.txt
   ```

3. **Run the Application**
   Start the FastAPI server from the root directory:
   ```bash
   uvicorn backend.main:app --reload
   ```

4. **Access the App**
   Open your browser and navigate to:
   [http://127.0.0.1:8000](http://127.0.0.1:8000)

   *The API documentation (Swagger UI) is available at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).*

## Project Structure

- `backend/`: FastAPI application, routes, services, and SQLite DB configuration.
- `frontend/`: Vanilla HTML, CSS, and JS files with a premium dark mode UI.
- `app.db`: SQLite database automatically generated on the first run.
