(function () {
  // ASSET: /home/vova/src/canvas-demos/src/01-ball-collision/index.js
  const $d341fc5d1f29d6a06bec0668d670562$var$canvas = document.getElementById("canvas");
  const $d341fc5d1f29d6a06bec0668d670562$var$ctx = $d341fc5d1f29d6a06bec0668d670562$var$canvas.getContext("2d");
  const $d341fc5d1f29d6a06bec0668d670562$var$colors = ['#f44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E', '#607D8B'];
  const $d341fc5d1f29d6a06bec0668d670562$var$balls = new Array(20).fill(null).map((x, index) => {
    return $d341fc5d1f29d6a06bec0668d670562$var$createBall($d341fc5d1f29d6a06bec0668d670562$var$randomBetween($d341fc5d1f29d6a06bec0668d670562$var$canvas.width * 0.1, $d341fc5d1f29d6a06bec0668d670562$var$canvas.width * 0.9), $d341fc5d1f29d6a06bec0668d670562$var$randomBetween($d341fc5d1f29d6a06bec0668d670562$var$canvas.height * 0.1, $d341fc5d1f29d6a06bec0668d670562$var$canvas.height * 0.9), 10, // radius
    // {x: randomBetween(-2, 2), y: randomBetween(-2, 2)},
    $d341fc5d1f29d6a06bec0668d670562$var$randomItem([{
      x: 1,
      y: 1
    }, {
      x: 2,
      y: 2
    }, {
      x: 3,
      y: 3
    }, {
      x: -1,
      y: -1
    }, {
      x: -2,
      y: -2
    }, {
      x: -3,
      y: -3
    }]), $d341fc5d1f29d6a06bec0668d670562$var$colors[$d341fc5d1f29d6a06bec0668d670562$var$randomBetween(0, $d341fc5d1f29d6a06bec0668d670562$var$colors.length - 1)]);
  });

  function $d341fc5d1f29d6a06bec0668d670562$var$randomItem(items) {
    return items[$d341fc5d1f29d6a06bec0668d670562$var$randomBetween(0, items.length - 1)];
  }

  function $d341fc5d1f29d6a06bec0668d670562$var$createBall(x, y, radius, speed, color = "#0095DD") {
    return {
      x,
      y,
      radius,
      speed,
      color
    };
  } // random between min (inclusive) and max (inclusive)


  function $d341fc5d1f29d6a06bec0668d670562$var$randomBetween(min, max) {
    return Math.floor(Math.random() * (max + 1 - min)) + min;
  }

  function $d341fc5d1f29d6a06bec0668d670562$var$drawBall(ball) {
    $d341fc5d1f29d6a06bec0668d670562$var$ctx.beginPath();
    $d341fc5d1f29d6a06bec0668d670562$var$ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    $d341fc5d1f29d6a06bec0668d670562$var$ctx.fillStyle = ball.color;
    $d341fc5d1f29d6a06bec0668d670562$var$ctx.fill();
    $d341fc5d1f29d6a06bec0668d670562$var$ctx.closePath();
  }

  function $d341fc5d1f29d6a06bec0668d670562$var$detectWallCollision(ball) {
    const collision = {
      x: ball.speed.x,
      y: ball.speed.y
    };

    if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= $d341fc5d1f29d6a06bec0668d670562$var$canvas.height) {
      collision.y = -collision.y;
    } // if collides with left wall or right wall


    if (ball.x + ball.radius >= $d341fc5d1f29d6a06bec0668d670562$var$canvas.width || ball.x - ball.radius <= 0) {
      collision.x = -collision.x;
    }

    return collision;
  }

  function $d341fc5d1f29d6a06bec0668d670562$var$applyCollision(ball, collision) {
    ball.speed = { ...ball.speed,
      ...collision
    };
    ball.x += ball.speed.x;
    ball.y += ball.speed.y;
  }

  function $d341fc5d1f29d6a06bec0668d670562$var$detectBallCollision(first, second) {
    const collision = {
      first: {},
      second: {}
    };
    const distance = Math.sqrt((first.x - second.x) ** 2 + (first.y - second.y) ** 2);
    const isCollided = distance < first.radius + second.radius;

    if (!isCollided) {
      return collision;
    } // second hits first from left


    const isLeftCollision = second.x + second.radius >= first.x - first.radius; // second hits first from right

    const isRightCollision = second.x - second.radius <= first.x + first.radius; // second hits first from top

    const isTopCollision = second.y + second.radius >= first.y - first.radius; // second hits first from bottom

    const isBottomCollision = second.y - second.radius <= first.y + first.radius;

    if (isTopCollision || isBottomCollision) {
      collision.isCollision = true;
      collision.first.y = -first.speed.y;
      collision.second.y = -second.speed.y;
    }

    if (isRightCollision || isLeftCollision) {
      collision.isCollision = true;
      collision.first.x = -first.speed.x;
      collision.second.x = -second.speed.x;
    }

    return collision;
  }

  function $d341fc5d1f29d6a06bec0668d670562$var$draw() {
    $d341fc5d1f29d6a06bec0668d670562$var$ctx.clearRect(0, 0, $d341fc5d1f29d6a06bec0668d670562$var$canvas.width, $d341fc5d1f29d6a06bec0668d670562$var$canvas.height);

    for (let i = 0; i < $d341fc5d1f29d6a06bec0668d670562$var$balls.length; i += 1) {
      const ball = $d341fc5d1f29d6a06bec0668d670562$var$balls[i];
      $d341fc5d1f29d6a06bec0668d670562$var$drawBall(ball);
      $d341fc5d1f29d6a06bec0668d670562$var$applyCollision(ball, $d341fc5d1f29d6a06bec0668d670562$var$detectWallCollision(ball));

      for (let j = 0; j < $d341fc5d1f29d6a06bec0668d670562$var$balls.length; j += 1) {
        if (i !== j && j + 1 < $d341fc5d1f29d6a06bec0668d670562$var$balls.length) {
          const nextBall = $d341fc5d1f29d6a06bec0668d670562$var$balls[j];
          const ballCollision = $d341fc5d1f29d6a06bec0668d670562$var$detectBallCollision(ball, nextBall);

          if (ballCollision.isCollision) {
            $d341fc5d1f29d6a06bec0668d670562$var$applyCollision(ball, ballCollision.first);
            $d341fc5d1f29d6a06bec0668d670562$var$applyCollision(nextBall, ballCollision.second);
          }
        }
      }
    } // balls.forEach((ball) => {
    //     drawBall(ball);
    //     applyCollision(ball, detectWallCollision(ball));
    // });


    requestAnimationFrame($d341fc5d1f29d6a06bec0668d670562$var$draw);
  }

  $d341fc5d1f29d6a06bec0668d670562$var$draw();
})();
//# sourceMappingURL=01-ball-collision.abd33324.js.map
