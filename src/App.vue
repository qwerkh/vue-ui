<!-- this is the main layout of the app
  so every components of the app must render through this
 -->

Read more: https://html.com/tags/comment-tag/#ixzz5fNQlKpL1
<template>
  <div>
    <div v-if="isLoading">
      <div
              style="width: 250px;height: 250px;"
              class="centered"
              align="center"
              element-loading-text="សូមមេត្តារង់ចាំ..."
              v-loading="isLoading"
      ></div>
    </div>
    <div v-else>
      <el-container class="flex">
        <el-aside div class="sidebar" style="width: 63px;" v-show="isShowingAppBar">
          <div class="flex home center" v-show="isSuper">
            <router-link :to="addStore">
              <img src="../src/assets/appbar/icons8-plus.svg" alt>
            </router-link>
          </div>
          <ul class="flex vertical side-menu">
            <li :class="setActive(s)" v-for="s in sidebarProps" :key="s.id">
              <a @click="handleClickProp(s)">
                {{s.shortcutName}}
              </a>
            </li>
          </ul>
        </el-aside>
        <el-container>
          <el-header class="appbar flex between middle" v-show="isShowingAppBar">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/' }" v-if="!isRootPath">Home</el-breadcrumb-item>
              <el-breadcrumb-item>{{showingRouterMetaName}}</el-breadcrumb-item>
            </el-breadcrumb>
            <div class="searchbox flex middle">
              <img src="../src/assets/appbar/icons8-search.svg" alt>
              <input type="text" placeholder="Type in to search">
            </div>
            <div class="appdraw">

              <el-dropdown @click="handleClickDropdown">
                <a href="#">
                  <img src="../src/assets/appbar/icons8-keypad.svg" alt>
                </a>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="(d,index) in dropdownMenu" :key="index" v-if="d.isShowing(roles)" >
                    <router-link :to="d.path" style="text-decoration: none;color: black;">{{d.enName}}</router-link>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div class="nav-right">
              <slot v-if="!isSignedIn">
                <!-- if user not signed in do here -->
                <router-link to="/login">Login</router-link>
              </slot>
              <slot v-else>
                <!-- if user signed in do here -->
                <el-dropdown trigger="click" class="flex middle user-profile">
                  <div class="img-profile flex middle">
                    <img src="../src/assets/profile.png" alt class="circle">
                  </div>
                  <span class="el-dropdown-link">
                    <i class="el-icon-caret-bottom"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                      <span @click="handleLogout">ចាកចេញ</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </slot>
            </div>
          </el-header>
          <el-main>
            <!-- Every components, views which use router will render its layout here  -->
            <router-view></router-view>
          </el-main>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script>
  import {provider} from "./service/provider";

  export default {
    data() {
      return {
        isLoading: true,
        addStore: "/stores/add",
        roles: [],
      };
    },
    watch: {
      '$store.state.user.user'(val) {
        if (!!val) {
          this.roles = val.roles;
        }
      }
    },
    methods: {
      handleClickProp(store) {
        this.$store.commit('setActiveStore', store);
        this.$router.push("/");

      },
      handleLogout() {
        this.isLoading = true;
        this.$store.commit("unSetUser");
        setTimeout(() => {
          this.isLoading = false;
          this.$router.push("/");
        }, 500);
      },
      handleClickDropdown() {
      },
      // getImgUrl(picUrl,type) {
      //   return require('@/assets/' +  picUrl)
      // },
      setActive(item) {
        return item._id === this.$store.state.user.activeStore ? "flex center active" : "flex center";
      }
    },
    computed: {
      isShowingAppBar() {
        const {enName} = this.$route.meta;
        if ((enName && enName == "Sale") || this.$store.state.user.user == null) {
          return false;
        }
        return this.$store.state.user.user != null && this.$store.state.user.user.profile.approved;
      },
      isSignedIn() {
        return this.$store.state.user.user != null;
      },
      sidebarProps() {
        return this.$store.state.user.stores;
      },
      userStores() {
        return this.$store.state.user != null ? this.$store.user.stores : [];
      },
      showingRouterMetaName() {
        const {khName,enName} = this.$route.meta;
        return enName || "";
      },
      isRootPath() {
        return this.$route.fullPath === '/';
      },
      dropdownMenu() {
        return this.$store.state.dropdownMenu;
      },
      isSuper(){
        if(this.$store.state.user.user == null) return false;
        return provider.isSuper(this.$store.state.user.user.roles);
      }
    },
    mounted() {
      setTimeout(() => {
        this.isLoading = false;
      }, 500);
    }
  };
</script>
<style lang="scss">
// @import "../src/assets/homepage/css/custom.css";
// // @import "../assets/homepage/css/custom.css";
// @import "../src/assets/homepage/css/main.css";
// @import "../src/assets/homepage/css/fullsreen-showcase.css";
// @import "../src/assets/homepage/css/responsive-fullsreen.css";
body {
  margin: 0px;
  background: #f3f9f9;
}
.centered {
  position: fixed; /* or absolute */
  top: 50%;
  left: 50%;
  margin-left: -125px;
  margin-top: -125px;
}
.sidebar {
  width: 63px;
  height: 100vh;
  background: #ffffff;
  .home {
    &:hover {
      background: rgb(191, 183, 238);
      border-left: 3px solid rgb(133, 114, 235);
    }
    a {
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-pack: center;
      -webkit-justify-content: center;
      -ms-flex-pack: center;
      justify-content: center;
      padding: 20px 0px;
      width: 100%;
      img {
        width: 26px;
        height: 26px;
      }
    }
  }
  .side-menu {
    padding: 0;
    margin: 0;
    li {
      list-style: none;
      &:hover {
        background: rgb(221, 217, 252);
        border-left: 3px solid rgb(133, 114, 235);
      }
      a {
        text-decoration: none;
        padding: 12px 0px;
        width: 100%;
        height: auto;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: center;
        -webkit-justify-content: center;
        -ms-flex-pack: center;
        justify-content: center;
        img {
          width: 26px;
          height: 26px;
        }
      }
    }
  }
}
.appbar {
  height: 65px;
  background: #ffffff;
  width: 100%;
  .searchbox {
    margin-left: 20px;
    img {
      width: 22px;
      height: 22px;
    }
    input {
      padding-left: 10px;
      font-size: 15px;
      border: 0px none;
      height: 40px;
      outline: none;
      color: #9fabab;
    }
    ::placeholder {
      color: rgb(180, 180, 180);
    }
  }
  .appdraw {
    margin-right: 20px;
    a {
      img {
        width: 22px;
        height: 22px;
      }
    }
  }
  .nav-right {
    margin-right: 20px;
    .img-profile {
      img {
        height: 35px;
        width: 35px;
        border-radius: 100px;
        margin-right: 4px;
      }
    }
  }
}
</style>
