# Dungeons & Dragons 5th Edition Character Sheet
### A New and Modern Character Sheet for 5th edition Dungeons & Dragons.
#### About:
This project is a fork of 5e-Character-Sheet by Chee32.  My thanks to them for a great idea.  I made some changes that fit my preferences for play
1. Added more dice rolling capabilities. More clickable links to roll.  A quick roll panel for unique rolls or multiple rolls.
2. Some reformatting. Some removal of panels and tabs.
3. Uses the PC's Load file and Save file dialog boxes to control where sheets are loaded and saved
4. Features and spells are all merged into one list to make it easier to find stuff at higher levels.  They are color coded based on the type. They have a checkbox besides the slot checkboxes to help keep track of which spells have been cast.

Since I'm currently playing a Warlock/Rogue everything is geared to that. 
#### Credits:
This project was forked from [here](https://github.com/Chee32/5e-Character-Sheet). Credit goes to Chee32 for the JQuery which remains largely unchanged.

## Things to know when using this sheet.
### How to:
#### Make your own character sheet: 
1. Download or clone the repository.
2. Fill out all the fields staring with Proficeincy Bonus and Attribute Scores.
3. Save your sheet (in the menu).

#### Save the sheet:
1. Click the 'Save' Link.
2. Select filename and location.
3. A JSON sheet will be saved.

#### Load a sheet
1. Click the 'Load' Link.
2. Navigate to your sheet using the dialog
3. The sheet will be loaded.
   
#### Change Character & Alliance images:
1. Upload your images into the 'imgs' folder
2. For the Character Appearance name the file 'character.jpeg'.
3. For the Alliance Symbol, name the file 'symbol.jpeg'.
4. Currently, if you want to change the name or file type of these images you will have to go into the 'app.css' and change the values.

### Fields that don't populate.
Some fields do not auto-populate based off of the attributes. 
#### Some of the less obvious ones are:
- AC: The reason for this is that your armor and class features mainly determine your AC. I felt it was better to just leave it to you to set it.
- Initiative Bonus: Again, a lot of things can change this other than attributes.
- Proficiency Bonus: This mainly changes with level so I felt it was easy enough to set.
- Current Hit Dice: Again, mainly based on level and not attributes.
- Max Health: This is mainly based off of class and level. It can also be rolled if you chose to so I didn't want this to change if someone added more hit dice.

### Pull Requests & Forks:
Feel free to make contributions or fork this project. Please just credit the original author and myself. Thanks!
