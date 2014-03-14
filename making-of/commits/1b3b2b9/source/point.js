
var Point = function(canvas, x, y){
	this.canvas = canvas;
	this.current = this.previous = new FastVector(x, y);

	this.mass = this.inv_mass = 1;

	this.force = new FastVector(0.0,0.0) || new FastVector(0.0,0.5).multiply(0.05 * 0.05);
	this.radius = 3;
};

Point.prototype = {

	setCurrent: function(p) {
		this.current = p;
	},

	setPrevious: function(p) {
		this.previous = p;
	},

	getCurrent: function() {
		return this.current;
	},

	getPrevious: function() {
		return this.previous;
	},

	move: function() {
		if (this.inv_mass!=0){
			var new_pos = this.current.multiply(1.99).subtract(this.previous.multiply(0.99)).add(this.force);
			new_pos.x = (new_pos.x < 0) ? 0 : ((new_pos.x > 1) ? 1 : new_pos.x);
			new_pos.y = (new_pos.y < 0) ? 0 : ((new_pos.y > 1) ? 1 : new_pos.y);
			this.previous = this.current;
			this.current = new_pos;
		}
	},

	draw: function() {
		var p = this.current;
		x = p.x * this.canvas.width;
		y = p.y * this.canvas.height;

		this.canvas.ctx.strokeStyle = 'black';

		this.canvas.ctx.fillStyle = 'white';
		this.canvas.ctx.beginPath();
		this.canvas.ctx.moveTo(x + 15, y);
		this.canvas.ctx.arc(x, y, 15, 0, Math.PI * 2, false);
		this.canvas.ctx.fill();
		this.canvas.ctx.fillStyle = 'black';

		this.canvas.ctx.lineWidth = 1;
		this.canvas.ctx.beginPath();
		this.canvas.ctx.moveTo(x + 15, y);
		this.canvas.ctx.arc(x, y, 15, 0, Math.PI * 2, false);
		this.canvas.ctx.stroke();
		this.canvas.ctx.lineWidth = 0.3;

		this.canvas.ctx.beginPath();
		this.canvas.ctx.moveTo(x + 15, y + 5);
		this.canvas.ctx.arc(x, y + 5, 9, 0, Math.PI * 2, false);
		this.canvas.ctx.fill();
	}

};
