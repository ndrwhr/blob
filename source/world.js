var World = function(options){
    this.points_ = [];
    this.constraints_ = [];

    this.setSize();
};

World.prototype = {
    setSize: function(){
        var innerWidth = window.innerWidth;
        var innerHeight = window.innerHeight;

        if (innerWidth > innerHeight){
            this.width = World.MIN_DIMENSION * (innerWidth / innerHeight);
            this.height = World.MIN_DIMENSION;

            this.maxScale_ = innerWidth / this.width;
        } else {
            this.width = World.MIN_DIMENSION;
            this.height = World.MIN_DIMENSION * (innerHeight / innerWidth);

            this.maxScale_ = innerHeight / this.height;
        }

        this.scale_ = vec2.createFrom(innerWidth / this.width, innerHeight / this.height);
    },

    addPoint: function(options){
        options.world = this;
        var point = new Point(options);
        this.points_.push(point);
        return point;
    },

    addConstraint: function(options){
        options.world = this;
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

        for (i = 0, l = this.points_.length; i < l; i++)
            this.points_[i].draw(context);
    },

    pointToPixels: function(point){
        return vec2.multiply(point.current, this.scale_, vec2.create());
    },

    valueToPixels: function(value){
        return value * this.maxScale_;
    }
};

World.DT = 16;
World.MIN_DIMENSION = 10;