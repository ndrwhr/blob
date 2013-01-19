/**
 * A constraint represents a connection between any two points in the system. In can satisfy itself
 * using both spring physics or a simple maximum value.
 *
 * @param {Object} options An object literal with the following values:
 *     - {String} type The type of constraint this should be.
 *     - {Points[]} points The points this constraint should bind to.
 *     - {number} min The minimum distance to be maintained (only used by spring constraints).
 *     - {number} max The maximum distance allowed.
 *     - {number} k The spring constant to be used by spring constraints.
 */
var Constraint = function(options){
    this.type = options.type;

    this.points_ = options.points;
    this.world_ = options.world;

    this.min_ = options.min;
    this.max_ = options.max;

    if (this.type === Constraint.SPRING){
        this.k_ = options.k;

        var dist = vec2.dist(options.points[0].current, options.points[1].current);
        if (this.min_ !== undefined) dist = Math.max(dist, this.min_);
        if (this.max_ !== undefined) dist = Math.min(dist, this.max_);

        this.restLength_ = dist;

        this.satisfy = this.satisfySpring_;
    } else {
        this.satisfy = this.satisfyFixed_;
    }
};

Constraint.prototype = {
    /**
     * The type of constraint. Either SPRING or FIXED.
     *
     * @type {string}
     */
    type: null,

    /**
     * The spring constant to be used.
     *
     * @type {number}
     */
    k: null,

    /**
     * The minimum amount of distance that should be maintained (in world units).
     *
     * @type {number}
     * @private
     */
    min_: null,

    /**
     * The maximum amount of distance that should be maintained (in world units).
     *
     * @type {number}
     * @private
     */
    max_: null,

    /**
     * The default distance between the points.
     *
     * @type {number}
     * @private
     */
    restLength_: null,

    /**
     * The two points that this constraint controls.
     *
     * @type {Points[]}
     * @private
     */
    points_: null,

    /**
     * A reference to the world that this constraint belongs to.
     *
     * @type {World}
     * @private
     */
    world_: null,

    /**
     * This function will be overwritten in initialize to be either satisfySpring_ or satisfyFixed_
     * depending on the initial parameters. In in responsible for moving the system ahead a step
     * in time.
     */
    satisfy: function(dt){},

    /**
     * Draw a simple representation of this constraint.
     *
     * @param {CanvasRenderingContext2D} context The context to be drawn into.
     */
    draw: function(context){
        var buffer = 0.05;

        var p1 = this.world_.toPixelsVec(this.points_[0].current);
        var r1 = this.world_.toPixelsValue(this.points_[0].radius + buffer);
        var p2 = this.world_.toPixelsVec(this.points_[1].current);
        var r2 = this.world_.toPixelsValue(this.points_[1].radius + buffer);

        var norm = vec2.normalize(vec2.subtract(p2, p1, vec2.create()));

        p1 = vec2.add(p1, vec2.scale(norm, r1, vec2.create()));
        p2 = vec2.subtract(p2, vec2.scale(norm, r2, vec2.create()));

        context.beginPath();
        context.moveTo(p1[0], p1[1]);
        context.lineTo(p2[0], p2[1]);
        context.stroke();
    },

    /**
     * Uses Hooke's law to satisfy the constraint.
     */
    satisfySpring_: function(dt){
        var between = vec2.create();
        vec2.subtract(this.points_[0].current, this.points_[1].current, between);

        var force = this.k_ * (this.restLength_ - vec2.length(between));

        var direction = vec2.normalize(between, vec2.create());
        this.points_[0].addForce(vec2.scale(direction, force / 2, vec2.create()));
        this.points_[1].addForce(vec2.scale(direction, -force / 2, vec2.create()));
    },

    /**
     * Simply moves one of the points when it exceeds its maximum distance.
     */
    satisfyFixed_: function(dt){
        // As a convention the first point of a fixed constraint will be considered immovable.
        var between = vec2.create();
        vec2.subtract(this.points_[1].current, this.points_[0].current, between);

        var distance = vec2.length(between);
        var direction = vec2.normalize(between, vec2.create());

        if (distance > this.max_){
            var adjustment = vec2.scale(direction, this.max_, vec2.create());
            vec2.add(this.points_[0].current, adjustment, this.points_[1].current);
        }
    }
};

/**
 * Constant used to define fixed length constraints.
 *
 * @type {String}
 */
Constraint.FIXED = 'fixed';

/**
 * Constant used to define spring constraints.
 *
 * @type {String}
 */
Constraint.SPRING = 'spring';