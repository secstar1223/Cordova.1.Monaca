<template>
  <f7-page  data-name="createaccount">
    <f7-navbar back-link="Back"></f7-navbar>
    <form @submit.prevent="submitForm" id="registerAccount">
      <f7-block-title medium class="text-center">Create Register Details</f7-block-title>
      <f7-card>
        <f7-list>
          <f7-list-input outline required validate autofocus floating-label validate-on-blur
            id="reg-cname"
            label="Company Name" 
            type="text"
            disabled = true
            :value="cname" 
            @input="cname = $event.target.value" 
            @keyup="changedisable"
            error-message="Your Company name is required"
          ></f7-list-input>

          <f7-list-input outline required validate floating-label validate-on-blur
            id="reg-name"
            label="Name" 
            type="text"
            :value="name" 
            @input="name = $event.target.value" 
            @keyup="changedisable"
            error-message="Your Name is required"
          ></f7-list-input>
          
          <f7-list-input outline required validate floating-label validate-on-blur
            id="reg-sname"
            label="Surname" 
            type="text"
            :value="sname" 
            @input="sname = $event.target.value" 
            @keyup="changedisable"
            error-message="Your Surname is required"
          ></f7-list-input>

          <f7-list-input outline required validate floating-label validate-on-blur
            id="reg-email"
            label="Email Address" 
            type="text"
            :value="email" 
            @input="email = $event.target.value" 
            @keyup="changedisable"
            error-message="Your email address is required"
          ></f7-list-input>

          <f7-list-input outline required validate floating-label validate-on-blur
            id="reg-phone"
            label="Telephone Number" 
            type="number"
            :value="phone" 
            @input="phone = $event.target.value"
            @keyup="changedisable"
            :disabled = "isSent"
            error-message="Your Telephone Number is required."
            ></f7-list-input>
          <f7-list-item >
            <f7-list-input outline required validate floating-label validate-on-blur
              id="reg-vcode"
              label="Verification Code" 
              type="text"
              :value="vcode" 
              @input="vcode = $event.target.value"
              style="width:60%"
              error-message="Verification Code is required."
            ></f7-list-input>
            <f7-button id="reg-vcode" @click="onResend" style = "width:40%" fill>Send Again</f7-button>
          </f7-list-item>
        </f7-list>
      </f7-card>

      <f7-block>
        <f7-button id="reg-verify-btn" :disabled = "isBtnVerify" @click="onVerify" fill>Verify</f7-button>
        <f7-button id="reg-submit-btn" @click="submitForm" fill>Continue</f7-button>
      </f7-block>
    </form>
  </f7-page>
</template>
<script>
  import { f7 } from 'framework7-vue';
  import store from '../../js/store.js';
  import Dom7 from 'dom7';

  export default {
    props: {
      f7router: Object,
    },
    data() {
      return {
        cname:'',
        employee_id:0,
        name:'',
        sname:'',
        email:'',
        phone:0,
        user_id:0,
        otp:0,
        vcode:'',
        isBtnVerify:false,
        isSent:false,
        reg_vcode:false,

      };
    },
    ready:function(){
      changedisable();
    },
    mounted(){
      console.log('Store Values',store.state.register);
      this.cname=store.state.register.cname;
      this.name=store.state.register.name;
      this.sname=store.state.register.sname;
      this.email=store.state.register.email;
      this.phone=store.state.register.phone;
      this.vcode=store.state.register.vcode;
      Dom7('#reg-vcode').hide();
      Dom7('#reg-submit-btn').hide();
      this.isBtnVerify = true;
      this.isSent = false;
      this.reg_vcode = false;

    },
    methods: {
      // Password Validation 
      changedisable(){
        if((this.cname=="")){
          this.isBtnVerify = true;
        } else if(this.name=="") {
          this.isBtnVerify = true;
        } else if(this.sname=="") {
          this.isBtnVerify = true;
        } else if(this.email=="") {
          this.isBtnVerify = true;
        } else if(this.phone=="") {
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
      onVerify(){
        const self = this;
        f7.dialog.progress('Verifing Phone Number...');
          f7.request.post(
            store.state.api_url+store.state.webapi.send_regsms,
            {
              'admin_id':store.state.admin_id,
              'name':self.name,
              'name':self.name,
              'surname':self.sname,
              'email':self.email,
              'phone':self.phone,
          
            },
            (data, status, options) => {
              var resdata = JSON.parse(data);
              if(resdata.is_success){
                self.user_id = resdata.data.user_id;
                self.otp = resdata.data.otp;
                console.log('v-code->',resdata.data);
                console.log('v-user_id->',self.user_id);
                Dom7('#reg-vcode').show();
                Dom7('#reg-submit-btn').show();
                Dom7('#reg-verify-btn').hide();
                this.isSent = true;
                this.reg_vcode = true;
                f7.dialog.close();
              }else{
                  // CREATE ERROR HANDLER
                  f7.dialog.close();
                  f7.dialog.create({ 
                    text: resdata.message, 
                    title: 'Error', 
                    buttons: [ 
                      { text: 'Cancel' },
                      { 
                        text: 'Login', 
                        onClick: function(){
                          f7.views.main.router.back('/', {force: true});
                        } 
                      }
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
      onResend(){
        const self = this;
        f7.dialog.progress('Re Sending verification code...');
          f7.request.post(
            store.state.api_url + store.state.webapi.resend_vcode,
            {
              'user_id':self.user_id,
              'phone'  :self.phone,
            },
            function(data, status, options){
              var resdata = JSON.parse(data);
              if(resdata.is_success){
                self.user_id = resdata.data.user_id;
                self.otp = resdata.data.otp;
                console.log('code->',resdata.data);
                this.isSent = true;
                this.reg_vcode = true;
                f7.dialog.close();
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
      submitForm(){
        const self = this;
        const form = document.getElementById('registerAccount');
        const formValid = form.reportValidity();
        if(formValid){
          this.passwordsMatch = false;
          
          f7.dialog.progress('Verify Account...');
          f7.request.post(
            store.state.api_url+store.state.webapi.send_regcode,
            {
              'user_id':self.user_id,
              'otp':self.otp,
            },
            function(data,status){
              var resdata = JSON.parse(data);
              if(resdata.is_success){
                // CREATE ERROR HANDLER
                f7.dialog.close();
                f7.dialog.create({ 
                  text: resdata.message, 
                  title: 'Registration Succesfull', 
                  buttons: [ 
                    { 
                      text: 'Login', 
                      onClick: function(){
                        f7.views.main.router.back('/', {force: true});
                      } 
                    }
                  ],
                }).open();
              } 
              else{
                // CREATE ERROR HANDLER
                f7.dialog.close();
                f7.dialog.create({ 
                  text: resdata.message, 
                  title: 'Code not correct', 
                  buttons: [ 
                    { text: 'Cancel' },
                  ],
                }).open();
              }
            },
          );
          
        }else{
          this.passwordsMatch = true;
          console.log('invalid');
        }
      }
    },
  }
</script>

