# API_Sing_me_a_Song

Have you ever asked anyone for a song recommendation? This is an API for you!

## About

Sing me a song is an API for anonymous song recommendation. The more people like a recommendation, more likely it is to be recommended to others.

Below are the implemented routes:

- POST /recommendations -> Adds a new music recommendation. The body must be in the following format:
```
{
  name: 'bandName - songName',
  youtubeLink: 'songYoutubeLink'
}
```
- POST /recommendations/:id/upvote -> Adds a point to the recommendation score;
- POST /recommendations/:id/downvote -> Removes a point from the recommendation score;
- GET /recommendations/random -> Gets a random recommendation in the following format:
```
{
  id: recommendationId,
  name: 'bandName - songName',
  youtubeLink: 'songYoutubeLink'
  score: recommendationScore
}
```
the recommendation logic is as follows:
> * **70% of the time**: a song with a score higher than 10 is randomly recommended;
> * **30% of the time**: a song with a score between -5 and 10 (inclusive) is randomly recommended;
> * If there are only songs with a score above 10 or only below/equal to 10, 100% of the time any song is recommended;
- GET /recommendations/top/:amount -> Lists the songs with the highest score (in descending order)

API link: https://api-singmeasong.herokuapp.com/

## Technologies
Main thechnologies used in the construction of the project:<br>
<p>
  <img src="https://img.shields.io/badge/-Nodejs-green?style=for-the-badge" />
  <img src="https://img.shields.io/badge/-Express-green?style=for-the-badge" />
  <img src="https://img.shields.io/badge/-PostgreSQL-green?style=for-the-badge" />
  <img src="https://img.shields.io/badge/-Jest-green?style=for-the-badge" />
</p>

Some frameworks and concepts:
<img align="right" width="50%" src="https://user-images.githubusercontent.com/84607762/144898252-6a1404fd-a03f-4924-9757-f556565eb7c6.png" />
<p align="left">
* <a href="https://github.com/winstonjs/winston">winston</a> </br>
* <a href="https://github.com/sideway/joi">Joi</a>  </br>
* Clean code and code standard - <a href="https://eslint.org/">eslint</a>, <a href="https://prettier.io/">prettier</a> and <a href="https://github.com/typicode/husky">husky</a> </br>
* Dev, test and production environments - <a href="https://github.com/motdotla/dotenv">dotenv</a> </br>
* Unit tests </br>
* Layered backend architecture </br>
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
