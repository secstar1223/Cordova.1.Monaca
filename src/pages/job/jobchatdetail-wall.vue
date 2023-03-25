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
        <f7-card-header style="justify-content: center">
          <span>JOBwall</span>
        </f7-card-header>
        <f7-list media-list hide-bars-on-scroll>
          <f7-list-item :link="`/jobattachwall/${item.id}/`"  v-for="(item, index) in jobwalldata" :title="`${item.name}`" :badge="`${item.attach_num}`" :class="`${item.attach_num ? '' : 'hideCategory' }`" :badge-color ="`${item.color}`" :key="index">
          </f7-list-item>
         
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
        jobwalldata:[],
      }
    },
    mounted(){
      var self = this;
      f7.dialog.progress('Loading...');
      f7.request.post(
        store.state.api_url + store.state.webapi.jobwall,
        {
          'employee_id':store.state.employee_id,
        },
        function(data, status, options){
          var resdata = JSON.parse(data);
          if(resdata.is_success){
            store.state.jobwalldata = resdata.data.jobwalldata;
            self.jobwalldata = resdata.data.jobwalldata;
            console.log(store.state.jobwalldata);
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
      initTable(){
        if( ! $.fn.DataTable.isDataTable( '#jobDashbardTable' ) ){
          this.dt= $('#jobDashbardTable').DataTable(this.perm);
        }else{
          this.dt= $('#jobDashbardTable').DataTable().destroy();
          this.dt= $('#jobDashbardTable').DataTable(this.perm);
        }
      },
      hasPerm(type,val){
        try{ return store.state.user.perm[type].includes(val); }catch(x){ return false; }
      },
      
    },
    onjobchat() {

    },
    beforeout(){
      console.log('Close the damb')
    }
  };
</script>