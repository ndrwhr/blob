
var Eye = function(options){
    this.scleraPoint = options.scleraPoint;
    this.pupilPoint = options.pupilPoint;
};

Eye.prototype = {
    draw: function(context){
        this.drawSclera_(context);
        this.drawPupil_(context);
    },

    drawSclera_: function(context){
        var p = this.scleraPoint.current;
        var x = p[0] * context.canvas.width;
        var y = p[1] * context.canvas.height;

        context.strokeStyle = 'black';

        context.fillStyle = 'white';
        context.beginPath();
        context.moveTo(x, y);
        context.arc(x, y, 15, 0, Math.PI * 2, false);
        context.fill();

        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(x + 15, y);
        context.arc(x, y, 15, 0, Math.PI * 2, false);
        context.stroke();
        context.lineWidth = 0.3;
    },

    drawPupil_: function(context){
        var p = this.pupilPoint.current;
        var x = p[0] * context.canvas.width;
        var y = p[1] * context.canvas.height;

        context.fillStyle = 'black';
        context.beginPath();
        context.moveTo(x, y);
        context.arc(x, y, 9, 0, Math.PI * 2, false);
        context.fill();
    }
};

Eye.SCLERA_MASS = 0.01;
Eye.SCLERA_RADIUS = 0.03;

Eye.PUPIL_MASS = 0.005;
Eye.PUPIL_RADIUS = 0.0015;

