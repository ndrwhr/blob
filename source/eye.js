
var Eye = function(options){
    this.scleraPoint = options.scleraPoint;
    this.pupilPoint = options.pupilPoint;
    this.world_ = options.world;
};

Eye.prototype = {
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

        context.strokeStyle = 'rgba(0, 0, 0, 0.4)';
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(p[0] + radius, p[1]);
        context.arc(p[0], p[1], radius, 0, Math.PI * 2, false);
        context.stroke();
        context.lineWidth = 0.3;
    },

    drawPupil_: function(context){
        var p = this.world_.toPixelsVec(this.pupilPoint.current);
        var radius = this.world_.toPixelsValue(Eye.PUPIL_RADIUS);

        context.fillStyle = '#333';
        context.beginPath();
        context.moveTo(p[0], p[1]);
        context.arc(p[0], p[1], radius, 0, Math.PI * 2, false);
        context.fill();
    }
};

Eye.SCLERA_MASS = 0.01;
Eye.SCLERA_RADIUS = 0.246;

Eye.PUPIL_MASS = 0.005;
Eye.PUPIL_RADIUS = 0.12;

Eye.EDGE_SPACE = 0.03;

