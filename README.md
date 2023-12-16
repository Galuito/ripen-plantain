# Ripen Plantain
Rotten Tomatoes' venezuelan cousin, created by Andrea Diaz & Luis Galue. This Readme file is going to be used as a list of feats, integrations or how the problems were solved

## Intended order of development
- **User Model & User Controller**

## Encountered Problems
- **An Increasing Mean**: Calculating an increasing mean, users will be rating movies at different times, therefore, running a sum and calculating the average each time wouldn't be efficient in terms of code and operations in the server, also, multiplying to then sum and divide again isn't a great option either, therefore a solution had to be found to solve this issue. That's how we arrived at the running mean formula which is able to work with just one input, the formula is pretty simple. It can be found on the movie model.

## Last minute acclaration
Because I thought developing would have been done with my partner I started thoroughly documenting in the README.md my developing process but ended up doing it in my own notebook because it allows me to express myself better, the order in which I approached problems is:

- Stablishing the models and controllers as a concept
- Solving the running mean problem by finding the correct formula
- Finishing the creation of the main 2 models
- Using The Movie Database API in order to accomplish what my professor asked for
- Adding Axios to the project so that it can handle HTTP Requests
- Creating the routes that do the basic addition of movies to the database.
- Deleting my previous collections from my MongoDB Atlas Database
- Allowing users and critics to rate movies and handling the logic behind it
- Debugging the functions
- Developing the get Feed, get Movie
- Commenting posts and comments handling the fact that you can't comment something that is already a reply (Like in Youtube)
- Getting the comments of a movie and the comments of a comment
- Developing fuzzy search for movies and users

## This application does not
- Handle sorting (This should be done in the frontend)