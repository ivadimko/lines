import { vec2 } from 'gl-matrix';

function setmag(t, e, n) {
  let i = e[ 0 ],
    o = e[ 1 ],
    r = i * i + o * o;
  return r > 0 && (r = 1 / Math.sqrt(r), t[ 0 ] = e[ 0 ] * r * n, t[ 1 ] = e[ 1 ] * r * n), t;
}

function limit(t, e, n) {
  let i = e[ 0 ],
    o = e[ 1 ],
    r = i * i + o * o;
  return r > n * n && (r = 1 / Math.sqrt(r), t[ 0 ] = e[ 0 ] * n, t[ 1 ] = e[ 1 ] * n), t;
}

export default class {
  constructor(ctx, x, y) {
    this.ctx = ctx;
    this.original = vec2.fromValues(x, y);
    this.pos = vec2.fromValues(x, y);
    this.shuffled = vec2.fromValues(x+Math.random()*2,y+Math.random()*2);
    this.acceleration = vec2.fromValues(0, 0);
    this.velocity = vec2.fromValues(0, 0);
    this.maxForce = 0.05;
    this.maxSpeed = 5;
    this.maxDist = 50;
  }

  update() {
    vec2.add(this.pos, this.pos, this.velocity);
    vec2.add(this.velocity, this.velocity, this.acceleration);
    vec2.scale(this.acceleration, this.acceleration, 0);
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.moveTo(this.original[ 0 ], this.original[ 1 ]);
	  this.ctx.lineTo(this.pos[ 0 ], this.pos[ 1 ]);
	  // this.ctx.lineTo(this.shuffled[0],this.shuffled[1]);
    this.ctx.stroke();
    this.ctx.closePath();
  }

  calculateForces(x, y) {
    let runAway = this.runAway(x, y);
    let goHome = this.goHome();

    this.applyForces(runAway);
    this.applyForces(goHome);
  }

  applyForces(force) {
    this.acceleration = vec2.add(this.acceleration, this.acceleration, force);
  }

  runAway(x, y) {
    let dist = vec2.create();
    let mouse = vec2.fromValues(x, y);
    vec2.subtract(dist, mouse, this.pos);

    if (vec2.length(dist) < this.maxDist) {
      let force = vec2.create();
      setmag(dist, dist, this.maxSpeed);
      dist = vec2.scale(dist, dist, -1);
      vec2.subtract(force, dist, this.velocity);
      limit(force, force, this.maxForce);
      return force;
    }

    return vec2.fromValues(0, 0);

  }

  goHome() {
    let dist = vec2.create();
    let force = vec2.create();
    vec2.subtract(dist, this.original, this.pos);
    let length = vec2.length(dist);
    let speedMultiplier = 8;

    if (length < this.maxDist) {
      speedMultiplier = this.maxSpeed * length / 100;
      setmag(dist, dist, speedMultiplier);
    }

    vec2.subtract(force, dist, this.velocity);
    limit(force, force, this.maxForce);
    return force;

  }
}
