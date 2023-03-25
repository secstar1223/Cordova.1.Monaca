<template>
  <f7-page name="newchats">
    <f7-navbar>
      <f7-nav-left>
        <f7-link icon="icon-bars" href="/leftsidebar/" data-ignore-cache="true"><f7-icon ios="f7:menu" md="material:menu" aurora="f7:menu"></f7-icon></f7-link>
      </f7-nav-left>
      <f7-nav-right>
        <f7-link icon="icon-bars" href="/connect/" data-ignore-cache="true" v-if="offline"><f7-icon ios="f7:globe" md="material:public" aurora="f7:globe"></f7-icon></f7-link>
    </f7-nav-right>
    </f7-navbar>
    <form @submit.prevent="submitNewMsg" id="newmessage" enctype="multipart/form-data">
      <f7-block-title medium class="text-center">New Message</f7-block-title>
      <f7-card>
        <f7-list>
          <f7-list-input outline required validate autofocus floating-label validate-on-blur
            label="Title" 
            type="text"
            name = "title"
            :value="title" 
            @input="title = $event.target.value" 
            error-message="Your title is required"
          ></f7-list-input>

          <f7-list-input outline required validate autofocus floating-label validate-on-blur
            label="Object" 
            type="text"
            name = "object"
            :value="object" 
            @input="object = $event.target.value" 
            error-message="Your Object is required"
          ></f7-list-input>

          <f7-list-input outline required validate floating-label validate-on-blur
            label="Text" 
            type="text"
            :value="msgtext" 
            name = "text"
            @input="msgtext = $event.target.value" 
            error-message="Your text is required"
          ></f7-list-input>
        </f7-list>
          <f7-row class="attach" ref="ediv">
            <div v-for="(item) in inputs">
            <div class="block" >
              <input type="file" class="custom-file-input" multiple  name="attached[]" :id="`${item.attached_file_id}`" ref="file" v-on:change="handleFileObject()">
              <div style="height: 5px; background: rgb(255,255,255);"></div>
            </div>

            <!-- <div class="block block-strong">
              <p>Signature1<label class="radio">
                <input type="radio" :id="`${item.radio_yes_id}`" :name="`${item.radio_name}`"  checked value="yes" v-on:change="handeradiochange()"/><i class="icon-radio"></i></label> Yes
                <label class="radio">
                  <input type="radio" :id="`${item.radio_no_id}`" :name="`${item.radio_name}`" value="no" v-on:change="handeradiochange()"/><i class="icon-radio"></i></label> No 
              </p> 
            </div> -->
           </div>

         

          </f7-row>
        <f7-card-footer>
          <f7-button @click="onappend" fill >Add Attachment +</f7-button>
          <f7-button @click="ondeppend" fill >Delete Attachment -</f7-button>
        </f7-card-footer>
      </f7-card>
      <f7-block>
        <f7-button @click="submitNewMsg" fill>Send</f7-button>
      </f7-block>
    </form>
  </f7-page>
</template>
<script>
  import { f7 } from 'framework7-vue';
  import { request } from 'framework7';
  import pageheader from '@/components/header.vue';
  import ButtonCounter from '@/components/button.vue';
  import store from '../../js/store';
  import $$ from 'dom7';
  export default {
    props: {
    },
    components:{ pageheader },
    data(){
      return{
      object:self.object,
      title:self.title,
      msgtext:self.msgtext,
      attach_number:self.attach_number,
      max_attach:self.max_attach,
      sign_radios:[],
      file_attachs:[],

      inputs: [
      ],
      }
    },
    mounted(){
      var self = this;
      self.title = '';
      self.object = '';
      self.msgtext = '';
      self.attach_number = 0;
      self.attach_handle_number = 0;
      self.max_attach = 5;
    },
    methods: {
      onappend() {
        // const instance = new EquipmentInput();
        // instance.$mount();
        if(this.attach_number < this.max_attach){
            this.attach_number++;
            var attached_file_id = 'attached_file_'+this.attach_number;
            // var radio_yes_id = 'attach_sign_'+this.attach_number+'_yes';
            // var radio_no_id = 'attach_sign_'+this.attach_number+'_no';
            // var radio_name = 'attach_sign_'+this.attach_number;
            this.inputs.push({
              attached_file_id: attached_file_id, 
            //   radio_yes_id: radio_yes_id, 
            //   radio_no_id: radio_no_id, 
            //   radio_name: radio_name, 
            });
            // this.sign_radios.push({
            //   radio_name:radio_name,
            //   radio_checked:'yes',
            // })
            //   console.log('sign_radios',this.sign_radios);
          }
          else
        {
        alert('You Reached the limits')
        }
      },
      ondeppend() {
        // const instance = new EquipmentInput();
        // instance.$mount();
        console.log(this.attach_number);
        if(this.attach_number > 0){
            this.attach_number--;
            var attached_file_id = 'attached_file_'+this.attach_number;
            // var radio_yes_id = 'attach_sign_'+this.attach_number+'_yes';
            // var radio_no_id = 'attach_sign_'+this.attach_number+'_no';
            // var radio_name = 'attach_sign_'+this.attach_number;
            this.inputs.pop({
              attached_file_id: attached_file_id, 
            //   radio_yes_id: radio_yes_id, 
            //   radio_no_id: radio_no_id, 
            //   radio_name: radio_name, 
            });
            // this.sign_radios.push({
            //   radio_name:radio_name,
            //   radio_checked:'yes',
            // })
            //   console.log('sign_radios',this.sign_radios);
          }
          else
        {
        alert('You Reached the limits')
        }
      },
      handleFileObject() {
        this.attach_handle_number++;
        this.file_attachs.push($$('#attached_file_'+this.attach_handle_number).prop("files"));
        // console.log('checked',$$('input[name="attach_sign_1"]:checked').val());
        //doesnt file upload What is the matter? https://serversideup.net/uploading-files-vuejs-axios/
        // console.log('javascript', this.file_attachs);

      },
      handeradiochange() { 
        // console.log('input',this.inputs[this.attach_number].radio_name);
        // for(var i = 0; i<this.attach_number;i++) {
        //   this.sign_radios[i].radio_checked = $$('input[name="'+this.sign_radios[i].radio_name+'"]:checked').val();
        // }
        // console.log('sign_radios',this.sign_radios);
        // $$('input[name="'+this.inputs[i].radio_name+'"]:checked').val()
        // console.log('checked 1',$$('input[name="attach_sign_1"]:checked').val());
        // console.log('checked 2',$$('input[name="attach_sign_2"]:checked').val());
        // console.log('checked 3',$$('input[name="attach_sign_3"]:checked').val());
        // console.log('checked 4',$$('input[name="attach_sign_4"]:checked').val());
        // console.log('checked 5',$$('input[name="attach_sign_5"]:checked').val());
      },
      submitNewMsg(e) {
          if(this.title != "" && this.object != "" && this.msgtext != ""){
              e.preventDefault();
        let formData = new FormData();
        formData.append('title', this.title);
        formData.append('object', this.object);
        formData.append('text', this.msgtext);
        formData.append('creator_id', store.state.employee_id);
        formData.append('receiver_id', store.state.admin_id);
        formData.append('owner_type', 'employee');
        formData.append('attachnum', this.file_attachs.length);
        
        for( var i = 0; i < this.file_attachs.length; i++ ){
          let file = this.file_attachs[i][0];
          formData.append('attached_' + i, file);
        }
        // for( var i = 0; i < this.sign_radios.length; i++ ){
        //   formData.append(this.sign_radios[i].radio_name, this.sign_radios[i].radio_checked);
        // }
        console.log(formData);
        
        f7.dialog.progress('Sending New Message...');
        request.post(store.state.api_url+store.state.webapi.send_newmsg, formData)
        .then(function (res) {
          var resdata = JSON.parse(res.data);
          var id = resdata.data.id;
          if(resdata.is_success){
            console.log('Sucess',resdata.message);
            f7.dialog.close();
            f7.dialog.create({ 
                  text: resdata.message, 
                  title: 'Message sent', 
                  buttons: [ 
                    { 
                      text: 'Ok', 
                      onClick: function(){
                        f7.views.main.router.navigate('/jobchatMgs/'+id+'/', {
                          ignoreCache:true,
                          //reloadCurrent:true,
                        })
                      } 
                    }
                  ],
                }).open();
          } else {
            f7.dialog.close();
            f7.dialog.create({ 
              text: resdata.message, 
              title: 'Error', 
              buttons: [ 
                { text: 'Cancel' },
                // { 
                //   text: 'Warning', 
                //   onClick: function(){
                //     f7.views.main.router.back('/', {force: true});
                //   } 
                // }
              ],
            }).open();
          }
        });
          }else {
              alert("All fields are required!")
          }
        
      }
    },
  }

</script>