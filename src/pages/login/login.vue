<template>
  <f7-page no-toolbar no-navbar no-swipeback login-screen data-name="login">
    <f7-block class="login-box">
    <f7-list form @submit.prevent="onVerify" id="loginForm">
      <f7-list-item><img src="/assets/logo.png" alt="KLIK BILLING" class="logo"></f7-list-item>
      <f7-list-item  v-if="loginMessage" class="loginMessage">
          <f7-card :title="loginHeader" :content="loginMessage" class="nm" style="width:100%; background:#ffb8b8;"></f7-card>
      </f7-list-item>
      <f7-list-input outline required validate floating-label validate-on-blur
        id="loginnumber"
        type="number"
        label="Telephone Number"
        placeholder=""
        error-message="Your Telephone Number is required."
        :value="phone"
        @input="phone = $event.target.value"
        @keyup="changedisable"
        :disabled = "isPhone"
        autocomplete="number"
      ></f7-list-input>
      <f7-list-input outline required validate floating-label
          id = "loginvcode"
          type="text"
          label="Verification Code"
          error-message="You must enter your Verification Code"
          :value="vcode"
          @input="vcode = $event.target.value"
          ></f7-list-input>
    </f7-list>
    <f7-block>
      <f7-button id="verify-btn" :disabled = "isBtnVerify" @click="onVerify" fill tabindex="2" active = true>Verify</f7-button>
      <f7-button id="login-btn" @click="onSignIn" fill tabindex="2" active = true>Log In</f7-button>
    </f7-block>
    <f7-block>
      <f7-button @click="showRegister" fill >Register</f7-button>
    </f7-block>
    <f7-block-footer style="margin-top:20px;">&copy; Copyright 2023 WHATSJOB</f7-block-footer>
    </f7-block>
  </f7-page>
</template>
<script>
  import { f7 } from 'framework7-vue';
  import { request } from 'framework7';

  import store from '../../js/store.js';
  import $$ from 'dom7';

  export default {
    props: {
      f7router: Object,
    },
    data() {
      return {
        phone: '',
        vcode: '',
        isBtnVerify: false,
        isPhone:false,
      };
    },
    mounted: function() {
      this.init();
    },
    ready:function(){
      changedisable();
    },
    computed:{
      loginHeader:function(){ return store.state.loginMessage.title; },
      loginMessage:function(){ return store.state.loginMessage.message; },
    },
    methods: {

      showRegister(){
        f7.views.main.router.navigate('/verifyCompany/', { transition: 'f7-cover' });
      },
      changedisable(){
        if(this.phone==""){
          this.isBtnVerify = true;
        } else {
          this.isBtnVerify = false;
        }
      },
      messages(data,title){
        try {
          data = JSON.parse(data.response);
          var dialog = f7.dialog.create({ text: data.message, title: title, buttons: [ { text: 'OK' } ] }).open(); return dialog;
        } catch (e) { var dialog = f7.dialog.create({ text: 'An unknown error occured preventing login. Please try again. If this continues please contact customer support on klikbilling.com', title: title, buttons: [ { text: 'OK' } ] }).open(); return dialog; }
      },
      onphonenumber(){
        this.isPhone = true;
      },
      onVerify(){
       
        const self = this;
        f7.dialog.progress('Verifing Phone Number...');
          f7.request.post(
            store.state.api_url+store.state.webapi.send_loginsms,
            {'phone':self.phone},
            (data,) => {
              var resdata = JSON.parse(data);
              if(resdata.is_success){
                $$('#verify-btn').hide();
                $$('#loginvcode').show();
                $$('#login-btn').show();   
                f7.dialog.close();
                this.onphonenumber();
                this.isPhone = true;
                f7.dialog.create({ 
                  text: resdata.message, 
                  title: 'Verification code', 
                  buttons: [ 
                    { text: 'OK' },
                  ],
                }).open();
              }else{
                // CREATE ERROR HANDLER
                console.log(data);
                f7.dialog.close();
                f7.dialog.create({ 
                  text: resdata.message, 
                  title: 'title', 
                  buttons: [ 
                    { 
                      text: 'Register', 
                      onClick: function(){
                        f7.views.main.router.navigate('/verifyCompany/',{ transition: 'f7-cover' });
                      } 
                    },
                    { text: 'Cancel' },
                  ],
                }).open();
              }
            },
            );
          },
          onSignIn() {
        const self = this;
        const form = document.getElementById('loginForm');
        const formValid = form.reportValidity();
        console.log(self.phone,self.vcode);
        if(formValid){
          this.passwordsMatch = false;
          f7.dialog.progress('Logging In...');
          f7.dialog.close();
          f7.request.post(
            
            store.state.api_url+store.state.webapi.send_logincode,
            {'phone':self.phone,'code':self.vcode,},
            function(data){
              var resdata = JSON.parse(data);
              if(resdata.is_success){
                f7.dialog.close();
                store.state.offline=false;
                localStorage.setItem("is_login",1);
                localStorage.setItem("employee_id",resdata.data.employee_id);
                localStorage.setItem("phone",resdata.data.phone);
                localStorage.setItem("admin_id",resdata.data.admin_id);
                store.state.employee_id = resdata.data.employee_id;
                store.state.admin_id = resdata.data.admin_id;
                store.state.phone = resdata.data.phone;
                console.log('when login, store employee_id',store.state.employee_id,store.state.phone);
                f7.views.main.router.back('/dashboard/', {force: true});
              }else{
                f7.dialog.close();
                self.resend(resdata.message, self.phone);
              }
            },
          );
        }
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
      init(){
        this.phone=store.state.login.phone;
        this.vcode=store.state.login.vcode;
        this.isBtnVerify = true;
        console.log(store.state.loginMessage.title);
        $$('#loginvcode').hide();
        $$('#login-btn').hide();      
        this.isBtnVerify = true;
        this.isPhone = false;
      }
    },
  }
</script>