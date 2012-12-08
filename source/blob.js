var Blob = function (options){
    this.world_ = options.world;

    // Bind this function early to help with adding and removing listeners.
    this.mouseMove_ = this.mouseMove_.bind(this);

    this.eyes_ = [];
    for(var i = 0; i < Blob.MAX_EYES; i++)
        this.eyes_.push(this.createEye_());

    this.generateConstraints_();

    this.initializeEvents_();
};

Blob.prototype = {
    draw: function(context){
        for(var i = 0; i < Blob.MAX_EYES; i++)
            this.eyes_[i].draw(context);
    },

    createEye_: function(){
        var x = Math.random() * this.world_.width;
        var y = Math.random() * this.world_.height;

        var scleraPoint = this.world_.addPoint({
            x: x,
            y: y,
            radius: Eye.SCLERA_RADIUS,
            mass: Eye.SCLERA_MASS
        });

        var pupilPoint = this.world_.addPoint({
            x: x,
            y: y,
            radius: Eye.PUPIL_RADIUS,
            mass: Eye.PUPIL_MASS,
            defaultForce: vec2.createFrom(0, 0.005),
            dampening: 0.1
        });

        this.world_.addConstraint({
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

            var connections = Math.floor(Math.random() * 1) + 2;

            while(connections > 0){
                connections--;

                var min = Math.min.apply(null, row);

                var index2 = row.indexOf(min);
                // Remove this value so we don't use it again.
                row[index2] = matrix[index2][index1] = Infinity;

                this.world_.addConstraint({
                    points: [
                        this.eyes_[index1].scleraPoint,
                        this.eyes_[index2].scleraPoint
                    ]
                });
            }
        }, this);
    },

    initializeEvents_: function(){
        document.body.addEventListener('mousedown', this.mouseDown_.bind(this));
        document.body.addEventListener('mouseup', this.mouseUp_.bind(this));
    },

    mouseDown_: function(evt){
        this.closestEye_ = this.getClosestPoint_(this.eventToVec2_(evt));
        this.closestEye_.scleraPoint.invMass = 0;
        this.previousEvt_ = evt;
        this.mouseMove_(evt);
        document.body.addEventListener('mousemove', this.mouseMove_);
    },

    mouseMove_: function(evt){
        this.closestEye_.scleraPoint.current = this.eventToVec2_(evt);
        this.closestEye_.scleraPoint.previous = this.eventToVec2_(this.previousEvt_);
        this.previousEvt_ = evt;
    },

    mouseUp_: function(evt){
        this.closestEye_.scleraPoint.invMass = 1 / this.closestEye_.scleraPoint.mass;
        this.closestEye_ = null;
        document.body.removeEventListener('mousemove', this.mouseMove_);
    },

    getClosestPoint_: function(pos){
        var minDist = Infinity;
        var closestEye = null;

        this.eyes_.forEach(function(eye, index){
            var dist = vec2.dist(pos, eye.scleraPoint.current);
            if (dist < minDist){
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

Blob.MAX_EYES = 15;
