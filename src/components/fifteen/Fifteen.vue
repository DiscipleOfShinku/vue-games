<template>
    <div>
      <transition-group name="chip-pool" tag="div"
          class="game-area__primary  deck">
        <div v-for="(chip, number) in chips"
            v-if="number !== 0" class="btn  deck__chip"
            v-bind:key="number"
            :style="'top: ' + (chip.row * 110 + 10) + 'px; left: ' + (chip.column * 110 + 10) + 'px;'"
            @click="tryToMove(number, chip.row, chip.column)">
          <p class="center  deck__chip-number">{{ number }}</p>
        </div>
      </transition-group>
      <div class="hands-area">
        <div class="hands-area__element  btn  hands-area__reset"
            @click="resetDeck">
          <p class="center">RESET</p>
        </div>
        <div v-if="victory" class="hands-area__element  hands-area__victory">
          <p class="center">VICTORY!</p>
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
      
      if (e.key === 'r')
        this.resetDeck();
      else if (e.key === 'ArrowLeft' && j < this.size - 1)
        this.moveLeft(this.deck[i][j + 1], i, j + 1);
      else if (e.key === 'ArrowUp' && i < this.size - 1)
        this.moveUp(this.deck[i + 1][j], i + 1, j);
      else if (e.key === 'ArrowRight' && j > 0)
        this.moveRight(this.deck[i][j - 1], i, j - 1);
      else if (e.key === 'ArrowDown' && i > 0)
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