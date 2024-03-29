README
The backend server for City Bike App is constructed using the Express framework and integrates with three MongoDB databases to accommodate large amounts of data. Deployed on Vercel, it provides convenient access and streamlined management.

# Prerequisites
Before you start, make sure you have the following tools installed on your local machine:

•	Node.js (latest version is recommended)
•	npm v6 or higher
•	MongoDB (version 6)
•	Nodemon (for live reloading during development)


# Configurations
You need to set up a local instance of MongoDB and create a .env file to store the following environment variables:

•	MONGODB_URI: The URI of your MongoDB database.
•	PORT: The port number the backend server will listen on.

# Running the Project
1.	Clone the repository to your local machine.
2.	Open the terminal and navigate to the project directory.
3.	Create a .env file in the root of the project and add the environment variables as described above.
4.	Run npm install to install all dependencies.
5.	Once the installation is complete, run npm start to start the backend server.

# Tests
This backend server for City Bike App has not been tested yet. It is recommended to thoroughly test the functionality and performance of the server before deploying it for production use.

# Deployment
The backend server is already deployed on Vercel. You can access it through the URL provided by Vercel. Link: https://solita-dev-academy-server-ste.vercel.app/

# Technology
The following technologies were used in the development of this backend server:
•	Express v4.18.2
•	MongoDB v4.13.0
•	CORS v2.8.5
•	Dotenv v16.0.3

Express is used to build the backend server, while MongoDB provides the database to store data. CORS is used to handle cross-origin resource sharing, and Dotenv is used to manage environment variables. These technologies were selected for their reliability and ease of use, and for their ability to meet the requirements of the project.


# TODO
•	Add tests to cover more scenarios
•	[ ] Add more API endpoints as needed
•	Implement authentication and authorization