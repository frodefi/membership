Simple AngularJS Membership tool.
=======
This is my personal learning-Angular-project. See www.erty.com for a live version, just create an account and play around.

First this memebership tool will be angled towards yacht clubs, and it is still in development (so not everything may work properly).

For file structure, I have followed the "new" AngualJS recommendation, as seen here: https://docs.google.com/document/d/1XXMvReO8-Awi1EZXAXS4PzDzdNvV6pGcuaF4Q9821Es/mobilebasic?pli=1

I have used Kinvey(.com) as the BaaS. I started to use Kinvey primarely due to their possibility to run scripts on the server side (as opposed to Firebase as I started out with). They have also a free plan. I am not using any serverside script for the Membership tools though. But the Kinvey-realted code is tucked away in a couple of small services that should be easily replaced with whatever backend you want to use.

Of the various things that is on my todo-list, the most important thing is probably to make routes available according to who is allowed. I have found a very good description, that goes beyond the “standard” solution (at least when you look at the various tutorials out there): http://www.bfcamara.com/post/66001429506/authentication-in-a-spa-with-angular

If you want to download, then run you can try it out with 'grunt serve' only, building the distributed version is not yet set up correctly in Grunt. Actually, my Grunt setup has several issues, thats why some files have  "+" attached to it (file order problem due to my chosen filestruture). I definitely need to dig more into Grunt.

Oh, and there are no tests yet, when I win some time in the lotteri, or somebody will pay me, I will dedicate time fro that :)

If you have any questions, do not esitate to ask!

Use any code in anyway you like, MIT-style.
