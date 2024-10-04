# NESTJS E-COMMERCE API

This is a REST API for an e-commerce system

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Testing](#testing)
- [Documentation](#documentation)
- [License](#license)
- [Contact Information](#contact-information)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/SamuelB7/ecommerce-rest-api.git
    cd ecommerce-rest-api
    ```

2. Copy the `.env.example` to `.env` and configure your environment variables:
    ```sh
    cp .env.example .env
    ```

3. Install dependencies:
    ```sh
    npm install
    ```

4. Make sure to have Docker Compose installed on your machine.

5. Start the Docker containers:
    ```sh
    sudo docker compose up
    ```

6. Run database migrations:
    ```sh
    npm run prisma:migrate:deploy
    ```

## Usage

To start the server in development mode, without docker run:
```sh
npm run start:dev
```
The server will be running at http://localhost:3333

## Testing

To run the unit tests of the api, use the command:
```sh
npm run test
```
To run the e2e tests, use:
```sh
npm run test:e2e
```

## Documentation

After starting the application, go to http://localhost:3333/documentation to check the documentation of the api endpoints

## License

This project is licensed under the MIT License

## Contact Information

For any inquiries, please contact belo.samuel@gmail.com