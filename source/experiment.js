/**
 * The main controller class for the entire experiment. When instantiated it will create a new blob
 * and world for it to live in. It will also kick off the rendering loop.
 */
var Experiment = function(){
    this.canvas_ = document.querySelector('canvas');
    this.context_ = this.canvas_.getContext('2d');
    this.canvas_.height = window.innerHeight;
    this.canvas_.width = window.innerWidth;

    this.touchEventsAvailable_ = ('ontouchstart' in document.documentElement);

    this.orientationEventsAvailable_ = !!window.DeviceMotionEvent;

    this.controls_ = new Controls({
        touchEventsAvailable: this.touchEventsAvailable_,
        orientationEventsAvailable: this.orientationEventsAvailable_,
        gravityEl: document.querySelector('.control.gravity'),
        debugEl: document.querySelector('.control.debug'),
        resetEl: document.querySelector('.control.reset'),
        experiment: this
    });

    this.favIcon_ = new FavIcon();

    this.initializeEvents_();
    this.reset();

    // Binding early so we don't have to on every animation step.
    this.animate_ = this.animate_.bind(this);

    this.animate_();
};

Experiment.prototype = {
    /**
     * The canvas that everything will render into.
     *
     * @type {CanvasElement}
     * @private
     */
    canvas_: null,

    /**
     * The canvas context that everything should be drawn onto.
     *
     * @type {CanvasRenderingContext2D}
     * @private
     */
    context_: null,

    /**
     * A reference to the controls for this experiment.
     *
     * @type {Controls}
     * @private
     */
    controls_: null,

    /**
     * The world that should be used.
     *
     * @type {World}
     * @private
     */
    world_: null,

    /**
     * The actively rendering blob.
     *
     * @type {Blob}
     * @private
     */
    blob_: null,

    /**
     * The color to be used on the next blob.
     *
     * @type {string}
     * @private
     */
    nextColor_: null,

    /**
     * The color of the current blob.
     *
     * @type {string}
     * @private
     */
    currentColor_: null,

    /**
     * A reference to a FavIcon instance.
     * @type {FavIcon}
     */
    favIcon_: null,

    /**
     * True if the users device supports touch events.
     *
     * @type {boolean}
     * @private
     */
    touchEventsAvailable_: null,

    /**
     * True if the users device can emit orientation events.
     *
     * @type {boolean}
     * @private
     */
    orientationEventsAvailable_: null,

    /**
     * Instantiates a new blob and world.
     *
     * @private
     */
    reset: function(){
        if (this.nextColor_) document.body.classList.remove(this.nextColor_);

        this.currentColor_ = this.nextColor_ || this.randomColor_();
        this.nextColor_ = this.randomColor_();

        var color = this.randomColor_();

        this.currentGravity_ = vec2.create();

        this.world_ = new World({
            gravity: this.controls_.currentGravity,
            width: window.innerWidth,
            height: window.innerHeight
        });

        this.blob_ = new Blob({
            world: this.world_,
            color: this.currentColor_
        });

        document.body.classList.add(this.nextColor_);
    },

    /**
     * Step the whole experiments ahead on frame and kick off the next animation request.
     *
     * @private
     */
    animate_: function(){
        this.context_.clearRect(0, 0, this.canvas_.width, this.canvas_.height);

        this.world_.gravity = this.controls_.currentGravity;
        this.world_.step();

        this.blob_.draw(this.context_, this.controls_.debugModeEnabled);

        requestAnimationFrame(this.animate_, this.canvas_);
    },

    /**
     * Initialize event listeners for window resizing and mouse events.
     *
     * @private
     */
    initializeEvents_: function(){
        window.addEventListener('resize', this.resize_.bind(this));

        if (this.touchEventsAvailable_){
            document.addEventListener('touchstart', this.mouseDown_.bind(this));
            document.addEventListener('touchmove', this.mouseMove_.bind(this));
            document.addEventListener('touchend', this.mouseUp_.bind(this));
            document.addEventListener('touchcancel', this.mouseOut_.bind(this));
        } else {
            document.body.addEventListener('mousedown', this.mouseDown_.bind(this));
            document.body.addEventListener('mousemove', this.mouseMove_.bind(this));
            document.body.addEventListener('mouseup', this.mouseUp_.bind(this));
            document.body.addEventListener('mouseout', this.mouseOut_.bind(this));
        }
    },

    /**
     * Called when the window is resized.
     *
     * @private
     */
    resize_: function(){
        this.world_.setSize(window.innerWidth, window.innerHeight);

        this.canvas_.height = window.innerHeight;
        this.canvas_.width = window.innerWidth;
    },

    /**
     * Called when the user presses down on their mouse.
     *
     * @private
     */
    mouseDown_: function(evt){
        evt.preventDefault();

        if (evt.touches) evt = evt.touches[0];

        this.blob_.mouseDown(this.eventToWorldVec2_(evt));
    },

    /**
     * Called when the user moves their mouse.
     *
     * @private
     */
    mouseMove_: function(evt){
        evt.preventDefault();

        if (evt.touches) evt = evt.touches[0];

        this.blob_.mouseMove(this.eventToWorldVec2_(evt));
    },

    /**
     * Called when the user lifts up on their mouse.
     *
     * @private
     */
    mouseUp_: function(evt){
        evt.preventDefault();

        if (evt.touches) evt = evt.touches[0];

        this.blob_.mouseUp(evt && this.eventToWorldVec2_(evt));
    },

    /**
     * Called when the user mouses out of the experiment. This is only really needed when the user
     * has already pressed down and is dragging.
     *
     * @param {MouseEvent} evt
     * @private
     */
    mouseOut_: function(evt){
        evt.preventDefault();
        this.mouseUp_(evt);
    },

    /**
     * Converts a JavaScript mouse event into a vector in world coordinates.
     *
     * @param {MouseEvent} evt
     *
     * @return {vec2}
     * @private
     */
    eventToWorldVec2_: function(evt){
        var scale = [this.world_.width / window.innerWidth,
            this.world_.height / window.innerHeight];

        return vec2.multiply(scale, Utilities.eventToVec2(evt));
    },

    /**
     * Returns a random CSS color.
     *
     * @return {string}
     * @private
     */
    randomColor_: function(){
        var colors = [
            'lightblue',
            'lightcoral',
            'lightgreen',
            'lightpink',
            'lightsalmon',
            'lightseagreen',
            'lightskyblue',
            'palevioletred',
            'yellowgreen',
            'peru'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
};

document.addEventListener('DOMContentLoaded', function(){
    window.exp = new Experiment();
});