(function () {
  var $parcel$modules = {};
  var $parcel$bundles = {};
  var globalObject = typeof globalThis !== 'undefined' ? globalThis : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : {};

  if (globalObject.parcelRequire == null) {
    globalObject.parcelRequire = function (name) {
      // Execute the bundle wrapper function if there is one registered.
      if (name in $parcel$bundles) {
        $parcel$bundles[name]();
        delete $parcel$bundles[name];
      }

      if (name in $parcel$modules) {
        return $parcel$modules[name];
      } // Try the node require function if it exists.
      // Do not use `require` to prevent Webpack from trying to bundle this call


      if (typeof module !== 'undefined' && typeof module.require === 'function') {
        return module.require(name);
      }

      var err = new Error("Cannot find module '" + name + "'");
      err.code = 'MODULE_NOT_FOUND';
      throw err;
    };

    globalObject.parcelRequire.register = function register(id, exports) {
      $parcel$modules[id] = exports;
    };

    globalObject.parcelRequire.registerBundle = function registerBundle(id, fn) {
      $parcel$bundles[id] = fn;
      $parcel$modules[id] = {};
    };
  }

  // ASSET: /home/vova/src/canvas-demos/src/15-2d-collision-tests-example/index.js
  var $b2cead685fe2f8ae452420615dac47e7$exports = {};

  const $b2cead685fe2f8ae452420615dac47e7$export$checkAABB = (objectA, objectB) => {
    const top = objectB.y > objectA.y + objectA.height;
    const bottom = objectB.y + objectB.height < objectA.y;
    const right = objectB.x + objectB.width < objectA.x;
    const left = objectB.x > objectA.x + objectA.width; // if any of (top, right, bottom, left) is true, then there is no collision because
    // one edge is far away from the other

    return !(top || right || bottom || left);
  };

  $b2cead685fe2f8ae452420615dac47e7$exports.checkAABB = $b2cead685fe2f8ae452420615dac47e7$export$checkAABB;

  const $b2cead685fe2f8ae452420615dac47e7$export$distance = (player, target) => {
    return {
      top: player.y - (target.y + target.height),
      right: target.x - (player.x + player.width),
      bottom: target.y - (player.y + player.height),
      left: player.x - (target.x + target.width)
    };
  };

  $b2cead685fe2f8ae452420615dac47e7$exports.distance = $b2cead685fe2f8ae452420615dac47e7$export$distance;

  function $b2cead685fe2f8ae452420615dac47e7$init() {
    return $b2cead685fe2f8ae452420615dac47e7$exports;
  }

  parcelRequire.register("b2cead685fe2f8ae452420615dac47e7", $b2cead685fe2f8ae452420615dac47e7$init);
})();
//# sourceMappingURL=15-2d-collision-tests-example.1e9493f5.js.map
