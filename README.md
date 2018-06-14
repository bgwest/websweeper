# Websweeper.js NFLE (No Flags Local Edition)

Originally, Websweeper.js started out as the other folder in this repo called "minesweeper_cli". I needed to create that for a Codecademy Credential class called 'Building Front-End Web Applications from Scratch'. The instructions for how to run that version can be found in minesweeper_cli/src/game.js at the top of the file.

This new Web GUI version I created from scratch using purely vanilla JS/HTML/CSS, is a 'NF' edition. NF stands for no flags and is a playing style of some minesweeper players (http://www.minesweeper.info/wiki/Strategy#Efficiency). Those that enjoy playing with NF might enjoy this version. Hybrid players and flag players may not enjoy this version.

#### Some idea ideas I have for future improvements:

- Move leaderboard to be ranked by board sizes (Small/Med/Lrg). That may be more desireable way to display ranked games. For now, all game sizes are noted but clustered in together.

- Local storage is great but a pain and can be erased easily. Serious players may not enjoy this quality of this 'Local' version. Possibly look at hosting it elsewhere and have a light backend for datastore to compete against other players that use this game.

- Add a dictionary API to default playername to random words

- Using TLDR to return square data instead of openly populating the data could be a big improvement to a more professional version. 

- Add the ability to toggle on and off flags as a game start option. This would support both NF players and Flag players alike.

#### Additional notes:

If you are playing on Desktop a trick you can use, if you like playing with the Large board vertically, is you start the game with browser window width completely squashed and then click start. It will then generate the board vertically. However, if you'd like to play the Large board traditionally, horizal, then simply start the game with your browser larger than 500px in width. The horizonal generation only works for Desktop as a cell phone will generate it vertically everytime. I decided to take the formatting over the traidition. 

I ran it a lot and seemed to run well on mobile and desktop. If I missed anything or there is additional feedback, please feel free to send it. Also anyone is welcome to jump in on the project, I think the only rule set on the repo is that someone has to approve a merge into master.

##### bgw - 06/14/18
