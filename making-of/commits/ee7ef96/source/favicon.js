/**
 * An instance of FavIcon is responsible for rendering an eyeball into the favicon of the page.
 */
var FavIcon = function(){
    this.link_ = document.getElementById('favicon');
    this.canvas_ = document.createElement('canvas');
    this.context_ = this.canvas_.getContext('2d');
    this.canvas_.width = this.canvas_.height = FavIcon.SIZE;

    this.world_ = new World({
        gravity: vec2.create(),
        width: FavIcon.SIZE,
        height: FavIcon.SIZE
    });

    this.eye_ = this.createEye();

    setInterval(this.animate_.bind(this), 10);
    setInterval(this.gander_.bind(this), 3000);
};

FavIcon.prototype = {
    /**
     * A reference to the favicon link tag in the head of the document.
     * @type {Element}
     */
    link_: null,

    /**
     * A reference to the canvas that the eye will be rendered onto.
     * @type {Element}
     */
    canvas_: null,

    /**
     * The context that the eye should be rendered onto.
     * @type {CanvasRenderingContext2D}
     */
    context_: null,

    /**
     * A reference to the eye of the FavIcon.
     * @type {Eye}
     */
    eye_: null,

    /**
     * Steps the world, draws the eye and updates the link tag in the head.
     */
    animate_: function(){
        this.context_.clearRect(0, 0, FavIcon.SIZE, FavIcon.SIZE);

        this.world_.step();

        this.eye_.draw(this.context_);

        this.link_.href = this.canvas_.toDataURL('image/png');
    },

    gander_: function(){
        this.eye_.lookAt(this.world_.getRandomVec2());
    },

    createEye: function(){
        var worldSize = this.world_.width;
        var scleraRadius = worldSize / 2;
        var pupilRadius = worldSize * 0.2;

        var scleraPoint = this.world_.addPoint({
            x: scleraRadius,
            y: scleraRadius,
            radius: scleraRadius,
            mass: Eye.SCLERA_MASS,
            dampening: 0.03
        });

        var pupilPoint = this.world_.addPoint({
            x: scleraRadius,
            y: scleraRadius,
            radius: pupilRadius,
            mass: Eye.PUPIL_MASS,
            defaultForce: 0.008,
            dampening: 0.1
        });

        this.world_.addConstraint({
            type: Constraint.FIXED,
            points: [
                scleraPoint,
                pupilPoint
            ],
            max: scleraRadius - pupilRadius - 0.3
        });

        var eye = new Eye({
            pupilPoint: pupilPoint,
            scleraPoint: scleraPoint,
            world: this.world_,
            scleraRadius: scleraRadius,
            pupilRadius: pupilRadius
        });

        return eye;
    }
};

FavIcon.SIZE = 16;