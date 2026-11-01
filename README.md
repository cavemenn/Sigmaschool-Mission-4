# Sigmaschool-Mission-4

# App Name: Pastimes

# Overview of Mission
Sometimes it's hard to think of something fun or productive to do. In this project you'll build SparkList (Pastimes in my case), an activity discovery dashboard that helps users find random activity ideas. Users log in to access the dashboard, generate suggestions from a public API, and save the ones they like to a personal Saved Activities panel in the top-right corner. This project focuses on creating a login flow, fetching data from an external API, working with JSON responses, updating the DOM, and responding to user interactions.

<img width="1919" height="939" alt="image" src="https://github.com/user-attachments/assets/5b6678bd-3aba-41d0-ae03-7f4aa5fcb239" />
<img width="1919" height="940" alt="image" src="https://github.com/user-attachments/assets/e06a97d8-d52a-48b9-8c1f-fab7081c9683" />
<img width="1919" height="940" alt="image" src="https://github.com/user-attachments/assets/9dc9e868-4d12-441e-8bee-19fa12e3762b" />


## Language Used
- **HTML**
- **Javascript**
- **Bootstrap used instead of CSS**

## Features
- **Sign up and log in** with a username and password
- **Random activity generator**: press "Get Activity" to fetch a random idea from an API
- **Activity details** shown as badges (type, availability, number of people, price, duration, accessibility, kid friendly)
- **Optional link** to open the activity in a new tab when one is provided
- **Save activities** to a personal list (duplicates are blocked)
- **Remove saved activities** and see a live saved count
- **Stay logged in** after refreshing the page
- **Responsive layout** that works on phones, tablets and desktops

## Demo account
If you just want to try it out:

| Username | Password |
|---|---|
| `admin` | `admin123` |

## Getting started (For Linux Fedora Workstation)
No installation or build step is needed.

1. Clone Project 
- git clone (inert ssh link)

2. Make sure these two files are in the same folder:
   ```
   index.html
   scripts.js
   ```
3. Open `terminal` and change directory to the cloned repo directory.

4. Type `python -m http.server 8000` in terminal

5. Access website by typing `localhost:8000/index.html` inyour browser.

An internet connection is required, because Bootstrap, Bootstrap Icons and the activity API are all loaded online.

## How to use
1. Log in with the demo account, or click **Sign up** to create your own.
2. Click **Get Activity** to receive a random suggestion.
3. Click **Save Activity** to add it to your saved list on the right.
4. Click **Remove** next to a saved activity to delete it.
5. Click **Log out** when you're done.

## API used
- [Random Activity API](https://random-activity-sigmo.vercel.app/api/random) for the activity data

## How it works
- **Views:** the login, signup and app screens all live in `index.html`. JavaScript shows and hides them using Bootstrap's `d-none` class.
- **Accounts:** users are stored in the browser's `localStorage` under the key `users`.
- **Saved activities:** each user's list is stored under `saved-<username>`, so every account has its own list.
- **Session:** the logged-in user is stored under `currentUser`, which is how you stay logged in after a refresh.
- **Activities:** `fetch` requests a random activity from the API, then the data is turned into badges and displayed on the page.
