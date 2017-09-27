<template>
    <div id="game-table">
      <transition-group name="chip-pool" tag="div" id="deck">
        <div v-for="(chip, number) in chips"
            v-if="number !== 0" class="chip"
            v-bind:key="number"
            :style="'top: ' + (chip.row * 110 + 10) + 'px; left: ' + (chip.column * 110 + 10) + 'px;'"
            @click="tryToMove(number, chip.row, chip.column)">
          <p class="div-center  chip-number">{{ number }}</p>
        </div>
      </transition-group>
      <div id="info-panel">
        <div id="reset-deck" class="info-panel-element"
            @click="resetDeck">
          <p class="div-center">RESET</p>
        </div>
        <div v-if="victory" id="victory-card" class="info-panel-element">
          <p class="div-center">VICTORY!</p>
        </div>
      </div>
    </div>
</template>

<script>
export default
{
  name: 'fifteen',
  data()
  {
    return {
      size: 4,
      volume: 0,
      deck: [],
      chips: [],
      victory: false,
    }
  },
  methods:
  {
    prepareShuffledDeck()
    {
      var hand = [];
      for (let i = 1; i < this.volume; i++)
        hand[i - 1] = i;
      for (let i = hand.length; i; i--)
      {
        let j = Math.floor(Math.random() * i);
        [hand[i - 1], hand[j]] = [hand[j], hand[i - 1]];
      }
      
      var deck = [];
      for (let i = 0; i < this.size; i++)
      {
        deck[i] = []; 
        for (let j = 0; j < this.size; j++)
          deck[i][j] = hand[i * 4 + j];
      }
      deck[3][3] = 0;
      this.$set(this, 'deck', deck);
      
      var chips = [];
      for (let i = 0; i < hand.length; i++)
      {
        let chip = {};
        chip['row'] = Math.floor(i / this.size);
        chip['column'] = i % this.size;
        chips[hand[i]] = chip;
      }
      this.$set(this, 'chips', chips);
    },
    moveLeft(number, row, column)
    {
        this.deck[row][column - 1] = number;
        this.deck[row][column] = 0;
        this.$set(this.chips[number], 'column', column - 1);
    },
    moveRight(number, row, column)
    {
        this.deck[row][column + 1] = number;
        this.deck[row][column] = 0;
        this.$set(this.chips[number], 'column', column + 1);
    },
    moveUp(number, row, column)
    {
        this.deck[row - 1][column] = number;
        this.deck[row][column] = 0;
        this.$set(this.chips[number], 'row', row - 1);
    },
    moveDown(number, row, column)
    {
        this.deck[row + 1][column] = number;
        this.deck[row][column] = 0;
        this.$set(this.chips[number], 'row', row + 1);
    },
    tryToMove(number, row, column)
    {
      if (row > 0 && this.deck[row - 1][column] === 0)
        this.moveUp(number, row, column);
      else if (column < this.size - 1 && this.deck[row][column + 1] === 0)
        this.moveRight(number, row, column);
      else if (row < this.size - 1 && this.deck[row + 1][column] === 0)
        this.moveDown(number, row, column);
      else if (column > 0 && this.deck[row][column - 1] === 0)
        this.moveLeft(number, row, column);
      
      this.checkVictory();
    },
    checkVictory()
    {
      var victory = true;
      for (let i = 0; i < this.size; i++)
        for (let j = 0; j < this.size; j++)
          if(this.deck[i][j] !== i * 4 + j + 1 && i + j + 2 !== this.size * 2)
            victory = false;
      
      this.$set(this, 'victory', victory);     
    },
    resetDeck()
    {
      this.prepareShuffledDeck();
    },
    findHolePosition()
    {
      const position = {};
      for (let i = 0; i < this.size; i++)
        for (let j = 0; j < this.size; j++)
          if (this.deck[i][j] === 0)
          {
            position['row'] = i;
            position['column'] = j;
          }
          
      return position;
    },
    processKeyup(e)
    {
      const holePosition = this.findHolePosition();
      const i = holePosition.row;
      const j = holePosition.column;
      
      if (e.keyCode === 82) // 'r' key
        this.resetDeck();
      else if (e.keyCode === 37 && j < this.size - 1) // 'left' key
        this.moveLeft(this.deck[i][j + 1], i, j + 1);
      else if (e.keyCode === 38 && i < this.size - 1) // 'up' key
        this.moveUp(this.deck[i + 1][j], i + 1, j);
      else if (e.keyCode === 39 && j > 0) // 'right' key
        this.moveRight(this.deck[i][j - 1], i, j - 1);
      else if (e.keyCode === 40 && i > 0) // 'down' key
        this.moveDown(this.deck[i - 1][j], i - 1, j);
    },
  },
  mounted()
  {
    this.$set(this, 'volume', this.size * this.size);
    this.prepareShuffledDeck();
    window.addEventListener('keyup', this.processKeyup);
  },
  beforeDestroy()
  {
    window.removeEventListener('keyup', this.processKeyup);
  },
}
</script>