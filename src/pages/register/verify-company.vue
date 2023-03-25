
<template>
  <f7-page  data-name="createaccount">
    <f7-navbar back-link="Back"></f7-navbar>
    <form @submit.prevent="submitForm" id="verifyCompany">
      <f7-block-title medium class="text-center">Verify Comapnay</f7-block-title>
      <f7-card>
        <f7-list>
          <f7-list-input outline required validate autofocus floating-label validate-on-blur
            id="reg-ccode"
            label="Company Code" 
            type="text"
            :value="ccode" 
            @input="ccode = $event.target.value" 
            @keyup="changedisable"
            error-message="Your Company Code is required"
          ></f7-list-input>
        </f7-list>
      </f7-card>

      <f7-block>
        <f7-button id="reg-ccode-btn" :disabled = "isBtnVerify" @click="onVerify" fill>Verify</f7-button>
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
        ccode:'',
        isBtnVerify: false,
      };
    },
    ready:function(){
      changedisable();
    },
    mounted(){
      this.ccode=store.state.register.ccode;
    },
    methods: {
      changedisable(){
        if(this.ccode==""){
          this.isBtnVerify = true;
        } else {
          this.isBtnVerify = false;
        }
      },
      // Password Validation 
      onVerify(){
        const self = this;
        f7.dialog.progress('Verifing Company Code...');
          f7.request.post(
            store.state.api_url+store.state.webapi.send_regccode,
            {
              'ccode':self.ccode,
          
            },
            function(data, status, options){
              var resdata = JSON.parse(data);
              if(resdata.is_success){
                console.log('Company Code result',resdata.message);
                store.state.register.cname = resdata.data.cname;
                store.state.admin_id = resdata.data.admin_id;
                f7.dialog.close();
                f7.views.main.router.navigate('/regAccount/',{ transition: 'f7-cover' });
                // f7.dialog.create({ 
                //   text: resdata.message, 
                //   title: 'Register Successfull', 
                //   buttons: [ 
                //     // { 
                //     //   text: 'Login', 
                //     //   onClick: function(){
                //     //     f7.views.main.router.back('/', {force: true});
                //     //   } 
                //     // },
                //     { 
                //       text: 'Continue', 
                //       onClick: function(){
                //         f7.views.main.router.navigate('/regAccount/',{ transition: 'f7-cover' });
                //       } 
                //     },
                //   ],
                // }).open();
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
  }
</script>