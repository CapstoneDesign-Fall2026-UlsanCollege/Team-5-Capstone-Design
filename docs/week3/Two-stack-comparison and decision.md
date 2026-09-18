# Two Stack Comparison

**Project:** Smart Study Companion  
**Team:** DJ Barut  
**Date:** 2026-09-17

## Simple Comparison Table

| Point | Stack A: React + Vite + localStorage | Stack B: React + Vite + Firebase |
|---|---|---|
| Data saving | Saves data in the browser | Saves data online |
| Difficulty | Easier for our team | More difficult to set up |
| Internet needed | Not needed after opening the app | Needed to save and load data |
| Good for | MVP and midterm demo | Future version with login and cloud data |
| Main risk | Data is only saved on one browser | Setup and database errors may take time |
| Midterm demo | Easy to prepare | Possible, but more work |

## Stack A: React + Vite + localStorage

### What can we build with this?

We can build the main features of Smart Study Companion. Students can add subjects, create study tasks, set deadlines, see their study plan, complete tasks, take a quiz, and see their score. We can save this information in the browser using localStorage.

### What does our team already know?

Our team knows basic HTML, CSS, JavaScript, and some React. We also tested localStorage before, and it saved subject and task data after refreshing the browser.

### What do we need to learn?

We need to learn more about React components, state, forms, and saving data with localStorage. We also need to test the quiz-score calculation.

### How can we demo it by midterm?

For the midterm, a student will add a Programming subject and two study tasks with deadlines. The student will mark one task as completed, take a short quiz, and see the quiz score.

### What could go wrong?

The data will only be saved in the same browser. If the browser data is cleared, the saved tasks may disappear. Also, we should not add AI or reminder features too early because they may make the project too big.

### What is the simplest first feature?

The first feature can be a page where a student adds a subject, task title, and deadline.

## Stack B: React + Vite + Firebase

### What can we build with this?

We can build the same main features, but the data will be saved online instead of only in one browser. In the future, Firebase can also help us add login and use the app on different devices.

### What does our team already know?

We can still use React and Vite, so the front-end part will be similar. However, we do not have much experience with Firebase database setup.

### What do we need to learn?

We need to learn how to create a Firebase project, connect Firestore to React, save data online, and solve database permission errors. We may also need to learn login setup later.

### How can we demo it by midterm?

We can show the same midterm flow: create a subject and tasks, complete a task, take a quiz, and see the score. But first, we need to make sure Firebase and the database connection work.

### What could go wrong?

Firebase may take more time to set up. Database permissions or internet problems could cause errors during the demo. It may also make the project harder before we finish the basic features.

### What is the simplest first feature?

The first feature can be a page where a student saves one subject and one study task with a deadline to Firebase.

# Final Decision

Our team chooses **React + Vite + localStorage** for the MVP and midterm demo.

We chose this stack because it is easier and faster for our team. It can complete all the important midterm features without needing a cloud database, login system, or internet connection. We already tested localStorage, and it saved data after refreshing the browser.

We may use Firebase later if we need online storage, login, or access from different devices.

## Midterm Demo

Our midterm demo will show a student adding a Programming subject, creating study tasks with deadlines, marking a task as completed, taking a short multiple-choice quiz, and viewing the quiz score.

## Not Included in the Midterm

AI study plans, AI quiz questions, reminders, notifications, login, mobile app support, and Firebase cloud storage are not required for the midterm demo.
