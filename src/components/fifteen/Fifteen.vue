<template>
    <div id="deck">
      <div v-for="(chip, number) in chips"
          v-if="number !== 0" class="chip"
          :style="'top: ' + (chip.row * 110 + 10) + 'px; left: ' + (chip.column * 110 + 10) + 'px;'"
          @click="tryToMove(number, chip.row, chip.column)">
        <p class="chip-number">{{ number }}</p>
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
    tryToMove(number, row, column)
    {
      if (row > 0 && this.deck[row - 1][column] === 0)
      {
        this.deck[row - 1][column] = number;
        this.deck[row][column] = 0;
        this.$set(this.chips[number], 'row', row - 1);
        
      } else if (column < this.size - 1 && this.deck[row][column + 1] === 0)
      {
        this.deck[row][column + 1] = number;
        this.deck[row][column] = 0;
        this.$set(this.chips[number], 'column', column + 1);
        
      } else if (row < this.size - 1 && this.deck[row + 1][column] === 0)
      {
        this.deck[row + 1][column] = number;
        this.deck[row][column] = 0;
        this.$set(this.chips[number], 'row', row + 1);
        
      } else if (column > 0 && this.deck[row][column - 1] === 0)
      {
        this.deck[row][column - 1] = number;
        this.deck[row][column] = 0;
        this.$set(this.chips[number], 'column', column - 1);
      }
    },
  },
  mounted()
  {
    this.$set(this, 'volume', this.size * this.size);
    this.prepareShuffledDeck();
  },
}
</script>