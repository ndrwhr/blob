
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
        var p = this.world_.pointToPixels(this.scleraPoint);
        var radius = this.world_.valueToPixels(Eye.SCLERA_RADIUS);

        context.fillStyle = 'white';
        context.beginPath();
        context.moveTo(p[0], p[1]);
        context.arc(p[0], p[1], radius, 0, Math.PI * 2, false);
        context.fill();

        context.strokeStyle = 'black';
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(p[0] + radius, p[1]);
        context.arc(p[0], p[1], radius, 0, Math.PI * 2, false);
        context.stroke();
        context.lineWidth = 0.3;
    },

    drawPupil_: function(context){
        var p = this.world_.pointToPixels(this.pupilPoint);
        var radius = this.world_.valueToPixels(Eye.PUPIL_RADIUS);

        context.fillStyle = 'black';
        context.beginPath();
        context.moveTo(p[0], p[1]);
        context.arc(p[0], p[1], radius, 0, Math.PI * 2, false);
        context.fill();
    }
};

Eye.SCLERA_MASS = 0.01;
Eye.SCLERA_RADIUS = 0.286;

Eye.PUPIL_MASS = 0.005;
Eye.PUPIL_RADIUS = 0.16;

Eye.EDGE_SPACE = 0.03;

