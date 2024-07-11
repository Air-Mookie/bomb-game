new Vue({
  el: '#app',
  vuetify: new Vuetify({
    theme: { dark: true },
  }),
  data() {
    return {
      size: 10,
      blocks: [],
      clickedCount: 0,
      showMine: false,
      showSuccessModal: false,
      showFailureModal: false,
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.showSuccessModal = false;
      this.showFailureModal = false;
      this.showMine = false;
      this.clickedCount = 0;
      const rows = [];
      const mineBlockIds = this.getMineBlockIds(this.size);
      let blockId = 0;
      for (let rowNum = 0; rowNum < this.size; rowNum++) {
        let cols = [];
        for (let colNum = 0; colNum < this.size; colNum++) {
          let isMine = mineBlockIds.includes(blockId);
          cols.push({ id: blockId, isMine: isMine, clicked: false, value: 0 });
          blockId++;
        }
        rows.push(cols);
      }
      this.blocks = rows;
    },
    getMineBlockIds(size) {
      const mineBlockIds = [];
      const mineCount = Math.floor(size * size * 0.2); // 지뢰 개수를 전체 블록의 20%로 설정
      while (mineBlockIds.length < mineCount) {
        let randomValue = Math.floor(Math.random() * (size * size));
        if (!mineBlockIds.includes(randomValue)) {
          mineBlockIds.push(randomValue);
        }
      }
      return mineBlockIds;
    },
    handleClickBlock(x, y) {
      const block = this.blocks[y][x];
      if (block.clicked) return;
      block.clicked = true;
      if (block.isMine) {
        this.showFailureModal = true;
        this.playExplosionSound();
        return;
      }
      this.clickedCount++;
      let mineCount = 0;
      let minY = y - 1 >= 0 ? y - 1 : y;
      let maxY = y + 1 < this.size ? y + 1 : y;
      let minX = x - 1 >= 0 ? x - 1 : x;
      let maxX = x + 1 < this.size ? x + 1 : x;
      for (let currY = minY; currY <= maxY; currY++) {
        for (let currX = minX; currX <= maxX; currX++) {
          if (currY === y && currX === x) continue;
          if (this.blocks[currY][currX].isMine) mineCount++;
        }
      }
      block.value = mineCount;
      if (this.clickedCount === this.getTotalClickableBlocks()) {
        this.showSuccessModal = true;
      }
    },
    handleRefresh() {
      this.init();
    },
    getTotalClickableBlocks() {
      return this.size * this.size - this.getMineBlockIds(this.size).length;
    },
    playExplosionSound() {
      const sound = document.getElementById('explosion-sound');
      if (sound) {
        sound.currentTime = 0;
        sound.play();
      }
    },
  },
});
