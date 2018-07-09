<template>
  <div class="com-plan-welcome">
    <div class="wallpaper" :style="background">
      <canvas id="bg"></canvas>
      <div class="date">
        <p>{{month}}月</p>
        <p>{{today}}</p>
      </div>

      <div class="note">悲观的人往往正确，乐观的人往往成功。 --卢俊</div>

      <div class="wallpaper-info">
        <img src="../../logo.svg"/>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { Checkbox } from 'w-ui/lib/checkbox'
import store from '../../store'

export default {
  name: 'plan-welcome',
  components: {
    Checkbox
  },
  data() {
    return {
      showInput: false,
      background: '',
      today: moment().format('D'),
      month: moment().format('M')
    }
  },
  methods: {
    add() {
      this.showInput = true
    }
  },
  mounted() {
    this.$nextTick(() => {
      // store.request('http://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&nc=1519890908439&pid=hp').then(res => {
      //   if(res.result.images && res.result.images.length > 0){
      //     this.background = {
      //       backgroundImage: 'url(https://www.bing.com' + res.result.images[0].url + ')'
      //     }
      //     this.info = res.result.images[0].copyright
      //   }
      // })

      let me = this

      let livePatern = {
        canvas: null,
        context: null,
        cols: 0,
        rows: 0,
        colors: [252, 251, 249, 238, 231, 230],
        triangleColors: [],
        destColors: [],

        init: function() {
          this.canvas = document.getElementById('bg')
          this.context = this.canvas.getContext('2d')
          this.cols = Math.floor(me.$el.clientWidth / 24)
          this.rows = Math.floor(me.$el.clientHeight / 24) + 1

          this.canvas.width = me.$el.clientWidth
          this.canvas.height = me.$el.clientHeight

          this.drawBackground()
          this.animate()
        },

        drawTriangle: function(x, y, color, inverted) {
          inverted = inverted == undefined ? false : inverted

          this.context.beginPath()
          this.context.moveTo(x, y)
          this.context.lineTo(inverted ? x - 22 : x + 22, y + 11)
          this.context.lineTo(x, y + 22)
          this.context.fillStyle =
            'rgb(' + color + ',' + color + ',' + color + ')'
          this.context.fill()
          this.context.closePath()
        },

        getColor: function() {
          return this.colors[Math.floor(Math.random() * 6)]
        },

        drawBackground: function() {
          var eq = null
          var x = this.cols
          var destY = 0
          var color, y

          while (x--) {
            eq = x % 2
            y = this.rows

            while (y--) {
              destY = Math.round((y - 0.5) * 24)

              this.drawTriangle(
                x * 24 + 2,
                eq == 1 ? destY : y * 24,
                this.getColor()
              )
              this.drawTriangle(
                x * 24,
                eq == 1 ? destY : y * 24,
                this.getColor(),
                true
              )
            }
          }
        },

        animate: function() {
          var me = this

          var x = Math.floor(Math.random() * this.cols)
          var y = Math.floor(Math.random() * this.rows)
          var eq = x % 2

          if (eq == 1) {
            me.drawTriangle(
              x * 24,
              Math.round((y - 0.5) * 24),
              this.getColor(),
              true
            )
          } else {
            me.drawTriangle(x * 24 + 2, y * 24, this.getColor())
          }

          setTimeout(function() {
            me.animate.call(me)
          }, 20)
        }
      }

      livePatern.init()
    })
  }
}
</script>

<style lang="less">
.com-plan-welcome {
  position: relative;
  height: 100%;

  .wallpaper {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center center;
    // background-color: #666;

    .date {
      position: absolute;
      left: 50%;
      top: 20px;
      color: #666;
      background: rgba(255, 255, 255, 1);
      border-radius: 4px;
      text-align: center;
      padding: 5px 40px;
      transform: translate(-50%, 0);
      border: 1px #e0e0e0 solid;
      p:first-child {
        font-size: 30px;
        color: dodgerblue;
      }
      p:last-child {
        font-size: 60px;
      }
    }

    .note {
      color: #fff;
      position: absolute;
      width: 80%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 24px;
      color: #888;
    }

    .wallpaper-info {
      background: rgba(255, 255, 255, 1);
      position: absolute;
      left: 50%;
      bottom: 20px;
      transform: translate(-50%, 0);
      border-radius: 4px;
      padding: 5px 5px 0 5px;
      border: 1px #e0e0e0 solid;
      img {
        width: 32px;
        height: 32px;
      }
    }
  }
}
</style>