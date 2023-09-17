# Shelter Dog Hub

Welcome to the Dog Matcher App, an interactive platform that connects users with their potential companions. Browse available dogs, filter by breed, and find your perfect match!

## Features

### User Authentication
Begin by entering your name and email on the login screen. This will authenticate you with our service, and you will be directed to the main search page.

### Dog Search Page
On this page, users can:

- Filter dogs by breed.
- Navigate through paginated results.
- Sort results alphabetically by breed (ascending or descending).
- View detailed information about each dog
- Favorite and unfavorite dogs from the search results.
- Click Previous and Next buttons to navigate through the paginated results.

### Advanced Filtering
To refine your search, apply filters for:

- Minimum age
- Maximum age
- Dog breed
- Zip code

### Matching
After selecting your favorites, generate a match to discover a single dog suggested for you. This recommendation is powered by our endpoint. Once you've found your match, you can:

- View detailed information about your matched dog.
- Check out your list of favorited dogs.
- Generate a new match if desired.

## Additional Features besides general requirements

Beyond the core requirements, the following features were implemented:
  - A user can favorite and unfavorite dogs from the search results.
  - A user can view a list of favorited dogs via a Dialog.
  - A user can clear their list of favorited dogs inside the Dialog.
  - A user can generate a new match if desired.
  - A user can view detailed information about their matched dog.
  - A user can filter dogs by minimum age.
  - A user can filter dogs by maximum age.
  - A user can reset all filters.

Multiple error handlings were also added. 


## Getting Started

1. Clone the repository.
2. Install the dependencies with `yarn install`.
3. Run the application with `yarn run start`.
4. (Optional) Run the tests with `yarn run test`.