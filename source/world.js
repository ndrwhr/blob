var World = function(options){
    this.width_ = options.width;
    this.height_ = options.height;
    this.points_ = [];
    this.constraints_ = [];
};

World.prototype = {
    addPoint: function(options){
        var point = new Point(options);
        this.points_.push(point);
        return point;
    },

    addConstraint: function(options){
        var constraint = new Constraint(options);
        this.constraints_.push(constraint);
        return constraint;
    },

    step: function(){
        var i, l;

        for (i = 0, l = this.constraints_.length; i < l; i++)
            this.constraints_[i].satisfy(World.DT);

        for (i = 0, l = this.points_.length; i < l; i++)
            this.points_[i].move(World.DT);
    },

    draw: function(context){
        for (i = 0, l = this.constraints_.length; i < l; i++)
            this.constraints_[i].draw(context);
    }
};

World.DT = 16;