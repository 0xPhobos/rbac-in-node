# Setup

The code examples shown below can be found in this repository. To run each of them, navigate to the corresponding directory and run yarn install followed by yarn start.

All of the examples we'll demonstrate in this post have a similar structure:

1- They use Express.js as the web server, and they use a middleware called hasPermission to check if the user has the correct permissions to access the route.

2- They share a users.json file that contains the users and their assigned roles. This file will simulate a database that would be used in a real application to store and retrieve user information.

*LOOK IN "CODE" FOLDER ^^*

The users.json file is going to be accessed by a function called resolveUserRole which, given a user will resolve their role. This function is shared by all of the examples and is found in utils.js.

*LOOK IN CODE FOLDER*

The initial setup for the Express.js app is straightforward:

*CODE*

The application will have three routes that will be protected by the hasPermission middleware, which will determine whether the user has the correct permissions to access the route, based on the action associated with that route

*CODE*

And finally, the application will listen on port 8080:

*CODE*

### Testing

To test the application, we'll make a set of requests to the routes and check the responses:

*CODE/TESTING*

Where <HTTP Verb> is either GET, PUT, or DELETE and <asset> is either megaSeeds or timeCrystals.

For each user, we'll expect the following:

Beth (AKA the clone): Should be only able to gather megaSeeds and timeCrystals

Morty (AKA the sidekick): Should be only able to gather and consume megaSeeds and timeCrystals

Rick (AKA the evilGenius): Should be able to gather, consume and destroy only megaSeeds and timeCrystals.

Let's go get those mega seeds!
  
### Vanilla Node.js
