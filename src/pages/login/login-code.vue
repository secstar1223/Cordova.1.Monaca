<template>
  <f7-page no-toolbar no-navbar no-swipeback login-screen data-name="login">
    <f7-block class="login-box">
    <f7-list form @submit.prevent="onSignIn" id="loginForm">
      <f7-list-item><img src="/assets/logo.png" alt="KLIK BILLING" class="logo"></f7-list-item>
      <f7-list-item  v-if="loginMessage" class="loginMessage">
          <f7-card :title="loginHeader" :content="loginMessage" class="nm" style="width:100%; background:#ffb8b8;"></f7-card>
      </f7-list-item>
      <f7-list-input outline required validate floating-label validate-on-blur
        type="text"
        label="Telephone Number"
        placeholder=""
        error-message="Your Telephone Number is required."
        disabled
        :value="phone"
        @input="phone = $event.target.value"
        autocomplete="number"
      ></f7-list-input>
      <f7-list-input outline required validate floating-label
          type="text"
          label="Verification Code"
          error-message="You must enter your Verification Code"
          :value="vcode"
          @input="vcode = $event.target.value"
          ></f7-list-input>
    </f7-list>
    <f7-block>
          <f7-button @click="onSignIn" fill tabindex="2" active = true>Log In</f7-button>
    </f7-block>
    <f7-block>
      <f7-button @click="showRegister" fill >Register</f7-button>
    </f7-block>
    <f7-block-footer style="margin-top:20px;">&copy; Copyright 2022 WHATSJOB</f7-block-footer>
    </f7-block>
  </f7-page>
</template>
<script>
  import { f7 } from 'framework7-vue';
  import store from '../../js/store.js';

  export default {
    props: {
      f7router: Object,
    },
    data() {
      return {
        phone: '',
        vcode: '',
      };
    },
    mounted(){
      this.phone=store.state.login.phone;
      this.vcode=store.state.login.vcode;

      console.log(store.state.loginMessage.title);

    },
    computed:{
      loginHeader:function(){ return store.state.loginMessage.title; },
      loginMessage:function(){ return store.state.loginMessage.message; },
    },
    methods: {
      showRegister(){
        f7.views.main.router.navigate('/regAccount/', { transition: 'f7-cover' });
      },
      messages(data,title){
        try {
          data = JSON.parse(data.response);
          var dialog = f7.dialog.create({ text: data.message, title: title, buttons: [ { text: 'OK' } ] }).open(); return dialog;
        } catch (e) { var dialog = f7.dialog.create({ text: 'An unknown error occured preventing login. Please try again. If this continues please contact customer support on klikbilling.com', title: title, buttons: [ { text: 'OK' } ] }).open(); return dialog; }
      },
      verify(){
        alert(123);
      },
      onSignIn() {
        const self = this;
        const form = document.getElementById('loginForm');
        const formValid = form.reportValidity();
        if(formValid && this.registerPassword==this.registerVerifyPassword){
          this.passwordsMatch = false;
          f7.dialog.progress('Logging In...');

          f7.views.main.router.back('/dashboard/', {force: true});
                f7.dialog.close();
          // f7.request.post(
          //   store.state.webapi.login,
          //   {'password':self.password,'email':self.login},
          //   function(data){

          //     console.log('Login',data);
              
          //     if(data.code==1){
          //       localStorage.setItem('login',self.login);
          //       localStorage.setItem('token',data.data.token);
          //       localStorage.removeItem('offlineStart');
          //       localStorage.setItem('klikUser',data.data.user);
          //       store.state.user = data.data.user;
          //       store.state.offline=false;
                
          //       f7.views.main.router.back('/dashboard/', {force: true});
          //       f7.dialog.close();
          //     }else{
          //       // CREATE ERROR HANDLER
          //       console.log(data);
          //       f7.dialog.close();
          //       self.messages(data,'Login Error');
          //     }
          //   },
          //   function(data){
          //     self.messages(data,'Login Error');
          //     console.log('Login Error',data);
          //     f7.dialog.close();
          //   },
          //   'json'
          // );
        }
      },
    },
  }
</script>