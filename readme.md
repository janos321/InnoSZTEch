
This is an Angular project that is a web application for energy management in houses, with features such as adding and viewing new houses,adding and viewing devices to each house,and viewing how much energy they use up in real time,while providing useful charts.

Components

1. LoginComponent
Location: src/app/features/auth/login/login.component.ts & .html
Purpose: Handles user login.
Key Features:
Two-way binding for email and password fields.
Submits login form via submit() method.
Displays error messages on failed login.
Provides navigation to the registration page using a routerLink or button.
Template: Contains a form for email and password, a login button, and a link/button to register.

2. RegisterComponent
Location: (Assumed, not shown)
Purpose: Handles user registration.
Key Features:
Form for user registration details.
Navigation link back to the login page using <a routerLink="/login">.

3. ProfileComponent
Location: src/app/pages/profile/profile.component.html
Purpose: Displays the logged-in user's profile.
Key Features:
Shows user name and email.
"Vissza a főoldalra" (Back to home) button navigates to the home page.
"Kijelentkezés" (Logout) button logs the user out.
Template: Uses Angular's *ngIf to display content only if a user is present.

4. HouseFormComponent
Location: house-form.component.html
Purpose: Allows users to add a new house.
Key Features:
Form fields for house name, address, and area.
Uses Angular's two-way binding ([(ngModel)]) for form fields.
Submits the form via submit() method.
All fields are required.
Template: Simple form with input fields and a submit button.
Routing
Navigation between login, register, home, and profile pages is handled using Angular's Router.
Navigation links use [routerLink] for SPA navigation.

5. HouseListComponent
Location: src/app/pages/home/house-list/house-list.component.ts 
Purpose:
Displays a list of all houses.
Key Features:
Fetches the house list from HouseService on initialization.
Displays each house's name, address, and area.

6. HomeComponent
Location: src/app/pages/home/home.component.ts 
Purpose:
Acts as the dashboard or landing page after login.
Key Features:
Displays a welcome message.
Embeds HouseListComponent and HouseFormComponent.
Handles navigation to house details or other features.

7. HouseDetailsComponent
Location: src/app/pages/house-details/house-details.component.ts 
Purpose:
Displays detailed information about a single house,and lets you edit and add new electric devices to the house
Key Features:
Fetches house details from HouseService using the house ID from the route.
Shows all relevant house information (name, address, area, etc.).
Has option to add devices to house,which you can later disable or enable
Provides useful graphs and tips about energy usage in the given house

Services

1. AuthService (referenced in LoginComponent): Handles authentication logic such as login and logout.

2. HouseService
Location: src/app/core/services/house.service.ts 
Purpose:
Handles all business logic and HTTP requests related to houses.
Responsibilities:
Fetching the list of houses from the backend.
Adding a new house.
Fetching details for a specific house.
Methods:
getHouses(): Observable<House[]>
addHouse(house: House): Observable<House>
getHouseById(id: string): Observable<House>
