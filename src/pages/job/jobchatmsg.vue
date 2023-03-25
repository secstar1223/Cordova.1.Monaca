<template>
  <f7-page>
    
      <f7-navbar>
      <f7-nav-left back-link="Back" @click="goback"></f7-nav-left>
      <f7-nav-title>JOBchat</f7-nav-title>
    </f7-navbar>

    <f7-messagebar
      ref="messagebar"
      v-model:value="messageText"
      :placeholder="placeholder"
      :attachments-visible="attachmentsVisible"
      :sheet-visible="sheetVisible"
      @keyup.enter = "sendMessage"
    ><!--@keyup.enter = "sendMessage"-->
      <template #inner-end>
        <f7-link
          icon-ios="f7:arrow_up_circle_fill"
          icon-aurora="f7:arrow_up_circle_fill"
          icon-md="material:send"
          @click="sendMessage"
        />
      </template>
    </f7-messagebar>

    <f7-messages :scroll-messages="true" :scroll-messages-on-edge="false">
         <f7-list style="margin-top:-20px; margin-bottom: 0; ">
             <div style="background: rgb(222,235,247);">
                <f7-list-item style="text-transform: capitalize;" v-if="(msg_category_name!=null)" :header="`${msg_category_name}`" :title="`${msg_title}`" :footer="`${msg_object}`" :after="`${msg_created_at}`"> 
            </f7-list-item>  
            <f7-list-item  style="text-transform: capitalize;" v-if="(msg_category_name==null)" :title="`${msg_title}`" :footer="`${msg_object}`" :after="`${msg_created_at}`">   
            </f7-list-item>
             </div>
        </f7-list>
        <div style="height: 5px; background: rgb(255,255,255);"></div>
        <f7-block class="align-items-stretch" style="margin-top: 10px;margin-bottom: 5px;" v-for = "(subitem) in msg_attachments" :key="subitem.id">
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
      <div style="height: 5px; background: rgb(222,235,247);"></div>
      <f7-messages-title><b>{{ msg_created_at }}</b></f7-messages-title>
      <f7-message
        v-for="(message, index) in messagesData"
        :key="index"
        :type="message.type"
        :image="message.image"
        :creator="message.creator"
        :avatar="message.avatar"
        :first="isFirstMessage(message, index)"
        :last="isLastMessage(message, index)"
        :tail="isTailMessage(message, index)"
      >
        <template #text>
          <!-- eslint-disable-next-line -->
          <span v-if="message.text" v-html="message.text"></span>
        </template>
      </f7-message>
      <f7-message
        v-if="typingMessage"
        type="admin"
        :typing="true"
        :first="true"
        :last="true"
        :tail="true"
        :header="`${typingMessage.creator} is typing`"
        :avatar="typingMessage.avatar"
      ></f7-message>
    </f7-messages>
  </f7-page>
</template>
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
      attachments: [],
      sheetVisible: false,
      typingMessage: null,

      msg_title : self.msg_title,
      msg_category_name : self.msg_category_name,
      msg_object : self.msg_object,
      msg_owner_type : self.msg_owner_type,
      msg_updated_at : self.msg_updated_at,
      msg_created_at : self.msg_created_at,
      msg_attachments : self.msg_attachments,

      messagesData:self.messagesData,
      
      responseInProgress: false,
    };
  },
  computed: {
    attachmentsVisible() {
      const self = this;
      return self.attachments.length > 0;
    },
    placeholder() {
      const self = this;
      return self.attachments.length > 0 ? 'Add comment or Send' : 'Message';
    },
  },
  mounted() {
    const self = this;
    store.state.header_id = this.f7route.params.id;
    store.state.msg_data.header_id = this.f7route.params.id;
    console.log(store.state.header_id,store.state.msg_data.header_id);
    f7ready(() => {
      self.messagebar = f7.messagebar.get(self.$refs.messagebar.$el);
    });

    f7.dialog.progress('Loading...');
    f7.request.post(
      store.state.api_url+store.state.webapi.message_list,
        { 
          'id':store.state.header_id ,
          "jobtype":"joball"
        },
        function(res){
        self.messagesData = res.data.msg_data;
        self.msg_category_name = res.data.category_name;
        self.msg_title = res.data.title;
        self.msg_object = res.data.object;
        self.msg_created_at = res.data.created_at;
        self.msg_updated_at = res.data.updated_at;
        self.msg_attachments = res.data.msg_attachments;
        f7.dialog.close();
        // console.log(res.data);
        },
        function(res){
          f7.dialog.close();
        },
        'json'
      );
  },
  updated(){
    console.log('updated view');
  },
  methods: {
    isFirstMessage(message, index) {
      const self = this;
      const previousMessage = self.messagesData[index - 1];
      if (message.isTitle) return false;
      if (
        !previousMessage ||
        previousMessage.type !== message.type ||
        previousMessage.creator !== message.creator
      )
        return true;
      return false;
    },
    isLastMessage(message, index) {
      const self = this;
      const nextMessage = self.messagesData[index + 1];
      if (message.isTitle) return false;
      if (!nextMessage || nextMessage.type !== message.type || nextMessage.creator !== message.creator)
        return true;
      return false;
    },
    isTailMessage(message, index) {
      const self = this;
      const nextMessage = self.messagesData[index + 1];
      if (message.isTitle) return false;
      if (!nextMessage || nextMessage.type !== message.type || nextMessage.creator !== message.creator)
        return true;
      return false;
    },
    sendMessage(event) {
      event.preventDefault();

    //   const exampleSocket = new WebSocket("wss://www.example.com/socketserver", "protocolOne");
    //   console.log("websocket: ", exampleSocket.readyState);


      const self = this;
      const text = self.messageText.replace(/\n/g, '').trim();
       
      
      const messagesToSend = [];
      if (text.length) {
        messagesToSend.push({
          text,
        });
        // Reset attachments
      self.attachments = [];
      // Hide sheet
      self.sheetVisible = false;
      // Clear area
      self.messageText = '';
      // Focus area
      if (text.length) self.messagebar.focus();
      // Send message
      self.messagesData.push(...messagesToSend);
      f7.dialog.progress('Sending Message...');

      f7.request.post(
      store.state.api_url+store.state.webapi.store_message,
        { 
          'content':text,
          'header_id':store.state.header_id,
          'creator_id':store.state.employee_id,
          'owner_type':'employee',
          'is_read':0,
        },
        function(res){
          var resdata = JSON.parse(res);
              if(resdata.is_success){
                console.log(resdata.message);
                hideKeyboard();
                f7.dialog.close();
              } else {
                console.log(resdata.message);
                hideKeyboard();
                f7.dialog.close();
              }
        },
        function(res){
            hideKeyboard();
          f7.dialog.close();
        },
      );
      //window.location.reload();
        
      }
      if (messagesToSend.length === 0) {
        return;
      }
      function hideKeyboard() {
        //this set timeout needed for case when hideKeyborad
        //is called inside of 'onfocus' event handler
        setTimeout(function() {

            //creating temp field
            var field = document.createElement('input');
            field.setAttribute('type', 'text');
            //hiding temp field from peoples eyes
            //-webkit-user-modify is nessesary for Android 4.x
            field.setAttribute('style', 'position:absolute; top: 0px; opacity: 0; -webkit-user-modify: read-write-plaintext-only; left:0px;');
            document.body.appendChild(field);

            //adding onfocus event handler for out temp field
            field.onfocus = function(){
            //this timeout of 200ms is nessasary for Android 2.3.x
            setTimeout(function() {

                field.setAttribute('style', 'display:none;');
                setTimeout(function() {
                document.body.removeChild(field);
                document.body.focus();
                }, 14);

            }, 200);
            };
            //focusing it
            field.focus();

        }, 50);
        }
      
    },
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
                    (res) =>{
                      var resdata = JSON.parse(res);
                      if(resdata.is_success){
                        console.log(resdata.message);
                        f7.dialog.close();
                        store.state.reloadpage = '/jobchatMgs/'+ store.state.header_id +'/';
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
                        // this.resend(resdata.message, store.state.phone);
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
    console.log('url',url);
        
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