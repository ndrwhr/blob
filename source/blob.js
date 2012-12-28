var Blob = function (options){
    this.color_ = options.color;
    this.world_ = options.world;

    this.eyes_ = [];
    this.scleraPoints_ = [];
    for(var i = 0; i < Blob.MAX_EYES; i++)
        this.eyes_.push(this.createEye_());

    this.mouth_ = this.createMouth_();

    this.generateConstraints_();
};

Blob.prototype = {
    draw: function(context, debugMode){
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
                fillStyle: 'rgba(225, 245, 255, 0.3)',
                strokeStyle: 'rgba(225, 245, 255, 0.8)',
                lineWidth: 5,

                debug: true,
                debugFillStyle: 'rgba(255, 255, 255, 0.9)',
                debugStrokeStyle: 'rgba(255, 255, 255, 0.8)',
                debugLineWidth: 2,
                knotRadius: 5,
                controlRadius: 3
            });
        } else {
            Utilities.drawSpline({
                context: context,
                points: points,
                curvature: Blob.CURVATURE,
                fillStyle: this.color_
            });
        }

        if (debugMode) this.world_.drawDebug(context);

        for(var i = 0; i < Blob.MAX_EYES; i++)
            this.eyes_[i].draw(context, debugMode);

        this.mouth_.draw(context, debugMode);

        // Draw the lines for each eye to the point that they're looking at.
        if (debugMode && this.lookingAt_) this.drawFocus_(context);
    },

    /**
     * Returns true if the users cursor is near the blob.
     *
     * @return {Boolean}
     */
    inDanger: function(){
        if (!this.lookingAt_) return false;
        else return vec2.dist(this.mouth_.point.current, this.lookingAt_) < 3;
    },

    /**
     * Returns true if the blob has been grabbed by the user.
     *
     * @return {Boolean}
     */
    isComprimizied: function(){
        return !!this.closestMember_;
    },

    /**
     * Returns true if the blob is gandering.
     *
     * @return {Boolean}
     */
    isBored: function(){
        return !!this.gandering_;
    },

    /**
     * Called by the experiment when the user presses their mouse down.
     *
     * @param {vec2} position The position at which the user pressed their mouse.
     */
    mouseDown: function(position){
        this.closestMember_ = this.getClosestMember_(position);

        if (this.closestMember_){
            this.previousUserPosition_ = position;
            this.isMouseDown_ = true;
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

        if (this.isMouseDown_){
            this.closestMember_.grab(position, this.previousUserPosition_);
            this.previousUserPosition_ = position;
        } else {
            this.ganderInterval_ = setInterval(this.gander_.bind(this), 3000);
        }
    },

    /**
     * Called by the experiment when the user lifts up on their mouse.
     *
     * @param {vec2} position The position where the user lifted their mouse.
     */
    mouseUp: function(position){
        document.body.classList.remove('grabbed');

        if (this.closestMember_) this.closestMember_.release();
        this.closestMember_ = null;
        this.isMouseDown_ = false;
    },

    createEye_: function(){
        var buffer = 0.5;
        var x = (Math.random() * this.world_.width * (1 - buffer)) +
            (this.world_.width * buffer / 2);
        var y = Math.random() * (this.world_.height * (1 - buffer)) +
            (this.world_.height * buffer / 2);

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
            var point2;

            while(connections > 0){
                connections--;

                var min = Math.min.apply(null, row);

                var index2 = row.indexOf(min);
                // Remove this value so we don't use it again.
                row[index2] = matrix[index2][index1] = Infinity;

                point2 = this.eyes_[index2].scleraPoint;

                this.world_.addConstraint({
                    type: Constraint.SPRING,
                    points: [
                        point1,
                        point2
                    ],
                    max: 3,
                    min: 2,
                    k: 0.1
                });
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

    lookAt_: function(point){
        this.lookingAt_ = point;

        for(var i = 0; i < Blob.MAX_EYES; i++)
            this.eyes_[i].lookAt(this.lookingAt_);
    },

    gander_: function(){
        this.gandering_ = true;
        this.lookAt_(this.world_.getRandomVec2());
    },

    drawFocus_: function(context){
        var lookingAt = this.world_.toPixelsVec(this.lookingAt_);
        var length = 10;
        context.lineWidth = 4;
        context.strokeStyle = 'white';
        context.beginPath();
        context.moveTo(lookingAt[0] - length, lookingAt[1] - length);
        context.lineTo(lookingAt[0] + length, lookingAt[1] + length);
        context.stroke();

        context.beginPath();
        context.moveTo(lookingAt[0] - length, lookingAt[1] + length);
        context.lineTo(lookingAt[0] + length, lookingAt[1] - length);
        context.stroke();

        context.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        context.lineWidth = 0.5;

        var point;
        for(var i = 0; i < Blob.MAX_EYES; i++){
            point = this.world_.toPixelsVec(this.eyes_[i].scleraPoint.current);
            context.beginPath();
            context.moveTo(lookingAt[0], lookingAt[1]);
            context.lineTo(point[0], point[1]);
            context.stroke();
        }
    },

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
    }
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
Blob.CURVATURE = 0.3;