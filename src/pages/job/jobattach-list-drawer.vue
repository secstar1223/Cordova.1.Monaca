<template>
  <f7-page>
    <f7-navbar>
    <f7-nav-left back-link="Back" @click="goback"></f7-nav-left>
    <f7-nav-title>JOBdrawer</f7-nav-title>
    </f7-navbar>
      <f7-card>
          <f7-card-header style="justify-content:center;"><span>{{title}}</span></f7-card-header>
          <f7-row  v-if="(attachment_list==null)">
                <f7-col width="5"></f7-col>
                <f7-col width="90">Attachment does exist!</f7-col>
                <f7-col width="5"></f7-col>
            </f7-row>
          <f7-card-content style="border-top:1px solid gray;" v-for = "(item) in attachment_list" :key="item.id">            
              <f7-row class="date" style="height:20px">
                  <f7-col width="5"></f7-col>
                  <f7-col width="90">{{item.created_at}}</f7-col>
                  <f7-col width="5"></f7-col>
              </f7-row>
              <f7-row>
                  <f7-col width="5"></f7-col>
                  <f7-col width="90">{{item.title}}</f7-col>
                  <f7-col width="5"></f7-col>
              </f7-row>
              <!-- <div style="height: 10px; background: rgb(255,255,255);"></div> -->
              <f7-block class="align-items-stretch" style="margin-top: 10px;margin-bottom: 5px;" v-for = "(subitem) in item.message_attachments_data" :key="item.id">
                  <f7-row>
                    <f7-col width="5" class="demo-col-center-content"></f7-col>
                    <f7-col width="90" >
                        <f7-row v-if="(subitem.admin_sign==1)&&(subitem.employee_sign==0)">
                            <f7-col width="70" class="demo-col-center-content">
                                <label style="color:red;" >{{subitem.name}}</label>
                            </f7-col>
                            <f7-col width="20" style="height: 20px;" class="demo-col-center-content"><f7-button fill color = "red" @click="onverify(subitem.id)" style="height: 25px!important;font-size: 8px;">Verify</f7-button></f7-col>
                            <f7-col width="5" class="demo-col-center-content"></f7-col>
                            <f7-col width="15"><f7-button fill color = "blue" @click="downloadFile(item.url)" style="height: 25px !important;font-size: 8px;">Open</f7-button></f7-col>
                        </f7-row>
                        <f7-row v-if="(subitem.admin_sign==0)||((subitem.admin_sign==1)&&(subitem.employee_sign==1))">
                            <f7-col width="35" ><a @click="downloadFile(subitem.url)"><label>{{subitem.name}}</label></a></f7-col>
                            <f7-col width="50" class="demo-col-center-content"></f7-col>
                            <f7-col width="15"><f7-button fill color = "blue" @click="downloadFile(item.url)" style="height: 25px;font-size: 8px;">Open</f7-button></f7-col>  
                        </f7-row>
                    </f7-col>
                    <f7-col width="5"></f7-col>
                  </f7-row>
                  <f7-row v-if="(subitem.admin_sign==0)||((subitem.admin_sign==1)&&(subitem.employee_sign==1))" style="height:20px">
                      <f7-col width="10" class="demo-col-center-content"></f7-col>
                        <f7-col width = "90" class="demo-col-center-content">signed on {{subitem.updated_at}}</f7-col>
                     <f7-col width="5" class="demo-col-center-content"></f7-col>
                  </f7-row>
              </f7-block>
          </f7-card-content>
      </f7-card>
  </f7-page>
  </template>
  <style>
    .grid-resizable-demo {
      --f7-grid-row-gap: 16px;
    }
    .grid-resizable-demo div[class*="col"] {
      margin-bottom: 0;
    }
    .demo-col-center-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  </style>
  <script>
  import store from '../../js/store';
  import { f7, f7ready, } from 'framework7-vue';
  import $ from 'dom7';
  import pageheader from '@/components/header.vue';
  import axios from 'axios';
  
  export default {
     props: {
        f7route: Object,
        f7router: Object,
      },
    components:{ pageheader },
    data() {
      return {
        title : self.title,
        attachment_list : self.attachment_list,
  
      };
    },
  
    mounted() {
      const self = this;
      store.state.category_id = this.f7route.params.id;
      console.log('catogory id1',store.state.category_id, store.state.employee_id);
  
      f7.dialog.progress('Loading...');
      f7.request.post(
        store.state.api_url+store.state.webapi.attachment_list,
          { 
            'category_id':store.state.category_id,
            'employee_id':store.state.employee_id,
          },
          function(data, status, options){
            var resdata = JSON.parse(data);
            if(resdata.is_success){
              self.title =  resdata.data.name;
              store.state.attachment_list = resdata.data.attachments;
              self.attachment_list = resdata.data.attachments;
              console.log(store.state.attachment_list);

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
    updated(){
      console.log('updated view');
    },
    methods: {
  
      onverify(attachment_id) {
        store.state.msg_attach_id = attachment_id;
        f7.dialog.progress('Sending Code...');
        f7.request.post(
        store.state.api_url+store.state.webapi.send_code_signattachment,
          { 
            'id': attachment_id,
            'employee_id':store.state.employee_id,
          },
          (res) => {
            var resdata = JSON.parse(res);
              if(resdata.is_success){
                console.log(resdata.message);
                f7.dialog.prompt('Please Enter Code', (code) => {
                  f7.dialog.confirm('Are you sure that your Code is ' + code + '?', () => {
                    f7.dialog.progress('Signing Attachments...');
                    f7.request.post(
                      store.state.api_url+store.state.webapi.verify_code_signattachment,
                      { 
                        'id': attachment_id,
                        'user_id':store.state.employee_id,
                        'otp':code,
                      },
                      (res) => {
                        var resdata = JSON.parse(res);
                        if(resdata.is_success){
                          console.log(resdata.message);
                          f7.dialog.close();
                          store.state.reloadpage = '/jobattachdrawer/'+ store.state.category_id +'/';
                          console.log('store.state.reloadpage', store.state.reloadpage);
                          f7.views.main.router.back('/dashboard/', {force: true});
  
                        } else{
                          f7.dialog.close();
                          f7.dialog.create({ 
                            text: resdata.message, 
                            title: 'Verification code', 
                            buttons: [ 
                              { text: 'Ok' },
                            ],
                          }).open();
                          // this.resend(resdata.message,store.state.phone);
                        }
                      }
                    )
                  });
                });
  
                // resolve({redirect: "/jobchatmsg/"});
                f7.dialog.close();
              } else {
                console.log(resdata.message);
                f7.dialog.close();
              }
          },
        );
      },
      resend(message, phone){
        f7.dialog.create({ 
          text: message, 
          title: 'title', 
          buttons: [ 
            { 
              text: 'Send Again', 
              onClick: function(){
                  f7.dialog.progress('Verification sending again...');
                  f7.request.post(
                    store.state.api_url + store.state.webapi.resend_vcode,
                    {
                      'phone'  : phone,
                    },
                    function(data, status, options){
                      var resdata = JSON.parse(data);
                      if(resdata.is_success){
                        f7.dialog.close();
                        f7.dialog.create({ 
                            text: resdata.message, 
                            title: 'Verification code', 
                            buttons: [ 
                              { text: 'Ok' },
                            ],
                          }).open();
                      } 
                    },
                  );
              } 
            },
            { text: 'Cancel' },
          ],
        }).open();
      },
      downloadFile(url) {
          console.log(url);
        
       document.addEventListener("deviceready", onDeviceReady, false);

       function onDeviceReady() {

           var ref = cordova.InAppBrowser.open(url, '_system', 'location=yes');
           ref.addEventListener('loadstart', function(event) { alert(event.url); });

       };
    },
      goback(){
        console.log('Go Back');
        window.location.reload();
      }
    },
  };
  </script>