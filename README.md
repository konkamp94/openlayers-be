# openlayers-be

Instructions to run and use the Nest.Js service in local environment

1. Download the code from github or clone github repository.

2. Install Node.Js (20.11.1 version used)

3. Install the node modules inside the project folder with the command: npm install

4. Create a folder with the name "config" inside the project folder. Then, you should create an environment file with the name ".development.env" inside "config" folder. Below you can find the env variables you should provide in “.development.env”.

---

DATABASE_NAME=openlayers
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_HOST=127.0.0.1
DATABASE_PORT=5432

OPEN_ROUTE_SERVICE_API_KEY=open_route_service_api_key
OPEN_ROUTE_SERVICE_BASE_URL=https://api.openrouteservice.org

---

5. Ensure that you are running a PostgreSQL server locally and that the database connection information and credentials are correctly configured in the ".development.env" file.

6. Open Route Service is used for calculating routes between two or more locations. You need to provide your Open Route Service API key to ensure the API functions correctly. You can create an Open Route Service API key by signing up for the service and requesting a key.

7. Once you have finished the above steps, you can start the application by running the command: npm start

8. Populate database with predefined locations data from locations.csv by running the script seed-db.js
