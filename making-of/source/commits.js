var commits = [
    {
        "date": 1354725373000, 
        "body": [
            "Copied over everything from the old cloth simulation to quickly prototype. I have yet to decide if I want to continue to write my own physics or switch to Box2dWeb.", 
            "Writing my own would be easy enough, but learning a library like Box2d might be a good skill to have. I'm really 50/50 at this point."
        ], 
        "hash": "1b3b2b9", 
        "title": "Initial rough commit - Essentially a prototype"
    }, 
    {
        "date": 1354806981000, 
        "body": [
            "This commit pretty much blows away all the unnecessary prototype code and converts most of the math away from my ancient \"FastVector\" class to gl-matrix.js. There isn't really any functional difference between this and the last commit, except that the animation looks a lot smoother thanks to requestAnimationFrame.", 
            "I've also decided to do my own physics yet again. I know it would probably be a little easier and more reliable to bring in Box2d, but it's been quite a while since I've sat down and muddled through some math."
        ], 
        "hash": "341d8b0", 
        "title": "Removing all old unnecessary code and converting to gl-matrix.js"
    }, 
    {
        "date": 1354858790000, 
        "body": [
            "The physic code that I took from the cloth simulation was optimized for a single task, rendering a uniform cloth. Because these blobs are not at all uniform there were often some weird rendering side effects such as blobs undulating and self propagating. So instead of having a physics engine that completely optimized for speed and one specific scenario, this time I want to create a physics engine that somewhat accurately simulates physics in a more understandable/tuneable manner.", 
            "The new Point and Constraint classes are now significantly simpler as they use some basic newtonian formulas; Hooke's law for the constraints and Newton's equation of motion for the points. They also support more parameters which should allow for some interesting experimentation later.", 
            "You should now see that the blobs are much more predictable and springier. I should also note that I have yet to put the world bounds back in."
        ], 
        "hash": "60b4720", 
        "title": "Rewrote Point and Constraint to us real physics and better options"
    }, 
    {
        "date": 1354981314000, 
        "body": [
            "On top of that I really cleaned up the initialization code by creating World, Blob and Eye objects. The World is responsible for keeping track of all the constraints and points, the Blob takes care of initializing the system, and the Eyes keep track of their points and are responsible for rendering themselves.", 
            "To get the pupils to jiggle I set up a fixed width constraint between the pupil and the center of the eye. Whenever the pupil moves beyond its constraint's maximum, the constraint simply moves the pupil back inside. This give the illusion that the pupil is hitting the edge of the sclera (the white part of the eye)."
        ], 
        "hash": "b544039", 
        "title": "Eyes are now googly"
    }, 
    {
        "date": 1354991739000, 
        "body": [
            "The units used for physics are now entirely different from the units used for drawing. This gives me great flexibility in terms of tweaking both the physics and the drawing of things. As an added bonus the simulation now looks the same no matter what screen size.", 
            "Finally I added some simple debug drawing of the eyes that should hopefully help as I move ahead."
        ], 
        "hash": "bdadf86", 
        "title": "Converted physics units to be independent of drawing units"
    }, 
    {
        "date": 1355074651000, 
        "body": [
            "Eyes are now aware of each other an will no longer overlap. I also finally hacked back in wall detection so the blob will not drift away. There isn't really any fancy physics to do that, it's more of a brute force approach that just checks if each point is overlapping with another.", 
            "I also documented all of the physics classes so far."
        ], 
        "hash": "68aba17", 
        "title": "Adding in collisions between points and walls"
    }, 
    {
        "date": 1355204944000, 
        "body": [
            "It could probably be optimized further, but it does the job for the first attempt. I decided to go with a Monotone chain algorithm as it seemed like it had the least hairy math an is pretty quick to boot. The basics of the algorithm is to first sort the points from the top left to the bottom right. Next you repeatedly compute the cross product to find the outermost points.", 
            "I also optimized the World class to be a little smarter when checking interactions. Instead of blindly looping over all points, I now keep separate arrays for interactive and non-interactive points. This now allows me to limit the amount of looping inside of World.interact."
        ], 
        "hash": "faeb443", 
        "title": "Rough pass at a computing a convex hull"
    }, 
    {
        "date": 1355985261000, 
        "body": [
            "The hull should now be scaled outward such that it looks like all the googly eyes are actually contained within the hull. To do this I just compute the centre of the blob, then scale all the hull points out from there.", 
            "There is still a little distortion when the blobs are oblong in shape. This is caused by the fact I am using a single scale factor for X and Y. At some point it might be worth it to calculate the width to height ratio and create a scale factor for each dimension. In doing this I could probably get the padding around the eyes to be uniform in all directions."
        ], 
        "hash": "aa2e7c8", 
        "title": "Expanding the convex hull outward"
    }, 
    {
        "date": 1356311211000, 
        "body": [
            "After a ton of research I finally through together some spline calculations for the hull of the blob. I'm not entirely happy with this implementation as it falls apart when two points of the hull are close together. I've already tried a couple of times to fix the jankiness with no success. I guess I'll just leave it as is for now. Maybe it will grow on me."
        ], 
        "hash": "2229d80", 
        "title": "Adding spline smoothing to the convex hull."
    }, 
    {
        "date": 1356401467000, 
        "body": [
            "Each eyeball now gets it pupil's default force updated to point at the cursor. I also changed the interaction with the eyeballs to force the user to click directly on an eyeball to drag it. Lastly I increased the amount of default connections to make the hull slightly less jumpy. I'm still going to have to figure out a better plan for the hull jankiness."
        ], 
        "hash": "0a6fa87", 
        "title": "Eyes now follow the cursor"
    }, 
    {
        "date": 1356682736000, 
        "body": [
            "The mouth is probably the crowning achievement of this commit. At several points while working on this I found myself chuckling out loud. Blobs now have the ability to feel:", 
            [
                "Happy if nothing if the user is moving their mouse.", 
                "Content if nothing is going on.", 
                "Worried if the user moves their mouse too close.", 
                "Scared if the user grabs any member of the blob.", 
                "Terror if the blob is being shaken."
            ], 
            "The other awesome part of the commit is the debug button. I really like the idea of giving users the ability to see the inner workings of their blob. The only real achievement with debug mode is that I can now draw the spline control points. Everything else is pretty simple.", 
            "Lastly the reset button is what actually prompted most this work. It provided the opportunity the refactor the random code living in index.html into experiment.js. This is going to provide a great place to dump system level utilities and features.", 
            "At this point I am feeling great about this experiment and am super excited that there are still so many possibilities."
        ], 
        "hash": "7c33fbc", 
        "title": "Added a mouth, debug (x-ray) mode, and a reset button"
    }, 
    {
        "date": 1356975961000, 
        "body": [
            "There is now a new gravity control in the top left that provides some fun interaction. The user can start clicking and dragging on the button to control the direction and magnitude of the gravity. They can also simply click to toggle between the previously set gravity and no gravity."
        ], 
        "hash": "9334761", 
        "title": "Added in gravity controls"
    }, 
    {
        "date": 1358619249000, 
        "body": [
            "Work has been pretty busy so this commit has essentially turned into a collection of things I probably should have done earlier but was either to lazy or busy wrapped up in the excitement of adding features:", 
            [
                "Added an animated favicon that renders an eye.", 
                "Moved the blob emotion detection into the blob itself instead of in the mouth. This was initially done because I was working on adding a heart that would also react to emotions. But now it just seems to fit nicely.", 
                "Changed the constraint drawing to be trigged by the blob. Also made it a little fancier in that they no longer draw their end points underneath the eyes.", 
                "Added a dead simple build script to compile all the JS into a single file.", 
                "Converted CSS to SASS to support more browsers and spirited the icons for the buttons instead of using css and unicode (they looked crappy in other browsers).", 
                "Added a bunch of documentation to the blob and many other components.", 
                "Lots of small style tweaks all over the place."
            ]
        ], 
        "hash": "32c7358", 
        "title": "Cleaning up a bunch of code, adding a fancy favicon, Sass and a build script"
    }, 
    {
        "date": 1358708007000, 
        "body": [
            "The blob should now work pretty well on most mobile devices. This finally gave me a chance to play around with the device motion/orientation APIs.", 
            "One interesting fact about those APIs is that they do not work so well when the device held vertically. Initially I had planned to make it such that if the user was holding their device vertically and rotated side to side that it would keep the gravity pointing down. Unfortunately I wasn't able to get this working reliably so I had to fall back on expecting the user to hold the device horizontally and tip it either front or back or side to side."
        ], 
        "hash": "ee7ef96", 
        "title": "Adding in device orientation and touch events"
    }, 
    {
        "date": 1388468004000, 
        "body": [
            "The making of page is the real jewel of this commit. The basic idea was to create a page where a user could see and interact with every version of the blob throughout its development.", 
            "The first step in doing this was writing a simple python script that loops over each commit and:", 
            [
                "Generates and unpacks a git archive for the given hash.", 
                "Runs the build script at that hash (if it has one).", 
                "Pulls out the relevant metadata (Subject, body, commit time, hash) and eventually dump it into a JS object that will be accessed later."
            ], 
            "This was easy enough, leaning on John Resig's simple js templating library), but very quickly I discovered that running 10+ blob simulations simultaneously was not the best for performance\u2026 (read: my laptop sounded like it would catch fire at any moment).", 
            "To fix this I did two things.", 
            [
                "Do not even load the iframe until it has been scrolled into view.", 
                "If an iframe has been loaded but is not currently visible then pause the simulation and animation."
            ], 
            "Overall I think the page performs really well now and the user doesn't even know that non-visible blobs are paused."
        ], 
        "hash": "7978299", 
        "title": "Added an about panel and making-of page"
    }
];