<template>
  <div>
   <v-toolbar dark id="toolbar">
    <v-btn @click="$router.go(-1)" icon>
      <v-icon>arrow_back</v-icon>
    </v-btn>
    <v-spacer></v-spacer>
    <v-toolbar-title class="white--text"><v-btn flat href="/simple-deep">Modoo</v-btn></v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
  </v-toolbar>

  <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
    >
      <v-list class="pa-1">
        <v-list-tile avatar>
          <v-list-tile-avatar>
            <img src="https://randomuser.me/api/portraits/men/85.jpg">
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title>{{userData.userName}}님 안녕하세요!</v-list-tile-title>
            <!-- <v-list-tile-title>{{userData.userName}}님 안녕하세요!</v-list-tile-title> -->
          </v-list-tile-content>
        </v-list-tile>
      </v-list>

      <v-list class="pt-0" dense>
        <v-divider></v-divider>

        <v-list-tile
          v-for="item in items"
          :key="item.title"
          @click="goNav(item.address)"
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

      </v-list>
    </v-navigation-drawer>
  </div>
</template>
<script>

export default {
  name: 'Toolbar',
  components:{
   
  },
  data:function(){
    return {
        drawer: null,
        items: [
          { title: 'Simple', icon: 'chat_bubble_outline', address: 'simple'},
          { title: 'Deep', icon: 'chat_bubble' ,address:'deep'},
          { title: '내가 쓴 글/댓글' ,icon:'create', address:'me-tab'},
          { title: '내 정보 관리', icon:'person_pin', address:'my'},
          // { title: '설정', icon:'settings', address:''},
          { title: '로그아웃' , icon:'keyboard_tab', address: 'logout'}
        ],
        userData : null,
        jwt : null
      }
  },
  methods:{
    goNav: function(address){
      if(address === 'logout'){
        this.logout()
      }else{
      this.$router.push(`/${address}`)
      }
    },
    logout:function(){
      this.$session.destroy() 
      this.$router.push('/')
    }
  },
  created:function(){
    this.jwt= this.$session.get('jwt')
    this.userData = this.$session.get('userData')
    console.log(this.userData)
  } ,
}
</script>
<style>
  #toolbar{
    background-color : #10272F;
  }

</style>
