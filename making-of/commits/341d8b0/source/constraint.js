
var Constraint = function(point1, point2, min, max){
    this.point1 = point1;
    this.point2 = point2;

    this.rest_length = Math.max(vec2.dist(point1.current, point2.current), point1.radius + point2.radius);
    this.squared_rest_length = this.rest_length * this.rest_length;
};

Constraint.prototype = {
    draw: function(context){
        var width = context.canvas.width;
        var height = context.canvas.height;

        context.strokeStyle = 'rgba(0,0,0,0.1)';
        context.lineWidth = 1;

        context.beginPath();
        context.moveTo(this.point1.current[0] * width, this.point1.current[1] * height);
        context.lineTo(this.point2.current[0] * width, this.point2.current[1] * height);
        context.stroke();
    },

    satisfy: function(dt){
        var point1 = this.point1.current;
        var point2 = this.point2.current;
        var delta = vec2.subtract(point2, point1, vec2.create());

        var point1_im = this.point1.inv_mass;
        var point2_im = this.point2.inv_mass;

        var d = (delta[0]*delta[0] + delta[1]*delta[1]);

        var diff = (d - this.squared_rest_length) / ((this.squared_rest_length + d) * (point1_im + point2_im));

        if (point1_im !== 0){
            vec2.add(point1, vec2.scale(delta, point1_im * diff, vec2.create()), this.point1.current);
        }

        if (point2_im != 0){
            vec2.subtract(point2, vec2.scale(delta, point2_im * diff, vec2.create()), this.point2.current);
        }
    }
};
