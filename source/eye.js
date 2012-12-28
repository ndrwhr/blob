
var Eye = function(options){
    this.scleraPoint = options.scleraPoint;
    this.pupilPoint = options.pupilPoint;
    this.world_ = options.world;
};

Eye.prototype = {
    draw: function(context, debug){
        if (this.scleraPoint.invMass === 0){
            // If the eye is currently grabbed make it look at some random point.
            this.lookAt(this.world_.getRandomVec2());
        }

        this.drawSclera_(context, debug);
        this.drawPupil_(context, debug);
    },

    lookAt: function(point){
        var direction = vec2.subtract(point, this.scleraPoint.current, vec2.create());
        this.pupilPoint.defaultForceDirection = vec2.normalize(direction);
    },

    grab: function(current, previous){
        this.scleraPoint.invMass = 0;
        this.scleraPoint.current = current;
        this.scleraPoint.previous = previous;
    },

    release: function(){
        this.scleraPoint.invMass = 1 / this.scleraPoint.mass;
    },

    drawSclera_: function(context, debug){
        var p = this.world_.toPixelsVec(this.scleraPoint.current);
        var radius = this.world_.toPixelsValue(Eye.SCLERA_RADIUS);

        context.beginPath();
        context.moveTo(p[0], p[1]);
        context.arc(p[0], p[1], radius, 0, Math.PI * 2, false);

        if (debug){
            context.strokeStyle = 'rgba(255, 255, 255, 0.6)';
            context.fillStyle = 'rgba(255, 255, 255, 0.4)';
            context.lineWidth = 1;
            context.stroke();
            context.fill();
        } else {
            context.fillStyle = 'white';
            context.fill();
        }
    },

    drawPupil_: function(context, debug){
        var p = this.world_.toPixelsVec(this.pupilPoint.current);
        var radius = this.world_.toPixelsValue(Eye.PUPIL_RADIUS);

        context.beginPath();
        context.moveTo(p[0], p[1]);
        context.arc(p[0], p[1], radius, 0, Math.PI * 2, false);

        if (debug){
            context.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            context.fillStyle = 'rgba(255, 255, 255, 0.7)';
            context.lineWidth = 1;
            context.stroke();
            context.fill();
        } else {
            context.fillStyle = 'rgba(0,0,0,0.75)';
            context.fill();
        }

        if (!debug){
            var innerRadius = radius * 0.55;
            var innerOffset = radius * 0.15;
            context.fillStyle = 'rgba(255,255,255,0.05)';
            context.beginPath();
            context.moveTo(p[0], p[1]);
            context.arc(p[0] + innerOffset, p[1] + innerOffset, innerRadius, 0, Math.PI * 2, false);
            context.fill();
        }
    }
};

Eye.SCLERA_MASS = 0.01;
Eye.SCLERA_RADIUS = 0.246;

Eye.PUPIL_MASS = 0.005;
Eye.PUPIL_RADIUS = 0.1;

Eye.EDGE_SPACE = 0.03;

