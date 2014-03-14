/**
 * A point represents an individual point mass in a system.
 *
 * @param {Object} options An object literal with the following properties:
 *     - {number} x The starting x position of the point.
 *     - {number} y The starting y position of the point.
 *     - {number} mass
 *     - {number} radius
 *     - {boolean} interactive
 *     - {boolean} defaultForce
 */
var Point = function(options){
    this.current = vec2.createFrom(options.x, options.y);
    this.previous = vec2.createFrom(options.x, options.y);

    this.radius = options.radius;

    this.mass = options.mass;
    this.invMass = 1 / options.mass;

    this.interactive = options.interactive;
    this.defaultForce = options.defaultForce;

    this.force_ = vec2.createFrom(0.0, 0.0);
    this.dampening_ = options.dampening;

    this.world_ = options.world;
};

Point.prototype = {
    /**
     * The current position of the point.
     *
     * @type {vec2}
     */
    current: null,

    /**
     * The previous position of the point.
     *
     * @type {vec2}
     */
    previous: null,

    /**
     * The radius of the point in world units.
     *
     * @type {number}
     */
    radius: null,

    /**
     * The mass of the unit in kg.
     *
     * @type {number}
     */
    mass: null,

    /**
     * The inverse of the mass of the point.
     *
     * @type {number}
     */
    invMass: null,

    /**
     * Whether this point should interact with gravity and other points in the system.
     *
     * @type {boolean}
     */
    interactive: null,

    /**
     * The default force to be applied to this particle at every step.
     *
     * @type {vec2}
     */
    defaultForce: null,

    /**
     * The accumulated force that should be applied to this point.
     *
     * @type {vec2}
     * @private
     */
    force_: null,

    /**
     * The amount of dampening to be applied to this point when it moves.
     *
     * @type {number}
     */
    dampening_: null,

    /**
     * A reference to the world that this particle belongs to.
     *
     * @type {World}
     */
    world_: null,

    /**
     * Adds a force vector to the force accumulator.
     *
     * @param {vec2} force The new force to be applied.
     */
    addForce: function(force){
        vec2.add(force, this.force_);
    },

    /**
     * Move a point ahead a given time step.
     *
     * @param {number} dt Amount of time to move ahead (in ms).
     */
    move: function(dt){
        // If the point has infinite mass we don't need to move at all.
        if (this.invMass === 0){
            this.force_ = vec2.create();
            return;
        }

        if (this.interactive) this.addForce(this.world_.gravity);
        if (this.defaultForce) this.addForce(this.defaultForce);

        var temp = vec2.create(this.current);

        // Find the difference vector between current and previous.
        var delta = vec2.subtract(this.current, this.previous, vec2.create());

        // Find the amount of force to be applied for this time step.
        var force = vec2.scale(this.force_, 1 / (this.mass * dt * dt), vec2.create());

        // Calculate the amount of change to apply to the current position.
        var change = vec2.scale(vec2.add(delta, force, vec2.create()), 1 - this.dampening_);

        vec2.add(change, this.current);
        this.previous = temp;

        // Interact with the rest of the system.
        if (this.interactive) this.world_.interact(this);

        // Reset the forces.
        this.force_ = vec2.create();
    },

    /**
     * Draw a simple representation of this point.
     *
     * @param {CanvasRenderingContext2D} context The context to be drawn into.
     */
    draw: function(context){
        var p = this.world_.toPixelsVec(this.current);
        var radius = this.world_.toPixelsValue(this.radius);

        context.strokeStyle = 'black';
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(p[0] + radius, p[1]);
        context.arc(p[0], p[1], radius, 0, Math.PI * 2, false);
        context.stroke();
    }
};
