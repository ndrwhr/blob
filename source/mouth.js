/**
 * A Mouth is used to represent the mouth of a blob and all its emotions.
 *
 * @param {Object} options An object literal with the following properties:
 *     - {Point} point The point this mouth should be attached to.
 *     - {World} world The world this mouth belongs to.
 *     - {Blob} blob The blob this mouth resides in.
 */
var Mouth = function(options){
    this.point = options.point;
    this.world_ = options.world;
    this.blob_ = options.blob;

    this.currentEmotion_ = 'HAPPY';
    this.currentExpression_ = Mouth.EMOTION_PATHS[this.currentEmotion_].map(function(point){
        return point.slice(0);
    });
};

Mouth.prototype = {
    /**
     * The center point of the mouth.
     *
     * @type {vec2}
     */
    point: null,

    /**
     * The emotion that the mouth should be trying to display.
     *
     * @type {String}
     * @private
     */
    currentEmotion_: null,

    /**
     * The current current expression of the mouth as array of 2d points.
     *
     * @type {vec2[]}
     * @private
     */
    currentExpression_: null,

    /**
     * The world that this mouth live in.
     *
     * @type {World}
     * @private
     */
    world_: null,

    /**
     * The blob that this mouth belongs to.
     *
     * @type {Blob}
     * @private
     */
    blob_: null,

    draw: function(context, xRayMode){
        var point = this.world_.toPixelsVec(this.point.current);
        var radius = this.world_.toPixelsValue(Mouth.RADIUS);

        context.save();
        context.translate(point[0] - radius, point[1] - radius);

        // Figure out what emotion the mouth should display.
        var dist = vec2.dist(this.point.current, this.point.previous);
        if (!this.point.invMass){
            // Grabbed by the user.
            this.currentEmotion_ = 'GAGGED';
        } else if (dist > 0.03){
            // Being shaken.
            this.currentEmotion_ = 'TERROR';
        } else if (this.blob_.isComprimizied() || dist > 0.015){
            // Grabbed or moving a little.
            this.currentEmotion_ = 'SAD';
        } else if (this.blob_.isBored()){
            this.currentEmotion_ = 'BORED';
        } else if (this.blob_.inDanger()){
            // In danger of being grabbed.
            this.currentEmotion_ = 'WORRIED';
        } else {
            this.currentEmotion_ = 'HAPPY';
        }

        this.updateExpression_();

        var points = this.currentExpression_.map(function(point){
            return [point[0] * radius * 2, point[1] * radius * 2];
        });

        if (xRayMode){
            Utilities.drawSpline({
                context: context,
                points: points,
                curvature: Mouth.CURVATURE,
                fillStyle: 'rgba(225, 245, 255, 0.6)',
                strokeStyle: 'rgba(225, 245, 255, 0.8)',
                lineWidth: 2,

                debug: true,
                debugFillStyle: 'rgba(255, 255, 255, 0.9)',
                debugStrokeStyle: 'rgba(255, 255, 255, 0.8)',
                debugLineWidth: 1,
                knotRadius: 3,
                controlRadius: 2
            });
        } else {
            Utilities.drawSpline({
                context: context,
                points: points,
                curvature: Mouth.CURVATURE,
                fillStyle: 'rgba(0,0,0,0.85)'
            });
        }

        context.restore();
    },

    grab: function(current, previous){
        this.point.invMass = 0;
        this.point.current = current;
        this.point.previous = previous;
    },

    release: function(){
        this.point.invMass = 1 / this.point.mass;
    },

    /**
     * Lerp the the current expression towards the emotion the mouth should be displaying.
     */
    updateExpression_: function(){
        var currentPoint, targetPoint, sign;
        for (var i = 0, l = this.currentExpression_.length; i < l; i++){
            currentPoint = this.currentExpression_[i];
            targetPoint = Mouth.EMOTION_PATHS[this.currentEmotion_][i];

            // Lerp vertically.
            if (Math.abs(currentPoint[1] - targetPoint[1]) > Mouth.LERP){
                sign = this.determineSign_(targetPoint[1] - currentPoint[1]);
                currentPoint[1] += (sign * Mouth.LERP);
            }

            // Lerp horizontally.
            if (Math.abs(currentPoint[0] - targetPoint[0]) > Mouth.LERP){
                sign = this.determineSign_(targetPoint[0] - currentPoint[0]);
                currentPoint[0] += (sign * Mouth.LERP);
            }
        }
    },

    /**
     * Quick helper function to determine the sign of a number.
     *
     * @param {Number} num
     *
     * @return {Number} The sign of the provided number.
     */
    determineSign_: function(num){
        return num > 0 ? 1 : num === 0 ? 0 : -1;
    }
};

/**
 * A map of emotions to paths.
 *
 * @type {Object}
 * @static
 */
Mouth.EMOTION_PATHS = {
    HAPPY: [[0, 0.5], [0.5, 0.3], [1, 0.5], [0.5, 1]],
    SAD: [[0, 0.7], [0.5, 0.3], [1, 0.7], [0.5, 0.5]],
    TERROR: [[0.1, 0.5], [0.5, 0.1], [0.9, 0.5], [0.5, 0.9]],
    WORRIED: [[0, 0.6], [0.5, 0.3], [1, 0.6], [0.5, 0.7]],
    GAGGED: [[0.3, 0.6], [0.5, 0.45], [0.7, 0.6], [0.5, 0.55]],
    BORED: [[0, 0.5], [0.5, 0.4], [1, 0.5], [0.5, 0.7]]
};

/**
 * The size of the step to use when tweening emotions.
 *
 * @type {Number}
 * @static
 */
Mouth.LERP = 0.025;

/**
 * The amount of curve to be applied over the emotion paths above.
 *
 * @type {Number}
 * @static
 */
Mouth.CURVATURE = 0.6;

/**
 * The size of half the mouth.
 *
 * @type {Number}
 * @static
 */
Mouth.RADIUS = 0.45;

/**
 * The weight of the mouth.
 *
 * @type {Number}
 * @static
 */
Mouth.MASS = 0.005;