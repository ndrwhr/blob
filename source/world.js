/**
 * A world is responsible for keeping track of all points and constraints in a system. It is also
 * in charge of moving the system ahead at every step.
 *
 * @param {Object} options An object literal with the following properties.
 *     - {vec2} gravity A vector to be used as the force of gravity on every point.
 */
var World = function(options){
    this.gravity = options.gravity;

    this.constraints_ = [];

    this.interactivePoints_ = [];
    this.nonInteractivePoints_ = [];

    this.setSize(options.width, options.height);
};

World.prototype = {
    /**
     * The width of the system in meters.
     *
     * @type {number}
     */
    width: null,

    /**
     * The height of the system in meters.
     *
     * @type {number}
     */
    height: null,

    /**
     * The gravity vector that should be applied to all interactive points.
     *
     * @type {vec2}
     */
    gravity: null,

    /**
     * An array that contains all of the points in the system that interact with everything.
     *
     * @type {Point[]}
     * @private
     */
    interactivePoints_: null,

    /**
     * An array that contains all of the points in the system that do not interact with anything.
     *
     * @type {Point[]}
     * @private
     */
    nonInteractivePoints_: null,

    /**
     * An array that contains all of the constraints in the system.
     *
     * @type {Constraint[]}
     * @private
     */
    constraints_: null,

    /**
     * A vector that can be used to scale from world coordinates back to pixels.
     *
     * @type {vec2}
     * @private
     */
    scale_: null,

    /**
     * The scale factor of the largest edge from world coordinates back to pixels.
     *
     * @type {number}
     * @private
     */
    maxScale_: null,

    /**
     * Sets the size of the system to the provided width and height.
     *
     * @param {number} width The new width of the world.
     * @param {number} height The new height of the world.
     */
    setSize: function(width, height){
        var innerWidth = width;
        var innerHeight = height;

        if (innerWidth > innerHeight){
            this.width = World.MIN_DIMENSION * (innerWidth / innerHeight);
            this.height = World.MIN_DIMENSION;

            this.maxScale_ = innerWidth / this.width;
        } else {
            this.width = World.MIN_DIMENSION;
            this.height = World.MIN_DIMENSION * (innerHeight / innerWidth);

            this.maxScale_ = innerHeight / this.height;
        }

        this.scale_ = vec2.createFrom(innerWidth / this.width, innerHeight / this.height);
    },

    /**
     * Adds a point to the system.
     *
     * @param {object} options An object literal to be passed to the Point constructor. See the
     *     Point class for details.
     */
    addPoint: function(options){
        options.world = this;
        var point = new Point(options);

        if (options.interactive) this.interactivePoints_.push(point);
        else this.nonInteractivePoints_.push(point);

        return point;
    },

    /**
     * Adds a constraint to the system.
     *
     * @param {object} options An object literal to be passed to the Constraint constructor. See the
     *     Constraint class for details.
     */
    addConstraint: function(options){
        options.world = this;
        var constraint = new Constraint(options);
        this.constraints_.push(constraint);
        return constraint;
    },

    /**
     * Adjusts the provided point to account for collisions with the edges of the system as well as
     * collisions with other points. This method will be called by each interactive point when it
     * updates during it's move phase.
     *
     * @param {Point} point The point that should interact with its surroundings.
     */
    interact: function(point){
        var i, l, point2;

        for (i = 0, l = this.interactivePoints_.length; i < l; i++){
            point2 = this.interactivePoints_[i];
            if (point !== point2) this.collidePoints_(point, point2);
        }

        // Collide with the edges of the system.
        var current = point.current;
        var r = point.radius;
        var x = current[0];
        var y = current[1];

        // If either of the height or width are outside of the bounds, just move it back in.
        current[0] = (x < r) ? r : (x > this.width - r) ? this.width - r : x;
        current[1] = (y < r) ? r : (y > this.height - r) ? this.height - r : y;
    },

    /**
     * Move the system forward one step in time by satisfying all of the constraints and moving the
     * points.
     */
    step: function(){
        var i, l;

        for (i = 0, l = this.constraints_.length; i < l; i++)
            this.constraints_[i].satisfy(World.DT);

        for (i = 0, l = this.interactivePoints_.length; i < l; i++)
            this.interactivePoints_[i].move(World.DT);

        for (i = 0, l = this.nonInteractivePoints_.length; i < l; i++)
            this.nonInteractivePoints_[i].move(World.DT);
    },

    /**
     * Converts a points current location from world coordinates to
     *
     * @param {Point} point The point to be converted.
     *
     * @return {vec2} The point's current position converted to pixels.
     */
    toPixelsVec: function(vec){
        return vec2.multiply(vec, this.scale_, vec2.create());
    },

    /**
     * Converts a single value (usually constants) from world coordinates to pixels.
     *
     * @param {number} value The value to be converted.
     *
     * @return {number} The value converted to pixels.
     */
    toPixelsValue: function(value){
        return value * this.maxScale_;
    },

    /**
     * Returns a vec2 with a random x and y within the bounds of the world.
     *
     * @return {vec2}
     */
    getRandomVec2: function(){
        return vec2.createFrom(this.width * Math.random(), this.height * Math.random());
    },

    /**
     * Detects if two points are currently overlapping and adjusts them so they are not.
     *
     * @param {Point} point1
     * @param {Point} point2
     * @private
     */
    collidePoints_: function(point1, point2){
        var between = vec2.subtract(point1.current, point2.current, vec2.create());
        var distance = vec2.length(between) - point1.radius - point2.radius;

        if (distance >= 0) return;

        var direction = vec2.normalize(between, vec2.create());
        var adjustment = vec2.scale(direction, -distance/2, vec2.create());

        vec2.add(point1.current, adjustment, point1.current);
        vec2.subtract(point2.current, adjustment, point2.current);
    }
};

/**
 * The time (in ms) to move the system ahead at every step.
 *
 * @type {number}
 * @static
 */
World.DT = 16;

/**
 * The minimum dimension to be used by the system.
 *
 * @type {number}
 * @static
 */
World.MIN_DIMENSION = 10;