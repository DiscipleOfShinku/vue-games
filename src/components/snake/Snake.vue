<template>
    <div>
      <transition-group name="snake-area" tag="div"
          class="game-area__primary  snake-area">
        <div v-for="(row, x) in field"
            v-bind:key="x">
          <div v-for="(tile, y) in row"
              class="snake-area__tile"
              v-bind:class="'snake-area__' + [tile.content]"
              :style="'left: ' + (x * 10) + 'px; top: ' + (y * 10) + 'px;'" >
          </div>
        </div>
        <div v-for="(part, index) in snake"
            class="snake-area__snake-part"
            v-bind:key="index"
            :style="'left: ' + (part.x * 10) + 'px; top: ' + (part.y * 10) + 'px;'" >
        </div>
      </transition-group>
      <div class="hands-area">
        <div class="hands-area__element  btn  hands-area__reset"
            @click="resetGame">
          <p class="center">RESET</p>
        </div>
        <div v-if="isAlive" class="hands-area__element  hands-area__victory">
          <p class="center">Eat apples!</p>
        </div>
        <div v-else class="hands-area__element  hands-area__defeat">
          <p class="center">AWWWWW!</p>
        </div>
      </div>
    </div>
</template>

<script>
export default
{
  name: 'snake',
  data()
  {
    return {
      fieldWidth: 45,
      fieldHeight: 25,
      field: [],
      snakeInitialLength: 3,
      snake: [],
      apple: null,
      turnTime: 250, // in ms
      direction: 'right',
      plannedDirection: 'right',
      isAlive: true,
      intervalID: null,
    }
  },
  methods:
  {
    initField()
    {
      const arr = [];
      for (let i = 0; i < this.fieldWidth; i++)
      {
        arr[i] = [];
        for (let j = 0; j < this.fieldHeight; j++)
        {
        if (     i === 0 || i === this.fieldWidth - 1
              || j === 0 || j === this.fieldHeight - 1)
            arr[i][j] = { 'content': 'wall' };
          else
            arr[i][j] = { 'content': 'grass' };
        }
      }
      this.$set(this, 'field', arr);
    },
    initSnake()
    {
      const arr = [];
      for (let i = 0; i < this.snakeInitialLength; i++)
      {
        arr[i] = { 'x': -1, 'y': -1 };
      }
      this.$set(this, 'snake', arr);
    },
    putSnakeOnField()
    {
      const headX = Math.ceil(this.fieldWidth / 2);
      const headY = Math.ceil(this.fieldHeight / 2);
      for (let i = 0; i < this.snakeInitialLength; i++)
      {
        this.$set(this.snake[i], 'x', headX - i); 
        this.$set(this.snake[i], 'y', headY); 
        this.$set(this.field[headX - i][headY], 'content', 'snake');
      }
    },
    resetGame()
    {
      if (this.intervalID)
        this.stopGame();
      
      this.initField();
      this.$set(this, 'apple', null);
      this.initSnake();
      this.putSnakeOnField();
      this.$set(this, 'isAlive', true);
      this.$set(this, 'direction', 'right');
      this.$set(this, 'plannedDirection', 'right');
      
      var intervalID = window.setInterval(this.gameTick, this.turnTime);
      this.$set(this, 'intervalID', intervalID);
    },
    stopGame()
    {
      window.clearInterval(this.intervalID);
      this.$set(this, 'intervalID', null);
    },
    initGame()
    {
      this.resetGame();
    },
    gameTick()
    {
      this.checkApple();
      this.tryToMoveSnake();
    },
    checkApple()
    {
      if (this.apple === null)
        this.putApple();
    },
    putApple()
    {
      let x = 1 + Math.floor(Math.random() * (this.fieldWidth - 1));
      let y = 1 + Math.floor(Math.random() * (this.fieldHeight - 1));
      if (this.field[x][y].content !== 'grass')
        this.putApple();
      else
      {
        this.$set(this.field[x][y], 'content', 'apple');
        this.$set(this, 'apple', { 'x': x, 'y': y });
      }
    },
    tryToMoveSnake()
    {
      this.$set(this, 'direction', this.plannedDirection);
      var targetX = this.snake[0].x;
      var targetY = this.snake[0].y;
      switch (this.direction)
      {
        case 'up':
          targetY--;
          break;
        case 'right':
          targetX++;
          break;
        case 'down':
          targetY++;
          break;
        case 'left':
          targetX--;
          break;
        default:
          throw new Error('Wrong direction value');
      }
      if (   this.field[targetX][targetY].content === 'wall'
          || this.field[targetX][targetY].content === 'snake')
      {
        this.stopGame();
        this.$set(this, 'isAlive', false);
        
      } else if (this.field[targetX][targetY].content === 'apple')
      {
        this.eatApple(targetX, targetY);
        this.moveSnake(targetX, targetY, true);
      
      } else
        this.moveSnake(targetX, targetY);
    },
    eatApple(x, y)
    {
      this.$set(this.field[x][y], 'content', 'grass');
      this.$set(this, 'apple', null);
    },
    moveSnake(targetX, targetY, growing = false)
    {
      var nextX = targetX;
      var nextY = targetY;
      for (let i = 0; i < this.snake.length; i++)
      {
        var currentX = this.snake[i].x;
        var currentY = this.snake[i].y;
        this.$set(this.field[nextX][nextY], 'content', 'snake');
        this.$set(this.field[currentX][currentY], 'content', 'grass');
        this.$set(this.snake[i], 'x', nextX);
        this.$set(this.snake[i], 'y', nextY);
        nextX = currentX;
        nextY = currentY;
      }
      if (growing)
      {
        this.$set(this.field[nextX][nextY], 'content', 'snake');
        this.snake.push({ 'x': nextX, 'y': nextY });
      }
    },
    processKeydown(e)
    {
      if (e.key === 'r')
        this.resetGame();
      else if (e.key === 'ArrowLeft' && this.direction !== 'right')
        this.$set(this, 'plannedDirection', 'left');
      else if (e.key === 'ArrowUp' && this.direction !== 'down')
        this.$set(this, 'plannedDirection', 'up');
      else if (e.key === 'ArrowRight' && this.direction !== 'left')
        this.$set(this, 'plannedDirection', 'right');
      else if (e.key === 'ArrowDown' && this.direction !== 'up')
        this.$set(this, 'plannedDirection', 'down');
    },
  },
  mounted()
  {
    this.initGame();
    window.addEventListener('keydown', this.processKeydown);
  },
  beforeDestroy()
  {
    if (this.intervalID)
      this.stopGame();
    window.removeEventListener('keydown', this.processKeydown);
  },
}
</script>