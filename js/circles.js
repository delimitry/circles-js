//-----------------------------------------------------------------------
// Circles
//
// Author: delimitry
//-----------------------------------------------------------------------

function Circle(x, y, rad, col, grow) {
	this.x = x;
	this.y = y;
	this.radius = rad;
	this.color = col;
	this.is_grow = grow;
}

function getRandomRange(min, max) {
	return Math.random() * (max - min + 1) + min;
}

function Circles(canvas, context) {
	this.grow_speed = 1;
	this.game_paused = false;
	this.show_lines = false;
	this.circles = new Array();

	this.init = function() {		
		this.grow_speed = 1;
		this.game_paused = false;
		this.show_lines = false;
		this.circles = new Array();
		// init circles
		for (var i = 0; i < 10; i++) {
			pos_x = getRandomRange(0, canvas.width);
			pos_y = getRandomRange(0, canvas.height);
			this.circles.push(new Circle(pos_x, pos_y, 10, 'rgba(100,220,255,0.8)', true));
		}
	}

	this.add_circle = function(x, y) {
		//radius = getRandomRange(0, 30);
		radius = 10;
		this.circles.push(new Circle(x, y, radius, 'rgba(100,220,255,0.8)', true));
	}

	this.update = function() {
		if (this.game_paused) return;
		for (var i = 0; i < this.circles.length; i++) {
			for (var j = 0; j < this.circles.length; j++) {
				// prevent checking with self
				if (i == j) continue; 

				// get the squared distances between centers of circles
				var distance_squared = (this.circles[i].x - this.circles[j].x) * (this.circles[i].x - this.circles[j].x) + (this.circles[i].y - this.circles[j].y) * (this.circles[i].y - this.circles[j].y);   
				// get radiuses and distance
				var max_radius = Math.max(this.circles[i].radius, this.circles[j].radius);
				var min_radius = Math.min(this.circles[i].radius, this.circles[j].radius);
				var distance = Math.sqrt(distance_squared);
				var radius = this.circles[i].radius + this.circles[j].radius;

				// circle inside another circle
				if (max_radius >= distance) {
					if (max_radius - (distance + min_radius) <= 0) {
						// prevent overgrow
						if (this.circles[i].radius > this.circles[j].radius) {
							this.circles[i].radius = max_radius;
							this.circles[j].radius = max_radius - distance;
						}
						this.circles[i].is_grow = !this.circles[i].is_grow;
						this.circles[j].is_grow = !this.circles[j].is_grow;                               
					}           
				} else {               
					// circles outside
					if (distance - radius <= 0) {
						this.circles[i].is_grow = false;
						this.circles[j].is_grow = false;
					}
				}
			}

			// update circles
			if (this.circles[i].is_grow) {
				this.circles[i].radius += this.grow_speed;
			} else {
				this.circles[i].radius -= this.grow_speed;
			}
			if (this.circles[i].radius <= 0) {
				this.circles[i].radius = 0;
				this.circles[i].is_grow = true;
			}
		}
	}

	this.draw = function() {
		// draw circles
		for (var i = 0; i < this.circles.length; i++) {
			context.beginPath();
			context.arc(this.circles[i].x, this.circles[i].y, this.circles[i].radius,  0 , 2 * Math.PI, false);
			context.lineWidth = 1.5;
			context.strokeStyle = this.circles[i].color;
			context.stroke();

			// draw lines
			if (this.show_lines) {
				context.lineWidth = 1;
				context.strokeStyle = 'rgba(100,200,255,0.1)';
				for (var j = 0; j < this.circles.length; j++) {
					context.beginPath();
					context.moveTo(this.circles[i].x, this.circles[i].y);
					context.lineTo(this.circles[j].x, this.circles[j].y);
					context.stroke();
				}
			}
		}

		if (this.game_paused) {
			context.fillStyle = 'rgb(255,255,0)';
			context.font = 'bold 25px Arial';
			context.fillText('Pause', canvas.width / 2 - 40, canvas.height / 2);
		}

		context.fillStyle = 'rgb(100,220,255)';
		context.font = 'bold 10px Arial';
		context.fillText('Circles: ' + this.circles.length, 5, 15);
		context.fillText('Speed: ' + this.grow_speed.toFixed(1), 5, 35);
	}

	this.toggle_pause = function() {
		this.game_paused = !this.game_paused;
	}

	this.toggle_lines = function() {
		this.show_lines = !this.show_lines;
	}

	this.inc_grow_speed = function() {
		if (this.grow_speed <= 10) this.grow_speed += 0.1;
	}

	this.dec_grow_speed = function() {
		if (this.grow_speed > 0.2) this.grow_speed -= 0.1;
	}
}