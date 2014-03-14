
var Point = function(x, y, radius, mass){
    var position = vec2.createFrom(x, y);

    this.current = position;
    this.previous = position;

    this.radius = radius;
    this.mass = mass;

    this.mass = this.inv_mass = 1;

    this.force = vec2.createFrom(0.0, 0.0);

    this.dampening = 0.01;
};

Point.prototype = {
    move: function(dt){
        if (this.inv_mass === 0) return;

        var current = vec2.scale(this.current, 2 - this.dampening, vec2.create());
        var previous = vec2.scale(this.previous, 1 - this.dampening, vec2.create());
        var newCurrent = vec2.subtract(current, previous, vec2.create());

        vec2.add(this.force, newCurrent);

        this.previous = this.current;
        this.current = newCurrent;
    },

    draw: function(context) {
        var p = this.current;
        x = p[0] * context.canvas.width;
        y = p[1] * context.canvas.height;

        context.strokeStyle = 'black';

        context.fillStyle = 'white';
        context.beginPath();
        context.moveTo(x + 15, y);
        context.arc(x, y, 15, 0, Math.PI * 2, false);
        context.fill();
        context.fillStyle = 'black';

        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(x + 15, y);
        context.arc(x, y, 15, 0, Math.PI * 2, false);
        context.stroke();
        context.lineWidth = 0.3;

        context.beginPath();
        context.moveTo(x + 15, y + 5);
        context.arc(x, y + 5, 9, 0, Math.PI * 2, false);
        context.fill();
    }
};
