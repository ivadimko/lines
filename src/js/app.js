import Particle from './particle';

class Background {
  constructor() {
    // init window parameters
	  this.width = window.innerWidth;
	  this.height = window.innerHeight;
	  this.ratio = window.devicePixelRatio;
	  // init canvas
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width * this.ratio;
    this.canvas.height = this.height * this.ratio;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    // init canvas context
	  this.ctx = this.canvas.getContext('2d');
    this.ctx.scale(this.ratio, this.ratio);
    this.ctx.strokeStyle = '#fff';
    // append canvas
    document.body.appendChild(this.canvas);

    // init draw variables
    this.particlesCount = 8000;
    this.particles = [];

    // mouse position
    this.mouseX = 0;
    this.mouseY = 0;

    // lets start!
    this.mouseEvent();
    this.drawParticles();
    this.update();
  }

  update() {
	  this.ctx.clearRect(0, 0, this.width, this.height);
    this.particles.forEach(p => {
	    p.calculateForces(this.mouseX, this.mouseY);
      p.update();
      p.draw();

    });
    window.requestAnimationFrame(this.update.bind(this));
  }
  drawParticles() {
    for (let i = 0; i < this.particlesCount; i++) {
	    // let radius = Math.sqrt(this.height/2*this.height/2*Math.random());
	    // let angle = 2*Math.PI*Math.random();
	    //
	    // let x = this.width/2 + radius*Math.sin(angle);
	    // let y = this.height/2 + radius*Math.cos(angle);
	    let x = this.width*Math.random();
	    let y = this.height*Math.random();
      this.particles.push(new Particle(this.ctx, x, y));

    }
  }
  mouseEvent() {
    this.canvas.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });
  }

}

new Background();
