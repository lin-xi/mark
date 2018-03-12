let secs = document.querySelectorAll('.section');
for(let i=0, len=secs.length; i<len; i++) {
  let item = secs[i]
  item.style.height = window.innerHeight + 'px';
}


(function() {
  'use strict';
  var LorenzAttractor;

  Math.DEG = 180 / Math.PI;

  Math.RAD = Math.PI / 180;

  Math.TAU = Math.PI * 2;

  Math.PHI = 0.5 + 0.5 * Math.sqrt(5);

  LorenzAttractor = function(σ, ρ, β) {
    return function(v, t) {
      var x, y, z;
      x = v[0], y = v[1], z = v[2];
      v[0] += t * (σ * (y - x));
      v[1] += t * (x * (ρ - z) - y);
      return v[2] += t * (x * y - β * z);
    };
  };

  this.addEventListener('load', function() {
    var canvas, context, lorenz, model, mvp, p, projection, render, u, v, view;
    lorenz = LorenzAttractor(10, 28, 8 / 3);
    canvas = document.querySelector('#canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    context = canvas.getContext('2d');
    model = mat4.create();
    view = mat4.create();
    projection = mat4.create();
    mvp = mat4.create();
    v = vec4.fromValues(1, 0, 0, 1);
    u = vec4.create();
    p = vec4.create();
    return (render = function() {
      var H, HH, HW, T, W, i, lastX, lastY, outside, x, y, z, _i;
      requestAnimationFrame(render);
      T = 1e-3 * Date.now();
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      if (W !== canvas.width || H !== canvas.height) {
        canvas.width = W;
        canvas.height = H;
        context.globalCompositeOperation = 'lighter';
        context.strokeStyle = '#fff';
      }
      mat4.identity(model);
      mat4.rotateY(model, model, 0.05 * T);
      mat4.rotateX(model, model, 1.89 * Math.PI);
      mat4.rotateZ(model, model, 1.66 * Math.PI);
      mat4.translate(model, model, [0, 0, -27]);
      mat4.lookAt(view, [0, 3, 25], [0, -2, 0], [0, 1, 0]);
      mat4.perspective(projection, 45 * Math.RAD, W / H, 1e-3, 1e3);
      mat4.scale(projection, projection, [HW = W / 2, HH = H / 2, 1]);
      [model, view, projection].reduce(function(a, b) {
        return mat4.mul(mvp, b, a);
      });
      context.setTransform(1, 0, 0, -1, HW, HH);
      for (i = _i = 0; _i < 50000; i = ++_i) {
        if (i === 5e1) {
          vec3.copy(u, v);
        }
        lorenz(v, 5e-3);
        vec4.transformMat4(p, v, mvp);
        vec3.scale(p, p, 1 / p[3]);
        x = p[0], y = p[1], z = p[2];
        if ((-1 < z && z < 1) && (-HH < y && y < HH) && (-HW < x && x < HW)) {
          if (outside) {
            outside = false;
            context.moveTo(lastX, lastY);
          }
          context.lineTo(x, y);
        } else {
          if (!outside) {
            outside = true;
            context.lineTo(x, y);
          }
          lastX = x;
          lastY = y;
        }
      }
      vec3.copy(v, u);
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, W, H);
      context.strokeStyle = 'rgb(64,32,128)';
      context.stroke();
      return context.beginPath();
    })();
  });

}).call(window);