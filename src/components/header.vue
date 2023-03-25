<template>
  <f7-navbar>
    <f7-nav-left>
      <f7-link icon="icon-bars" href="/leftsidebar/" data-ignore-cache="true"><f7-icon ios="f7:menu" md="material:menu" aurora="f7:menu"></f7-icon></f7-link>
    </f7-nav-left>
    <f7-nav-right>
      <f7-link icon="icon-bars" href="/connect/" data-ignore-cache="true" v-if="offline"><f7-icon ios="f7:globe" md="material:public" aurora="f7:globe"></f7-icon></f7-link>
      </f7-nav-right>
  </f7-navbar>
</template>
<script>
  import { f7 } from 'framework7-vue';
  import store from '../js/store';
  export default {
    name: "pageheader",
    props: {
      f7router: Object,
      //title: { type: String, required: false, default: '' }
    },
    data() {
      return {
        offline:true,
      };
    },
    mounted(){ 
/*

      this.$f7ready((f7) => {
        this.$on('close-sidebar', function(data) {
        console.log('TESTING SHIT')
      })
*/
      
      var self = this;
      self.offline = store.state.offline;

    },
    methods: {
    },
  };
</script>