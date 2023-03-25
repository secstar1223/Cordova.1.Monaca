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
          <span>JOBchats</span>
          <f7-button href="/jobchatdetail-all/" fill >All Messages</f7-button>
        </f7-card-header>
        <f7-list media-list >
          <f7-list-item :link="`/jobchatMgs/${item.id}/`"  v-for="(item, index) in joballdata" :title="`${item.object}`"   :footer="`${item.title}`" :badge="`${item.msg_num}`" :badge-color ="`${item.color}`" :key="index" >
          </f7-list-item> 
          <!--:header="`${item.employee_name}`"-->
        </f7-list>
      </f7-card>
      <!-- JOBWall -->
      <f7-card>
        <f7-card-header>
          <span>JOBwall</span>
          <f7-button href="/jobwall-all/" fill >All Categories</f7-button>
        </f7-card-header>
        <f7-list media-list>
          <f7-list-item :link="`/jobattachwall/${item.id}/`" v-for="(item, index) in jobwalldata" :title="`${item.name}`" :badge="`${item.attach_num }`" :class="`${item.attach_num ? '' : 'hideCategory' }`" :badge-color ="`${item.color}`" :key="index">
          </f7-list-item>
          <!-- <f7-list-item v-if="(item.attach_num==0)">
          </f7-list-item> -->

          <!-- :header="`${item.employee_name}`"-->
        </f7-list>
      </f7-card>
      <!-- JOBdrawer --> 
      <f7-card>
        <f7-card-header>
          <span>JOBdrawer</span>
          <f7-button href="/jobdrawer-all/" fill >All Categories</f7-button>
        </f7-card-header>
        <f7-list media-list>
          <f7-list-item :link="`/jobattachdrawer/${item.id}/`"  v-for="(item, index) in jobdrawerdata" :title="`${item.name}`" :badge="`${item.attach_num}`" :class="`${item.attach_num ? '' : 'hideCategory' }`" :badge-color ="`${item.color}`" :key="index">
          </f7-list-item>
          <!-- :header="`${item.employee_name}`"-->
        </f7-list>
      </f7-card>
  </f7-page>
</template>
<script>
  import { f7 } from 'framework7-vue';
  import pageheader from '@/components/header.vue';

  import { initializeApp } from "firebase/app";
  import { getMessaging,getToken } from "firebase/messaging";

  import store from '../js/store';
  export default {
    components:{ pageheader },
    data(){
      return{
        login:false,
        offline:true,
        message:'',
        joballdata:self.joballdata,
        jobwalldata:self.jobwalldata,
        jobdrawerdata:self.jobdrawerdata,
        perm:{},
        current_fcm_tocken:'',
      }
    },
    mounted(){
      var self = this;
      self.offline = store.state.offline;
      f7.dialog.progress('Loading...');
      f7.request.post(
        store.state.api_url + store.state.webapi.dashboard,
        {
          'category_id':store.state.category_id,
          'employee_id':store.state.employee_id,
        },
        function(data, status, options){
          var resdata = JSON.parse(data);
          if(resdata.is_success){
            self.joballdata = resdata.data.joballdata;
            self.jobwalldata = resdata.data.jobwalldata;
            self.jobdrawerdata = resdata.data.jobdrawerdata;
            console.log('store.state.dashboard->', store.state.reloadpage);
            console.log('phone->',store.state.phone);
            if(store.state.reloadpage !=""){
              f7.views.main.router.back(store.state.reloadpage, {force: true});
            }
            if(self.joballdata==""){
              f7.views.main.router.back('/newjobchat/', {force: true});
            } 
            
            store.state.joballdata = resdata.data.joballdata;
            store.state.jobwalldata = resdata.data.jobwalldata;
            store.state.jobdrawerdata = resdata.data.jobdrawerdata;
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

        //   const firebaseConfig = {
        //     apiKey: "AIzaSyAyumrd_rAWREUGFm5HNPzba9iJrngMsxU",
        //     authDomain: "push-notification-9754e.firebaseapp.com",
        //     projectId: "push-notification-9754e",
        //     storageBucket: "push-notification-9754e.appspot.com",
        //     messagingSenderId: "641476812585",
        //     appId: "1:641476812585:web:6344a105d9299af7e22138",
        //     measurementId: "G-670QKJED8P"
        //   };
          
        //   // Initialize Firebase
        //   const firebaseapp = initializeApp(firebaseConfig);


        // // Initialize Firebase Cloud Messaging and get a reference to the service
        // const messaging = getMessaging(firebaseapp);

        // getToken(messaging, { vapidKey: 'BPfx3UOlN3C4w4xq-NiD6HIxVX23KuT4dQ6KnJ5igml-eUdEo14OV81zKXc4AfwRLUhreDJJFtaOQOgk5o_eKmM' }).then((currentToken) => {
        //     if (currentToken) {
        //       // Send the token to your server and update the UI if necessary
        //       // ...
        //       store.state.current_fcm_tocken = currentToken;
        //       self.current_fcm_tocken = currentToken;
        //       console.log('get token',store.state.current_fcm_tocken);
        //     } else {
        //       // Show permission request UI
        //       console.log('No registration token available. Request permission to generate one.');
        //       // ...
        //     }
        //   }).catch((err) => {
        //     console.log('An error occurred while retrieving token. ', err);
        //     // ...
        //   });
    },
    methods: {
      allowpush() {
      f7.dialog.progress('Loading...');
          f7.request.post(
          store.state.api_url+store.state.webapi.save_token,
          {
            'employee_id':store.state.employee_id,
            'token': store.state.current_fcm_tocken,
          },
          function(data, status, options){
            var resdata = JSON.parse(data);
            if(resdata.is_success){
            //   console.log('status',resdata.message);
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
          // function(data){
          //   console.log('Email Error',data);
          //   var data = { "response":"{ \"message\" : \"An unknown error is preventing registration. Please try again! If this continues please contact customer support at whatsjob.support.com\" }" };
          //   self.messages(data,'Login Error');
          //   f7.dialog.close();
          // },
          // 'json'
        );
      },
    },
    beforeout(){
    //   console.log('Close the damb')
    }
  };
</script>