# Ripen Plantain
Rotten Tomatoes' venezuelan cousin, created by Andrea Diaz & Luis Galue. This Readme file is going to be used as a list of feats, integrations or how the problems were solved

## Intended order of development
- **User Model & User Controller**

## Encountered Problems
- **An Increasing Mean**: Calculating an increasing mean, users will be rating movies at different times, therefore, running a sum and calculating the average each time wouldn't be efficient in terms of code and operations in the server, also, multiplying to then sum and divide again isn't a great option either, therefore a solution had to be found to solve this issue. That's how we arrived at the running mean formula which is able to work with just one input, the formula is pretty simple. It can be found on the movie model.