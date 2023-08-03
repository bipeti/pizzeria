# Pizzeria

Ludas Pizzeria

Pizzeria project built with React and Typescript.

## Features:

-   The app stores food, users and order data in Firebase Database.
-   The meals are displayed in groups (pizza, hamburger, etc.) with their descriptions and prices.
-   Meals may have extras (ham, cheese, bread, etc.).
-   Meals may come in different varieties, for example pizzas with various sizes and individual prices.
-   If a meal has no different varieties, it can have a single children serving size with an individual price.
-   Meals have an individual packaging fee, which is displayed in total at the bottom of the cart.
-   The following items are displayed in the cart: meals, children size (if applicable), extras (if applicable), prices of meals, and the summary.
-   The quantities of meals in the cart can be increased, decreased and removed.
-   If a meal doesn't have extras and children serving size, it will be added to the cart immediatley after clicking the cart button without showing a modal window.
-   The "main" cart is always visible.
-   The app is designed to be responsive and adapt to different screen sizes. On mobile or tablet devices, in portrait mode, there is a compact version of the cart placed at the bottom of the screen, displaying only the buying summary. However, users have the option to expand the cart to full-screen mode, where all related information, including detailed item listings, is displayed for a more comprehensive view. This feature allows users to have a seamless shopping experience regardless of their device's screen size. In landscape mode the "main" cart is visible.
-   Users can register, enter their details, activate their registration with a token sent by e-mail.
-   Visitors can browsing the menu, add to cart meals, but only logged-in users can place orders.
-   Logged-in users can modify their details and password.
-   The numbers are formatted with a thousands separator.
-   Uniform error and warning messages are displayed in the app.

You can try it here: https://ludas-pizzeria.netlify.app/
