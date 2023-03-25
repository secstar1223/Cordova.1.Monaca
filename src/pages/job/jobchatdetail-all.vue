<template>
  <f7-page name="dashboard">
    <f7-navbar>
    <f7-nav-left>
      <f7-link icon="icon-bars" href="/leftsidebar/" data-ignore-cache="true"><f7-icon ios="f7:menu" md="material:menu" aurora="f7:menu"></f7-icon></f7-link>
    </f7-nav-left>
    <f7-nav-right>
      <f7-link icon="icon-bars" href="/connect/" data-ignore-cache="true" v-if="offline"><f7-icon ios="f7:globe" md="material:public" aurora="f7:globe"></f7-icon></f7-link>
      </f7-nav-right>
  </f7-navbar>
    <!-- JOBChats -->
    <f7-card>
        <f7-card-header>
          <span>JOBchat</span>
          <f7-button href="/newjobchat/" fill >New Message</f7-button>
        </f7-card-header>
        <f7-list media-list hide-bars-on-scroll>
          <f7-list-item :link="`/jobchatMgs/${item.id}/`"  v-for="(item, index) in joballdata" :title="`${item.object}`" :badge="`${item.msg_num}`" :badge-color ="`${item.color}`" :key="index">
          </f7-list-item>
         <!-- :header="`${item.employee_name}`"-->
        </f7-list>
      </f7-card>
  </f7-page>
</template>
<script>
  import { f7 } from 'framework7-vue';
  import pageheader from '@/components/header.vue';
  import store from '../../js/store';
  export default {
    components:{ pageheader },
    data(){
      return{
        login:false,
        message:'',
        jobs:{},
        perm:{},
        joballdata:[],
      }
    },
    updated(){
      console.log('updated');
    },
    mounted(){
      var self = this;
      
      f7.dialog.progress('Loading...');
      f7.request.post(
        store.state.api_url + store.state.webapi.joballchat,
        {
          'employee_id':store.state.employee_id,
        },
        function(data, status, options){
          var resdata = JSON.parse(data);
          if(resdata.is_success){
            store.state.joballdata = resdata.data.joballdata;
            self.joballdata = resdata.data.joballdata;
            console.log(store.state.joballdata);
            f7.dialog.close();
          }else{
              // CREATE ERROR HANDLER
              f7.dialog.close();
              f7.dialog.create({ 
                text: resdata.message, 
                title: 'Error', 
                buttons: [ 
                  { text: 'Cancel' },
                ],
              }).open();
          }
        },
      );
    },
    methods: {
      
    },
  };
</script>