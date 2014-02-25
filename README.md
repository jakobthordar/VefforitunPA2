IRC v2.0
=============

Project by:
Jakob Þórðarson
Kristleifur Þorsteinsson

Programming assignment 2
T-427-WEPO

Dependencies:
=============
You have to have npm, bower, nodejs and python installed.
With bower you have to install: angular-route
                                angular
                                angularjs
                                jquery
                                jQuery
                                node
                                bootstrap
                                sizzle

How to run the program
======================
First you have to start the server by running the command
$ node chatserver.js
Then you run grunt by typing:
$ grunt
You have to run these programs in the root of the folder.

Notes
=====
We added a few lines in the chatserver.js file. A bit to fix 
the private messages. We also added an emit "roomlist" to the 
client in the joinroom function to be able to update our menu
properly.
We also added a new emit in the "ban" function, we broadcast to 
the client a new banned list, we listen for it in the menu function
to be able to update the list of rooms you are banned from.

We decided when we started working on the project to follow the
KISS principle. Keep it simple stupid. We decided against wasting
time on beautiful CSS and bootstrap magic and instead we made a
functional chat app that works. And everything works as it should
(almost(I think))


