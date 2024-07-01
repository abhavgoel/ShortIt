# URL-shortner

Design a URL shortner service that takes a valid url and returns a shortened URL, redirecting user to the previous URL.

Also keep track of visits/clicks

APIs

POST /url  - generates a new shortened url, and return in format examplesite.com/random-id

GET /:id - redirects user to original site

GET /url/analytics/:id - return number of clicks for the shortened url