<template>
  <div class="app">
    <div class="body">
      <div class="menu-area">
        <img src="./logo.svg" @click="doShowAbout" />
        <ul class="menu">
          <li>
            <a href="#/plan">
              <IconText text="计划" color="#2a72c0"></IconText>
            </a>
          </li>
          <li>
            <a href="#/noteDesk">
              <IconText text="笔记" color="rgb(211, 93, 62)"></IconText>
            </a>
          </li>
        </ul>
      </div>
      <div class="content-area">
        <router-view></router-view>
      </div>

      <div class="about-panel" v-if="showAbout">
        <div class="mask" @click="doHideAbout"></div>
        <div class="about-dialog">
          <p class="logo">
            <img src="./logo.png" />
          </p>
          <p class="version">{{ version }}</p>
          <p class="desc">
            Mark是一个完全免费的开源软件，致力于做好用的效率提升工具
            <br />
            <br />
            <br />
          </p>

          <div class="link">
            <div>
              <a target="_blank" @click="jump('https://github.com/lin-xi/mark/issues')">意见建议</a>
            </div>
            <div>
              <a target="_blank" @click="jump('https://github.com/lin-xi/mark')">点赞</a>
            </div>
          </div>
        </div>
      </div>
      <div class="setting-panel"></div>
    </div>
  </div>
</template>

<script>
import './assets/fonts/icomoon.eot'
import './assets/fonts/icomoon.ttf'
import './assets/fonts/icomoon.woff'
import './assets/fonts/icomoon.svg'

import './assets/style.css'
import package from '../package.json'
import IconText from './components/IconText.vue'
const { ipcRenderer, shell } = window.require('electron')

export default {
  name: 'app',
  components: {
    IconText
  },
  data() {
    return {
      showAbout: false,
      version: package.version
    }
  },
  methods: {
    doHideAbout() {
      this.showAbout = false
    },
    doShowAbout() {
      this.showAbout = true
    },
    jump(url) {
      shell.openExternal(url)
    },
    showLogin() {

    }
  },
  mounted() {
    /* 设计图文档宽度 */
    var docWidth = 750

    var doc = window.document,
      docEl = doc.documentElement,
      resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'

    var recalc = (function refreshRem() {
      var clientWidth = docEl.getBoundingClientRect().width

      /* 8.55：小于320px不再缩小，11.2：大于420px不再放大 */
      docEl.style.fontSize =
        Math.max(Math.min(20 * (clientWidth / docWidth), 12), 8.55) * 3 + 'px'

      return refreshRem
    })()

    /* 添加倍屏标识，安卓为1 */
    docEl.setAttribute(
      'data-dpr',
      window.navigator.appVersion.match(/iphone/gi)
        ? window.devicePixelRatio
        : 1
    )

    if (/iP(hone|od|ad)/.test(window.navigator.userAgent)) {
      /* 添加IOS标识 */
      doc.documentElement.classList.add('ios')
      /* IOS8以上给html添加hairline样式，以便特殊处理 */
      if (
        parseInt(
          window.navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/)[1],
          10
        ) >= 8
      )
        doc.documentElement.classList.add('hairline')
    }

    if (!doc.addEventListener) return
    window.addEventListener(resizeEvt, recalc, false)
    doc.addEventListener('DOMContentLoaded', recalc, false)

    ipcRenderer.on('menu-command', (event, command) => {
      switch (command) {
        case 'setting':
          break
        case 'about':
          this.showAbout = true
          break
        case 'togglelist':
          eventHub.$emit('togglelist')
          break
      }
    })
  }
}
</script>

<style lang="less">
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
html,
body {
  width: 100%;
  height: 100%;
  background-color: #fff;
  font-family: arial, -apple-system, BlinkMacSystemFont, 'Microsoft YaHei',
    sans-serif;
}

a {
  text-decoration: none;
}

.app {
  font-size: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
  color: #333;
  font-size: 16px;

  .header {
    position: relative;
    flex: 0 0 40px;
    background-color: rgb(90, 196, 97);

    input {
      position: absolute;
      right: 10px;
      bottom: 5px;
      border: 1px #e0e0e0 solid;
      height: 26px;
      width: 120px;
      border-radius: 15px;
      outline: none;
      font-size: 14px;
      text-align: center;
    }
  }

  .body {
    flex: 1;
    width: 100%;
    display: flex;
    .menu-area {
      flex: 0 0 90px;
      position: relative;
      background: rgb(60, 66, 82);
      border-right: 1px rgb(229, 229, 229) solid;
      text-align: center;

      user-select: none;
      -webkit-app-region: drag;

      img {
        width: 60px;
        height: 60px;
        margin-top: 40px;
        cursor: pointer;
      }
      .menu {
        padding-top: 10px;
        li {
          padding: 10px;
          cursor: pointer;
        }
        li:hover {
          background: #555;
        }
        a {
          color: #eee;
        }
      }
    }
    .content-area {
      flex: 1;
      position: relative;
    }

    .about-panel {
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 999;

      .mask {
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.1);
      }

      .about-dialog {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 560px;
        height: 360px;
        box-shadow: 0 0 20px #ccc;
        background: #fff;
        color: #999;
        font-size: 16px;
        .logo {
          padding: 20px 0 0 0;
          text-align: center;
          img {
            width: 80px;
          }
        }
        .version {
          text-align: center;
          padding-bottom: 5px;
        }
        .desc {
          padding: 0 50px 10px 50px;
        }
        .link {
          display: flex;
          padding: 20px 50px;
          div {
            border: 1px #fff solid;
            flex: 1;
            padding: 20px;
            text-align: center;
            background-color: #f5f5f5;
            border-radius: 6px;
            color: dodgerblue;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
