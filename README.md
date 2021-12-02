# API_Sing_me_a_Song

Have you ever asked anyone for a song recommendation? This is an API for you!

## About

Sing me a song is an API for anonymous song recommendation. The more people like a recommendation, more likely it is to be recommended to others.
Below are the implemented routes:

- POST /recommendations -> Add a new music recommendation
- POST /recommendations/:id/upvote -> Add a point to the recommendation score
- POST /recommendations/:id/downvote -> Removes a point from the recommendation score
- GET /recommendations/random -> Get a random recommendation
- GET /recommendations/top/:amount -> List the songs with the highest score and your score.

## Technologies
The following tools and frameworks were used in the construction of the project:<br>
<p>
  <img src="https://img.shields.io/badge/-Nodejs-green?style=for-the-badge" />
  <img src="https://img.shields.io/badge/-Express-green?style=for-the-badge" />
  <img src="https://img.shields.io/badge/-PostgreSQL-green?style=for-the-badge" />
  <img src="https://img.shields.io/badge/-Jest-green?style=for-the-badge" />
</p>

## How to run

1. Clone the repo
```
git clone https://github.com/PMafra/API_Sing_me_a_Song.git
```
2. Install NPM packages
```
npm install
```

3. Create .env.dev and .env.test files based on .env.example file

4. Display the back-end scripts with
```
npx ntl
```
5. Choose one of the three options to run back-end:
* **test** - for test environment
* **start** - for production environment
* **start:dev** - for development environment
