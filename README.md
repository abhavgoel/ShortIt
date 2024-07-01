# URL-shortner

Design a URL shortner service that takes a valid url and returns a shortened URL, redirecting user to the previous URL.

Also keep track of visits/clicks

APIs

POST /url  - generates a new shortened url, and return in format examplesite.com/random-id

GET /:id - redirects user to original site

GET /url/analytics/:id - return number of clicks for the shortened url

# MVC architecture - 
Following the MVC architecture for this project
![mvc](https://github.com/abhavgoel/URL-shortner/assets/72388884/ff6ea10f-6689-4039-9ce5-c2ceb5f97655)

# Project flow - 

![projectFlow](https://github.com/abhavgoel/URL-shortner/assets/72388884/2dd5cc82-96ff-49bb-a5a3-c99af200e297)
