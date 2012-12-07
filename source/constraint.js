
var Constraint = function(options){
    this.points_ = options.points;

    this.k_ = options.k || 0.75;

    var dist = vec2.dist(options.points[0].current, options.points[1].current);
    dist = Math.min(Math.max(dist, options.points[0].radius + options.points[1].radius), 0.5);
    this.restLength_ = dist;
    this.squaredRestLength_ = this.restLength_ * this.restLength_;
};

Constraint.prototype = {
    draw: function(context){
        var width = context.canvas.width;
        var height = context.canvas.height;

        context.strokeStyle = 'rgba(0,0,0,0.1)';
        context.lineWidth = 1;

        context.beginPath();
        context.moveTo(this.points_[0].current[0] * width, this.points_[0].current[1] * height);
        context.lineTo(this.points_[1].current[0] * width, this.points_[1].current[1] * height);
        context.stroke();
    },

    satisfy: function(dt){
        var between = vec2.create();
        vec2.subtract(this.points_[0].current, this.points_[1].current, between);

        var force = this.k_ * (this.restLength_ - vec2.length(between));

        var direction = vec2.normalize(between, vec2.create());
        this.points_[0].addForce(vec2.scale(direction, force / 2, vec2.create()));
        this.points_[1].addForce(vec2.scale(direction, -force / 2, vec2.create()));

        return;
    }
};
