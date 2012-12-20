var Blob = function (options){
    this.world_ = options.world;

    // Bind this function early to help with adding and removing listeners.
    this.mouseMove_ = this.mouseMove_.bind(this);

    this.eyes_ = [];
    this.scleraPoints_ = [];
    for(var i = 0; i < Blob.MAX_EYES; i++)
        this.eyes_.push(this.createEye_());

    this.generateConstraints_();

    this.initializeEvents_();
};

Blob.prototype = {
    draw: function(context){
        this.drawHull_(context);

        for(var i = 0; i < Blob.MAX_EYES; i++)
            this.eyes_[i].draw(context);
    },

    getConvexHull_: function(points){
        var i, l;

        // Compute the cross product between OA and OB.
        function cross(o, a, b){
            return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
        }

        // Sort the points horizontally then vertically.
        points.sort(function(p1, p2){
            return (p1[0] - p2[0]) || (p1[1] - p2[1]);
        });

        var center = vec2.create();
        var lower = [];
        var upper = [];

        for (i = 0, l = points.length; i < l; i++){
            // Compute the lower hull.
            while (lower.length >= 2 &&
                cross(lower[lower.length - 2], lower[lower.length - 1], points[i]) <= 0){
                lower.pop();
            }
            lower.push(points[i]);

            // Compute the upper hull.
            while (upper.length >= 2 &&
                cross(upper[upper.length - 2], upper[upper.length - 1], points[l - i - 1]) <= 0){
                upper.pop();
            }
            upper.push(points[l - i - 1]);

            // Add this point to the center vector.
            vec2.add(points[i], center);
        }

        // Scale the center vector by number of points to find the actual center.
        vec2.scale(center, 1 / points.length);

        // Remove the duplicate points.
        upper.pop();
        lower.pop();

        // Expand the hull outward.
        var hull = lower.concat(upper);
        var scale = Blob.PADDING;
        var offset = vec2.subtract(vec2.scale(center, scale, vec2.create()), center);
        var expandedHull = [];
        for (i = 0, l = hull.length; i < l; i++){
            // Scale the hull point then subtract the center offset so that at the end the expanded
            // hull encloses the original hull.
            expandedHull.push(vec2.subtract(vec2.scale(hull[i], scale, vec2.create()), offset,
                vec2.create()));
        }

        return expandedHull;
    },

    drawHull_: function(context){
        var vectors = this.scleraPoints_.map(function(point){
            return point.current;
        });
        var hullPoints = this.getConvexHull_(vectors).map(function(point){
            return this.world_.toPixelsVec(point);
        }, this);

        context.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        context.fillStyle = 'rgba(255, 255, 255, 0.1)';
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(hullPoints[0][0], hullPoints[0][1]);
        hullPoints.slice(1).forEach(function(point){
            context.lineTo(point[0], point[1]);
        }, this);
        context.lineTo(hullPoints[0][0], hullPoints[0][1]);
        context.fill();
        context.stroke();
    },

    createEye_: function(){
        var buffer = 0.1;
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
            dampening: 0.05
        });

        this.scleraPoints_.push(scleraPoint);

        var pupilPoint = this.world_.addPoint({
            x: x,
            y: y,
            radius: Eye.PUPIL_RADIUS,
            mass: Eye.PUPIL_MASS,
            defaultForce: vec2.createFrom(0, 0.003),
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

            var connections = Math.floor(Math.random() * 2) + 2;
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
                    min: point1.radius + point2.radius,
                    k: 0.1
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

Blob.MAX_EYES = 10;
Blob.PADDING = 1.5;
