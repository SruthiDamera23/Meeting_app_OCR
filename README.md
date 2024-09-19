
## Meeting Web App
### Sruthi Damera, Praveendhra, Hindu Medisetti


Django backend (see backend/docs.txt)
React frontend (see frontend/docs.txt)

To run (development):

1. Pull repo.
2. From frontend dir:
    ```
    npm install
    ```
3. Optional: create and activate venv in backend dir.
4. From backend dir:
    ```
    pip install -r requirements.txt
    ```
5. Run migrations and populate database with dummy data - instructions for doing so can be found in populate.sql.
6. From frontend dir:
    ```
    npm start
    ```
7. From backend dir:
    ```
    python manage.py runserver
    ```

Note: OCR for meeting creation requires a Google Cloud account and installation/configuration of Google Cloud CLI.

