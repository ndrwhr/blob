/**
 * A Blob is essentially a collection of eyes loosely tied together with a bunch of constraints.
 *
 * @param {Object} options An object literal with the following properties:
 *     - {string} color The color of the blob.
 *     - {World} world The world that the blob should use for it's physics.
 */
var Blob = function(options){
    this.color_ = options.color;
    this.world_ = options.world;

    this.eyes_ = [];
    this.scleraPoints_ = [];
    this.eyeConstraints_ = [];
    for(var i = 0; i < Blob.MAX_EYES; i++)
        this.eyes_.push(this.createEye_());

    this.updateCurrentEmotion_();

    this.mouth_ = this.createMouth_();

    this.generateConstraints_();

    this.startGandering_();
};

Blob.prototype = {
    /**
     * The current emotion that the blob is feeling.
     *
     * @type {string}
     */
    currentEmotion: null,

    /**
     * The color of the blob.
     *
     * @type {string}
     * @private
     */
    color_: null,

    /**
     * The world this blob should be bound to.
     *
     * @type {World}
     * @private
     */
    world_: null,

    /**
     * The array of all the eyes in the blob.
     *
     * @type {Eye[]}
     * @private
     */
    eyes_: null,

    /**
     * The array of all the sclera points (to be used for hull calculation).
     *
     * @type {Point[]}
     * @private
     */
    scleraPoints_: null,

    /**
     * The array of all the eye-eye constraints.
     *
     * @type {Constraint[]}
     * @private
     */
    eyeConstraints_: null,

    /**
     * The blobs mouth.
     *
     * @type {Mouth}
     * @private
     */
    mouth_: null,

    /**
     * The member of the blob that is currently grabbed.
     *
     * @type {Mouth|Eye|null}
     * @private
     */
    grabbedMember_: null,

    /**
     * The previous mouse location.
     *
     * @type {Evt}
     * @private
     */
    previousMousePosition_: null,

    /**
     * Reference to the interval used for gandering.
     *
     * @type {number}
     * @private
     */
    ganderInterval_: null,

    /**
     * True if the blob is currently gandering. This is used for determining the blobs emotion.
     *
     * @type {boolean}
     * @private
     */
    gandering_: null,

    /**
     * Draws the blob with the given context.
     *
     * @param {CanvasRenderingContext2D} context The context into which the blob should draw.
     * @param {boolean} debugMode True if we should be rendering in debug mode.
     */
    draw: function(context, debugMode){
        this.updateCurrentEmotion_();

        var points = this.scleraPoints_.map(function(point){
            return this.world_.toPixelsVec(point.current);
        }, this);
        points.push(this.world_.toPixelsVec(this.mouth_.point.current));
        points = Utilities.computeHull(points, Blob.PADDING);

        if (debugMode){
            Utilities.drawSpline({
                context: context,
                points: points,
                curvature: Blob.CURVATURE,
                fillStyle: 'rgba(205, 245, 255, 0.4)',
                strokeStyle: 'rgba(215, 245, 255, 0.8)',
                lineWidth: 5,

                debug: true,
                debugFillStyle: 'rgba(255, 255, 255, 0.7)',
                debugStrokeStyle: 'rgba(255, 255, 255, 0.5)',
                debugLineWidth: 1,
                knotRadius: 3,
                controlRadius: 2
            });
        } else {
            Utilities.drawSpline({
                context: context,
                points: points,
                curvature: Blob.CURVATURE,
                fillStyle: this.color_
            });
        }

        var i, l;
        for(i = 0; i < Blob.MAX_EYES; i++)
            this.eyes_[i].draw(context, debugMode);

        if (debugMode){
            // Draw the constraints between the eyes.
            context.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            context.lineWidth = 1;
            for(i = 0, l = this.eyeConstraints_.length; i < l; i++)
                this.eyeConstraints_[i].draw(context);
        }

        this.mouth_.draw(context, debugMode);
    },

    /**
     * Called by the experiment when the user presses their mouse down.
     *
     * @param {vec2} position The position at which the user pressed their mouse.
     */
    mouseDown: function(position){
        this.grabbedMember_ = this.getClosestMember_(position);

        if (this.grabbedMember_){
            this.previousMousePosition_ = position;
            this.mouseMove(position);

            document.body.classList.add('grabbed');
        }
    },

    /**
     * Called by the experiment when the user moves their mouse.
     *
     * @param {vec2} position The position of the users mouse.
     */
    mouseMove: function(position){
        this.lookAt_(position);

        this.ganderInterval_ = clearInterval(this.ganderInterval_);
        this.gandering_ = false;

        if (this.grabbedMember_){
            this.grabbedMember_.grab(position, this.previousMousePosition_);
            this.previousMousePosition_ = position;
        } else {
            this.startGandering_();
        }
    },

    /**
     * Called by the experiment when the user lifts up on their mouse.
     *
     * @param {vec2} position The position where the user lifted their mouse.
     */
    mouseUp: function(position){
        document.body.classList.remove('grabbed');

        if (this.grabbedMember_) this.grabbedMember_.release();
        this.grabbedMember_ = null;
    },

    createEye_: function(){
        var buffer = 0.3;
        var minDim =  Math.min(this.world_.width, this.world_.height);
        var dimWithBuffer = minDim * (1 - (buffer * 2));

        var x = (Math.random() * dimWithBuffer) + (minDim * buffer) +
            ((this.world_.width - minDim) / 2);
        var y = (Math.random() * dimWithBuffer) + (minDim * buffer) +
            ((this.world_.height - minDim) / 2);

        var scleraPoint = this.world_.addPoint({
            x: x,
            y: y,
            radius: Eye.SCLERA_RADIUS,
            mass: Eye.SCLERA_MASS,
            interactive: true,
            dampening: 0.03
        });

        this.scleraPoints_.push(scleraPoint);

        var pupilPoint = this.world_.addPoint({
            x: x,
            y: y,
            radius: Eye.PUPIL_RADIUS,
            mass: Eye.PUPIL_MASS,
            defaultForce: 0.003,
            dampening: 0.00001
        });

        this.world_.addConstraint({
            type: Constraint.FIXED,
            points: [
                scleraPoint,
                pupilPoint
            ],
            max: Eye.SCLERA_RADIUS - Eye.PUPIL_RADIUS - Eye.EDGE_SPACE
        });

        var eye = new Eye({
            pupilPoint: pupilPoint,
            scleraPoint: scleraPoint,
            world: this.world_
        });

        return eye;
    },

    createMouth_: function(){
        var point = this.world_.addPoint({
            x: 0.5 * this.world_.width,
            y: 0.5 * this.world_.height,
            radius: Mouth.RADIUS,
            mass: Mouth.MASS,
            interactive: true,
            dampening: 0.03
        });

        var mouth = new Mouth({
            point: point,
            world: this.world_,
            eyes: this.eyes_,
            blob: this
        });

        return mouth;
    },

    /**
     * Generate the set of constraints between all of the eyes and the mouth. This is done by
     * generating an adjacency matrix where each row is the distance from one eye to every other
     * eye in the simulation. Next we loop over each row and choose 4-6 of the closest eyes and add
     * a constraint between the two eyes. The mouth is just connected to every point in the blob
     * to help keep it in the center.
     */
    generateConstraints_: function(){
        var i, j, l;
        var matrix = new Array(Blob.MAX_EYES);

        for(i = 0; i < Blob.MAX_EYES; i++)
            matrix[i] = new Array(Blob.MAX_EYES);

        for(i = 0; i < Blob.MAX_EYES; i++){
            matrix[i][i] = Infinity;

            for (j = i + 1; j < Blob.MAX_EYES; j++){
                matrix[j][i] = matrix[i][j] = vec2.dist(this.eyes_[i].scleraPoint.current,
                    this.eyes_[j].scleraPoint.current);
            }
        }

        matrix.forEach(function(row, index1){
            if (index1 === Blob.MAX_EYES - 1) return;

            var connections = Math.floor(Math.random() * 2) + 4;
            var point1 = this.eyes_[index1].scleraPoint;
            var point2, constraint;

            while(connections > 0){
                connections--;

                var min = Math.min.apply(null, row);

                var index2 = row.indexOf(min);
                // Remove this value so we don't use it again.
                row[index2] = matrix[index2][index1] = Infinity;

                point2 = this.eyes_[index2].scleraPoint;

                constraint = this.world_.addConstraint({
                    type: Constraint.SPRING,
                    points: [
                        point1,
                        point2
                    ],
                    max: 3,
                    min: 2,
                    k: 0.1
                });

                this.eyeConstraints_.push(constraint);
            }
        }, this);

        // Connect the mouth to every other eye in the blob.
        for (i = 0, l = this.eyes_.length; i < l; i++){
            this.world_.addConstraint({
                type: Constraint.SPRING,
                points: [
                    this.mouth_.point,
                    this.eyes_[i].scleraPoint
                ],
                max: Mouth.RADIUS * 5,
                min: Mouth.RADIUS * 3,
                k: 0.05
            });
        }
    },

    /**
     * Sets all the eyes to look at the provided point.
     *
     * @param {vec2} point A point that the eyes should be looking towards.
     */
    lookAt_: function(point){
        this.lookingAt_ = point;

        for(var i = 0; i < Blob.MAX_EYES; i++)
            this.eyes_[i].lookAt(this.lookingAt_);
    },

    /**
     * Kicks off the gandering interval.
     */
    startGandering_: function(){
        this.ganderInterval_ = setInterval(this.gander_.bind(this), 3000);
    },

    /**
     * Set a flag that blob is gandering and look at a random point.
     */
    gander_: function(){
        this.gandering_ = true;
        this.lookAt_(this.world_.getRandomVec2());
    },

    /**
     * Returns the closest member to the provided point.
     *
     * @param {vec2} target The point to compare each member to.
     *
     * @return {Mouth|Eye}
     */
    getClosestMember_: function(target){
        var minDist = Infinity;
        var closestMember = null;

        var checkMember = function(member, point, radius){
            var dist = vec2.dist(target, point.current);
            if (dist < minDist && dist <= radius){
                minDist = dist;
                closestMember = member;
            }
        };

        this.eyes_.forEach(function(eye, index){
            checkMember(eye, eye.scleraPoint, Eye.SCLERA_RADIUS);
        });

        checkMember(this.mouth_, this.mouth_.point, Mouth.RADIUS);

        return closestMember;
    },

    updateCurrentEmotion_: function(){
        if (!this.currentEmotion){
            this.currentEmotion = Blob.EMOTIONS.HAPPY;
            return;
        }

        var dist = vec2.dist(this.mouth_.point.current, this.mouth_.point.previous);
        if (!this.mouth_.point.invMass){
            // Mouth is being grabbed.
            this.currentEmotion = Blob.EMOTIONS.GAGGED;
        } else if (dist > 0.03){
            // Moving too fast.
            this.currentEmotion_ = Blob.EMOTIONS.TERROR;
        } else if (!!this.grabbedMember_ || dist > 0.015){
            // Grabbed or moving a little.
            this.currentEmotion = Blob.EMOTIONS.SAD;
        } else if (!!this.gandering_){
            this.currentEmotion = Blob.EMOTIONS.BORED;
        } else if (this.inDanger_()){
            // In danger of being grabbed.
            this.currentEmotion = Blob.EMOTIONS.WORRIED;
        } else {
            this.currentEmotion = Blob.EMOTIONS.HAPPY;
        }
    },

    /**
     * Returns true if the users cursor is near the blob.
     *
     * @return {Boolean}
     */
    inDanger_: function(){
        if (!this.lookingAt_) return false;
        else return vec2.dist(this.mouth_.point.current, this.lookingAt_) < 3;
    }
};

/**
 * All of the emotions that the blob can feel.
 *
 * @type {object}
 * @static
 */
Blob.EMOTIONS = {
    HAPPY: 'HAPPY',
    SAD: 'SAD',
    TERROR: 'TERROR',
    WORRIED: 'WORRIED',
    GAGGED: 'GAGGED',
    BORED: 'BORED'
};

/**
 * The maximum number of eyes the blob should have.
 *
 * @type {Number}
 * @static
 */
Blob.MAX_EYES = 9;

/**
 * The amount of padding (in world units) between the outermost eyes and the edge of the blob.
 *
 * @type {Number}
 * @static
 */
Blob.PADDING = 1.5;

/**
 * The amount of curvature the blobs outer shell should have.
 *
 * @type {Number}
 * @static
 */
Blob.CURVATURE = 0.2;

/**
 * The maximum amount of gravity the blob can withstand.
 *
 * @type {Number}
 * @static
 */
Blob.MAX_GRAVITY = 0.01;
