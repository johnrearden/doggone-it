# **Doggone It Website**

### A website that lets visitors play a simple sheep herding game.

[View the live project here]()

![screenshots of project]()

---

# Features

- ### Main Game Page
    This page contains the game display and controls. The visitor controls their sheepdog by tapping/clicking where they want him to go, and pressing the bark button if they want him to scare the sheep. The sheep run away from the dog, especially if he is barking, and the aim of the game is to force the sheep out the gate.

- ### Possible extra features
    - The player can lay out a path for the dog by dragging their finger/mouse pointer across the game area.
    - The player can watch a replay of the last game and move forwards and backwards through the replay at different speeds.
    - Dynamic hazards can be added to the game to frighten the sheep, such as bees maybe?
    


- ### Features left to implement

---

# User Experience (UX)

- ### User Stories

    - #### First Time Visitor Goals
        - As a first-time visitor, I want to be able to quickly engage in the game, 
        with a minimum of setup.
        - As a first-time visitor, I want to find the game controls straightforward
        and easy to use.

    - #### Returning Visitor Goals
        - As a returning visitor, I want to be challenged as I progress in the game
        - As a returning visitor, I would like to watch a replay of my games to
        learn from my mistakes.

    - #### Frequent Visitor Goals
        - As a frequent visitor, I would like to be able to experiment with some 
        of the game mechanics and customize them without breaking the gameplay.
- ### Design

    - Colour Scheme

    - Typography

    - Imagery

- ### Wireframes

    - ![Game Page (mobile)](https://share.balsamiq.com/c/tK87Xtckk1UjeB3F6No4Ls.png)

    - ![Game Page (desktop)](https://share.balsamiq.com/c/t1t3d6x7EahsxB5ArbEHde.png)

    
# Technologies Used

## Languages used

- HTML
- CSS
- JavaScript

## Libraries and Programs Used
1. [Google Fonts](https://fonts.google.com/) 
    - Google Fonts were used to import the 'Quicksand' font which is used throughout the website.
2. [Font Awesome](https://fontawesome.com/icons)
    - Font Awesome was used throughout to add icons to enhance UX.
3. [GIMP](https://www.gimp.org/)
    - GNU Image Manipulation Program was used as an open source alternative to Photoshop to scale and alter all of the images on the site.
4. [Balsamiq](https://balsamiq.cloud/)
    - All wireframes were designed using Balsamiq.
5. [Git](https://git-scm.com/)
    - Version control was implemented using Git through the Github terminal.
6. [Github](https://github.com/)
    - Github was used to store the projects after being pushed from Git and its cloud service [Github Pages](https://pages.github.com/) was used to serve the project on the web.
7. [Visual Studio Code](https://code.visualstudio.com/)
    - VS Code was used temporarily after I had run out of Gitpod hours. The project was cloned to my local environment and changes pushed up to Github from there.


# Testing

## Testing User Stories from UX section

- #### First Time Visitor Goals
 

- #### Returning Visitor Goals

---

## Validator Testing

- HTML Validation

- CSS Validation
    
- Lighthouse report

---

## Automated Testing

- Unit tests were written for the project using Jest. A description of the process I undertook to set up my testing environment on my local machine can be found [here](TESTING.md). The tests can be run on GitPod using the following commands :
    - do it

## Manual Testing
Feature | Expected | Action | Result
--------|----------|--------|-------

---

## Further Testing



### Comments on device testing:

# Bugs

## Bugs found and solutions developed
- There was a problem with the sprite choice for the sheep. If a sheep's movement toward the herd center was balanced against it's movement away from the dog, it would thrash over and back across the balance point, switching the sprite drawn rapidly.
    - Solution found : In this case, the resultant velocity would be very small, so I set any velocity smaller than a low threshold to zero, and eliminated the thrashing.

# Deployment

### GitHub Pages
The website is deployed on Github Pages. The deployment procedure is as follows :
- Navigate to the Github repository [www.github.com/johnrearden/doggone-it](https://www.github.com/johnrearden/less-is-more)
- In the Github repository, navigate to the Settings tag.
- From the source section drop-down menu, select the Master branch.
- The page should be refreshed with a message to indicate successful deployment.

### Forking the Github Repository
You can make a copy of the original repository to view and/or make changes without affecting the original repository by using the following steps:
- Log in to GitHub and locate the repository [www.github.com/johnrearden/doggone-it](https://www.github.com/johnrearden/less-is-more)
- At the top of the Repository (not top of page) just above the "Settings" button on the menu, locate the "Fork" button.
- You should now have a copy of the original repository in your GitHub account

### Making a Local Clone
- Log in to Github and locate the repository [www.github.com/johnrearden/doggone-it](https://www.github.com/johnrearden/less-is-more)
- Under the repository name, click "Clone or download".
- To clone the repository using HTTPS, under "Clone with HTTPS", copy the link.
- Open Git Bash
- Change the current working directory to the location where you want the cloned directory to be made.
- Type `git clone`, and then paste the URL you copied in Step 3.

    `$ git clone https://github.com/johnrearden/doggone-it`

- Press Enter. Your clone will be created.
# Credits
## Images:
Farm tileset:
Buch @ http://blog-buch.rhcloud.com

How to make a cartoon text - OCELOTHE
https://www.youtube.com/watch?v=_iH-34i6kYE

Sheep image for logo from dagadu, purchased from colorbox

Tortoise icon:
https://www.flaticon.com/free-icons/tortoise

Hare icon: 
https://www.flaticon.com/free-icons/rabbit

Sheep icon:
https://www.flaticon.com/free-icons/lamb

## Code:
CSS aspect-ratio property:
https://www.smashingmagazine.com/2020/03/setting-height-width-images-important-again/ 

CSS flex-box:
https://css-tricks.com/snippets/css/a-guide-to-flexbox/

How to code a JavaScript game loop
https://spicyyoghurt.com/tutorials/html5-javascript-game-development/create-a-proper-game-loop-with-requestanimationframe

Drawing a sprite with an arbitrary rotation and position
https://stackoverflow.com/questions/32468969/rotating-a-sprite-in-a-canvas

Use async/await to halt program until all images are loaded
https://stackoverflow.com/questions/37854355/wait-for-image-loading-to-complete-in-javascript

Value of this in callback functions from global scope
https://www.w3docs.com/snippets/javascript/how-to-access-the-correct-this-inside-a-callback.html

Preventing touch events from scrolling the screen on mobile
https://stackoverflow.com/a/26591826

How to style a progress bar
https://verpex.com/blog/website-tips/how-to-style-a-progress-bar-using-css


---

## Acknowledgements
- I would like to thank my tutor, Okwudiri Okoro, for his valuable assistance during the course of this project. 

- I would also like to thank our course facilitator, Kenan Wright, for his help during the weekly stand-up meetings. 