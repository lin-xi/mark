<template>
  <div class="app">
    <div class="body">
      <div class="menu-area">
        <img src="./logo.svg" @click="doShowAbout"/>
        <ul class="menu">
          <li><a href="#/plan"><IconText text="计划" color="#2a72c0"></IconText></a></li>
          <li><a href="#/note"><IconText text="笔记" color="rgb(211, 93, 62)"></IconText></a></li>
        </ul>
      </div>
      <div class="content-area">
        <router-view></router-view>
      </div>

      <div class="about-panel" v-if="showAbout">
        <div class="mask" @click="doHideAbout">
        </div>
        <div class="about-dialog">
          <p class="logo"><img src="./logo.png"/></p>
          <p class="version">1.1.0</p>
          <p class="desc">Mark是一个完全免费的开源软件，致力于做好用的效率提升工具，欢迎你提出宝贵的的意见<br><br>
          如果喜欢，请给我的github项目点赞<br>
          如果觉得很棒，也可以捐赠共勉，谢谢</p>
          <br>
          <div class="link">
            <div>
              <a target="_blank" @click="jump('https://github.com/lin-xi/mark/issues')">意见建议</a>
            </div>
            <div>
              <a target="_blank" @click="jump('https://github.com/lin-xi/mark')">点赞</a>
            </div>
            <div>
              <a target="_blank" @click="jump('https://github.com/lin-xi/mark')">捐赠</a>
            </div>
            <div>
              <a target="_blank" @click="jump('https://github.com/lin-xi')">作者:linxi</a>
            </div>
          </div>
        </div>
      </div>
      <div class="setting-panel">
      </div>
    </div>

  </div>
</template>

<script>
import IconText from "./components/IconText.vue";
const { ipcRenderer, shell } = window.require("electron");

export default {
  name: "app",
  components: {
    IconText
  },
  data() {
    return {
      showAbout: false
    };
  },
  methods: {
    doHideAbout() {
      this.showAbout = false;
    },
    doShowAbout() {
      this.showAbout = true;
    },
    jump(url) {
      shell.openExternal(url);
    }
  },
  mounted() {
    document.documentElement.style.fontSize =
      window.innerWidth * 50 / 750 + "px";

    ipcRenderer.on("menu-command", (event, command) => {
      switch (command) {
        case "setting":
          break;
        case "about":
          this.showAbout = true;
          break;
      }
    });
  }
};
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
  font-family: arial, -apple-system, BlinkMacSystemFont, "Microsoft YaHei",
    sans-serif;
}
ul,
li {
  list-style: none;
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