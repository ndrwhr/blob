var Blob = function (options){
    this.color_ = options.color;
    this.world_ = options.world;

    // Bind this function early to help with adding and removing listeners.
    this.mouseMove_ = this.mouseMove_.bind(this);

    this.eyes_ = [];
    this.scleraPoints_ = [];
    for(var i = 0; i < Blob.MAX_EYES; i++)
        this.eyes_.push(this.createEye_());

    this.generateConstraints_();

    this.initializeEvents_();

    this.time_ = 0;
};

Blob.prototype = {
    draw: function(context){
        var points = this.scleraPoints_.map(function(point){
            return this.world_.toPixelsVec(point.current);
        }, this);

        context.fillStyle = this.color_;
        Spline.draw(context, points, Blob.ROUNDING, Blob.PADDING);

        this.world_.draw(context);

        for(var i = 0; i < Blob.MAX_EYES; i++){
            if (this.mousePosition_) this.eyes_[i].lookAt(this.mousePosition_);
            this.eyes_[i].draw(context);
        }
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

    generateConstraints_: function(){
        var i, j;
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
    },

    initializeEvents_: function(){
        document.body.addEventListener('mousedown', this.mouseDown_.bind(this));
        document.body.addEventListener('mousemove', this.mouseMove_.bind(this));
        document.body.addEventListener('mouseup', this.mouseUp_.bind(this));
    },

    mouseDown_: function(evt){
        this.closestEye_ = this.getClosestPoint_(this.eventToVec2_(evt));
        if (!this.closestEye_) return;
        this.closestEye_.scleraPoint.invMass = 0;
        this.previousEvt_ = evt;
        this.isMouseDown_ = true;
        this.mouseMove_(evt);
    },

    mouseMove_: function(evt){
        if (this.isMouseDown_){
            this.closestEye_.scleraPoint.current = this.eventToVec2_(evt);
            this.closestEye_.scleraPoint.previous = this.eventToVec2_(this.previousEvt_);
            this.previousEvt_ = evt;
        }

        this.mousePosition_ = this.eventToVec2_(evt);
    },

    mouseUp_: function(evt){
        this.isMouseDown_ = false;
        if (!this.closestEye_) return;
        this.closestEye_.scleraPoint.invMass = 1 / this.closestEye_.scleraPoint.mass;
        this.closestEye_ = null;
    },

    getClosestPoint_: function(pos){
        var minDist = Infinity;
        var closestEye = null;

        this.eyes_.forEach(function(eye, index){
            var dist = vec2.dist(pos, eye.scleraPoint.current);
            if (dist < minDist && dist <= Eye.SCLERA_RADIUS){
                minDist = dist;
                closestEye = eye;
            }
        });

        return closestEye;
    },

    eventToVec2_: function(evt){
        var x = (evt.pageX / window.innerWidth) * this.world_.width;
        var y = (evt.pageY / window.innerHeight) * this.world_.height;
        return vec2.createFrom(x, y);
    }
};

Blob.MAX_EYES = 8 + Math.floor(Math.random() * 3);
Blob.PADDING = 1.5;
Blob.ROUNDING = 0.3;