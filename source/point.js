
var Point = function(options){
    var position = vec2.createFrom(options.x, options.y);

    this.current = position;
    this.previous = position;

    this.radius = options.radius;
    this.mass = options.mass;

    this.invMass = 1 / options.mass;

    this.defaultForce = options.defaultForce;
    this.force = vec2.createFrom(0.0, 0.0);

    this.dampening = options.dampening || 0.075;
};

Point.prototype = {
    addForce: function(force){
        vec2.add(force, this.force);
    },

    move: function(dt){
        if (this.invMass === 0){
            this.force = vec2.create();
            return;
        }

        if (this.defaultForce) this.addForce(this.defaultForce);

        var temp = vec2.create(this.current);

        // Find the difference vector between current and previous.
        var delta = vec2.subtract(this.current, this.previous, vec2.create());

        // Find the amount of force to be applied for this time step.
        var force = vec2.scale(this.force, 1 / (this.mass * dt * dt), vec2.create());

        // Calculate the amount of change to apply to the current position.
        var change = vec2.scale(vec2.add(delta, force, vec2.create()), 1 - this.dampening);

        vec2.add(change, this.current);
        this.previous = temp;

        // Reset the forces.
        this.force = vec2.create();
    },

    draw: function(context){
        var p = this.current;
        x = p[0] * context.canvas.width;
        y = p[1] * context.canvas.height;

        var radius = (1000 * this.radius);

        context.strokeStyle = 'black';
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(x + radius, y);
        context.arc(x, y, radius, 0, Math.PI * 2, false);
        context.stroke();
    }
};
