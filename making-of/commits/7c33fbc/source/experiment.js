/**
 * The main controller class for the entire experiment. When instantiated it will create a new blob
 * and world for it to live in. It will also kick off the rendering loop.
 */
var Experiment = function(){
    this.canvas_ = document.querySelector('canvas');
    this.context_ = this.canvas_.getContext('2d');
    this.canvas_.height = window.innerHeight;
    this.canvas_.width = window.innerWidth;

    this.initializeBlob_();
    this.initializeControls_();
    this.initializeEvents_();

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
     * Whether or not the blob is rendering in debug mode.
     *
     * @type {Boolean}
     * @private
     */
    debugMode_: null,

    /**
     * A timer id that is set when the user clicks the reset button.
     *
     * @type {number|null}
     */
    resetAnimationTimeout_: null,

    /**
     * Instantiates a new blob and world.
     *
     * @private
     */
    initializeBlob_: function(){
        if (this.nextColor_) document.body.classList.remove(this.nextColor_);

        this.currentColor_ = this.nextColor_ || this.randomColor_();
        this.nextColor_ = this.randomColor_();

        var color = this.randomColor_();

        this.world_ = new World();
        this.blob_ = new Blob({
            world: this.world_,
            color: this.currentColor_
        });

        document.body.classList.add(this.nextColor_);
    },

    /**
     * Attaches event listeners to the control buttons.
     *
     * @private
     */
    initializeControls_: function(){
        var resetButton = document.querySelector('.control.reset');
        resetButton.addEventListener('click', this.resetButtonClicked_.bind(this));

        var debugButton = document.querySelector('.control.debug');
        debugButton.addEventListener('click', this.toggleRenderMode_.bind(this));
    },

    /**
     * Called when the reset button is clicked.
     *
     * @param {MouseEvent} evt
     * @private
     */
    resetButtonClicked_: function(evt){
        evt.preventDefault();

        if (this.resetAnimationTimeout_) return;

        evt.target.classList.add('animate');

        this.resetAnimationTimeout_ = setTimeout(function(){
            evt.target.classList.remove('animate');

            this.resetAnimationTimeout_ = null;
        }.bind(this), 500);

        this.initializeBlob_();
    },

    /**
     * Toggle whether or not the blob should be rendering in debug mode.
     *
     * @private
     */
    toggleRenderMode_: function(){
        this.debugMode_ = !this.debugMode_;

        if (this.debugMode_){
            document.body.classList.add('debug-mode');
        } else {
            document.body.classList.remove('debug-mode');
        }
    },

    /**
     * Step the whole experiments ahead on frame and kick off the next animation request.
     *
     * @private
     */
    animate_: function(){
        this.context_.clearRect(0, 0, this.canvas_.width, this.canvas_.height);

        this.world_.step();

        this.blob_.draw(this.context_, this.debugMode_);

        requestAnimationFrame(this.animate_, this.canvas_);
    },

    /**
     * Initialize event listeners for window resizing and mouse events.
     *
     * @private
     */
    initializeEvents_: function(){
        window.addEventListener('resize', this.resize_.bind(this));
        document.body.addEventListener('mousedown', this.mouseDown_.bind(this));
        document.body.addEventListener('mousemove', this.mouseMove_.bind(this));
        document.body.addEventListener('mouseup', this.mouseUp_.bind(this));
    },

    /**
     * Called when the window is resized.
     *
     * @private
     */
    resize_: function(){
        this.world_.setSize();

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
        this.blob_.mouseDown(this.eventToVec2_(evt));
    },

    /**
     * Called when the user moves their mouse.
     *
     * @private
     */
    mouseMove_: function(evt){
        evt.preventDefault();
        this.blob_.mouseMove(this.eventToVec2_(evt));
    },

    /**
     * Called when the user lifts up on their mouse.
     *
     * @private
     */
    mouseUp_: function(evt){
        evt.preventDefault();
        this.blob_.mouseUp(this.eventToVec2_(evt));
    },

    /**
     * Converts a JavaScript mouse event into a vector in world coordinates.
     *
     * @param {MouseEvent} evt
     *
     * @return {vec2}
     * @private
     */
    eventToVec2_: function(evt){
        var x = (evt.pageX / window.innerWidth) * this.world_.width;
        var y = (evt.pageY / window.innerHeight) * this.world_.height;
        return vec2.createFrom(x, y);
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
            'lightskyblue'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
};