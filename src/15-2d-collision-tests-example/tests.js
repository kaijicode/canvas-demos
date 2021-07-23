import { checkAABB } from './index';

describe('checkAABB', () => {
    describe('top collision', () => {
        it('no collision', () => {
            const player = { x: 100, y: 101, width: 100, height: 100 };
            const object = { x: 0, y: 0, width: 100, height: 100 };

            expect(checkAABB(player, object)).toEqual(false);
        });

       it('collision', () => {
            const player = { x: 100, y: 100, width: 100, height: 100 };
            const object = { x: 0, y: 50, width: 100, height: 100 };

            expect(checkAABB(player, object)).toEqual(true);
        });

       it('overlap by one pixel', () => {
            const player = { x: 100, y: 100, width: 100, height: 100 };
            const object = { x: 0, y: 0, width: 100, height: 100 };

            expect(checkAABB(player, object)).toEqual(true);
        });
    })


});
