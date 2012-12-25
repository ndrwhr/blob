
var Eye = function(options){
    this.scleraPoint = options.scleraPoint;
    this.pupilPoint = options.pupilPoint;
    this.world_ = options.world;
};

Eye.prototype = {
    lookAt: function(point){
        point = vec2.subtract(this.scleraPoint.current, point, vec2.create());
        this.pupilPoint.defaultForceDirection = vec2.scale(vec2.normalize(point), -1);
    },

    draw: function(context){
        this.drawSclera_(context);
        this.drawPupil_(context);
    },

    drawSclera_: function(context){
        var p = this.world_.toPixelsVec(this.scleraPoint.current);
        var radius = this.world_.toPixelsValue(Eye.SCLERA_RADIUS);

        context.fillStyle = 'white';
        context.beginPath();
        context.moveTo(p[0], p[1]);
        context.arc(p[0], p[1], radius, 0, Math.PI * 2, false);
        context.fill();
    },

    drawPupil_: function(context){
        var p = this.world_.toPixelsVec(this.pupilPoint.current);
        var radius = this.world_.toPixelsValue(Eye.PUPIL_RADIUS);

        context.fillStyle = 'rgba(0,0,0,0.75)';
        context.beginPath();
        context.moveTo(p[0], p[1]);
        context.arc(p[0], p[1], radius, 0, Math.PI * 2, false);
        context.fill();

        var innerRadius = radius * 0.55;
        var innerOffset = radius * 0.15;
        context.fillStyle = 'rgba(255,255,255,0.05)';
        context.beginPath();
        context.moveTo(p[0], p[1]);
        context.arc(p[0] + innerOffset, p[1] + innerOffset, innerRadius, 0, Math.PI * 2, false);
        context.fill();
    }
};

Eye.SCLERA_MASS = 0.01;
Eye.SCLERA_RADIUS = 0.246;

Eye.PUPIL_MASS = 0.005;
Eye.PUPIL_RADIUS = 0.1;

Eye.EDGE_SPACE = 0.03;

