
var Constraint = function(options){
    this.points_ = options.points;

    if (options.max === undefined){
        this.k_ = options.k || 0.5;

        var dist = vec2.dist(options.points[0].current, options.points[1].current);
        dist = Math.max(dist, options.points[0].radius + options.points[1].radius);
        this.restLength_ = dist;

        this.satisfy = this.satisfySpring_;
    } else {
        this.max_ = options.max;

        this.satisfy = this.satisfyFixed_;
    }
};

Constraint.prototype = {
    draw: function(context){
        var width = context.canvas.width;
        var height = context.canvas.height;

        context.strokeStyle = 'black';
        context.lineWidth = 0.2;

        context.beginPath();
        context.moveTo(this.points_[0].current[0] * width, this.points_[0].current[1] * height);
        context.lineTo(this.points_[1].current[0] * width, this.points_[1].current[1] * height);
        context.stroke();
    },

    satisfy: function(dt){
        // This function will be overwritten in initialize to be either satisfySpring_ or
        // satisfyFixed_ depending on the initial parameters.
    },

    satisfySpring_: function(dt){
        var between = vec2.create();
        vec2.subtract(this.points_[0].current, this.points_[1].current, between);

        var force = this.k_ * (this.restLength_ - vec2.length(between));

        var direction = vec2.normalize(between, vec2.create());
        this.points_[0].addForce(vec2.scale(direction, force / 2, vec2.create()));
        this.points_[1].addForce(vec2.scale(direction, -force / 2, vec2.create()));
    },

    satisfyFixed_: function(dt){
        // As a convention the first point of a fixed constraint will be considered immovable.
        var between = vec2.create();
        vec2.subtract(this.points_[1].current, this.points_[0].current, between);

        var distance = vec2.length(between);
        var direction = vec2.normalize(between, vec2.create());

        if (distance > this.max_){
            var adjustment = vec2.scale(direction, this.max_, vec2.create());
            vec2.add(this.points_[0].current, adjustment, this.points_[1].current);
        }
    }
};
