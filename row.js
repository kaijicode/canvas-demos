export function row(x, y, gap, items) {
    const tallestItemSize = items.reduce((max, item) => {
        return Math.max(max, item.getHeight());
    }, 0);


    for (let i = 0; i <= items.length - 1; i += 1) {
        items[i].setPosition(x + (i * gap), y);
        items[i].setHeight(tallestItemSize);
        items[i].setWidth();
    }
}


