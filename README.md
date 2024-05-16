# Fall 2024 CS682
## Meeting Web App V3
### By Praveendhra Rajkumar; Sruthi Damera; Hindu Medisetty
### V2 - Lucas Gustafson; Aravind Haridas; Vivek Kamisetty
### V1 - Nishanth Bandarupalli; Aryan Kilaru; Rishank Singh

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
8. To log in, use user rounakb@umb.edu with password 123456 (from populate.sql) or create account.

##Note: 

For OCR, install gcloud, authenticate and replace keys in the backend.
For Stripe, create a new account and use the developer API keys provided

##Features Added in V3:

1. Document AI integration for OCR.
2. Stripe API integration for Payment processing.
3. Church model to manage church.
4. Subscriptions model to CRUD subscription packages.
5. Payment model to create, read and update payment-related info and history.
6. Updated user model to map the users to a church.
7. Likewise for the Meeting model and Task model.
8. Implemented Access and Authentication control for data.
9. Automatic monthly subscription renewal.
