(function () {
  var $b2cead685fe2f8ae452420615dac47e7$init = parcelRequire("b2cead685fe2f8ae452420615dac47e7");
  describe('checkAABB', () => {
    describe('top collision', () => {
      it('no collision', () => {
        const player = {
          x: 100,
          y: 101,
          width: 100,
          height: 100
        };
        const object = {
          x: 0,
          y: 0,
          width: 100,
          height: 100
        };
        expect($b2cead685fe2f8ae452420615dac47e7$init().checkAABB(player, object)).toEqual(false);
      });
      it('collision', () => {
        const player = {
          x: 100,
          y: 100,
          width: 100,
          height: 100
        };
        const object = {
          x: 0,
          y: 50,
          width: 100,
          height: 100
        };
        expect($b2cead685fe2f8ae452420615dac47e7$init().checkAABB(player, object)).toEqual(true);
      });
      it('overlap by one pixel', () => {
        const player = {
          x: 100,
          y: 100,
          width: 100,
          height: 100
        };
        const object = {
          x: 0,
          y: 0,
          width: 100,
          height: 100
        };
        expect($b2cead685fe2f8ae452420615dac47e7$init().checkAABB(player, object)).toEqual(true);
      });
    });
  });
})();
//# sourceMappingURL=tests.3e7d10bd.js.map
