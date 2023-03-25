
import { createStore } from 'framework7/lite';
import { f7 } from 'framework7-vue';

const store = createStore({
  state: {
 
      dev:true,
      offline: true,
      phone: 0,
      breakpoint: 1000,
      sidebar: true,
      employee_id:0,
      admin_id:0,
      current_fcm_tocken:'',
      category_id:0,
      reloadpage:'',
      
      loginMessage:{
        'title':'',
        'message':''
      },
      user:{},
      login:{
        phone:'',
        vcode:''
      },
      register:{
        ccode:'pp_693428',
        cname:'',
        name:'',
        sname:'',
        email:'',
        phone:'',
        vcode:'',
   
      },
      
      attachments:[],


      msg_data:{
        header_id:'com_code1',
        creator_id:'Company',
        owner_type:'employee', 
        is_read:0,
   
      },

      msg_attach_id:0,
      // api_url : 'http://10.10.12.125/whatsjob-it/whatsjob-it/public_html/api/v1/',
      api_url : 'https://www.whatsjob.it/api/v1/',

    webapi:{
        // Login API
        send_loginsms : 'send_loginsms',
        send_logincode : 'send_logincode',
        login_status : 'login_status',

        // Register API
        send_regccode : 'send_regccode',
        send_regsms   : 'send_regsms',
        resend_vcode  : 'resend_vcode', 
        send_regcode  : 'send_regcode',
  
  
      // Jobs
        jobchat : 'jobchat',
        dashboard : 'dashboard',
        joballchat : 'joballchat',
        jobwall : 'jobwall',
        jobdrawer : 'jobdrawer',
        message_list : 'message_list',
        attachment_list : 'attachment_list',

        send_code_signattachment : 'send_code_signattachment',
        verify_code_signattachment : 'verify_code_signattachment',
        send_newmsg : 'send_newmsg',
        store_message : 'store_message',
        downloadfile : 'downloadfile',

        // FCM
        save_token:'save_token',
      },
  },

  

  getters: {
    products({ state }) {
      return state.products;
    }
  },
  actions: {
    addProduct({ state }, product) {
      state.products = [...state.products, product];
    },
    
    
    // MessageData
    getmessagedata( { state } ){
      //for dashboard
      var request = f7.request({
        url : state.api_url+state.webapi.message_list,
        dataType: 'json', async: false, method: 'POST', cache: false,
        data: { },
        success: function(data, status, xhr){
          state.msg_data = data.data;

        },
        error: function (xhr, status, message){
          if(status!=0){
            var title = "Loading Failed";
            f7.dialog.close();
            try { var data = JSON.parse(xhr.response); f7.dialog.create({ text: data.message, title: title, buttons: [ { text: 'OK' } ] }).open(); } 
            catch (e) { f7.dialog.create({ text: 'An unknown error occured. Please try again. If this continues please contact customer support on support.com', title: title, buttons: [ { text: 'OK' } ] }).open(); }
            return false;
          }else{ // Server down or phone is offline
            var test = { code: '0110' , data: res };
            return test;
          }
        }
      });
      if(request.status>0){
        return request;
      }else{
        return false;
      }
    },

    // MessageData
    onsignattachment( { state } ){
      //for dashboard
      var request = f7.request({
        url : state.api_url+state.webapi.signattachment,
        dataType: 'json', async: false, method: 'POST', cache: false,
        data: { 'id': state.msg_attach_id },
        success: function(data, status, xhr){
          console.log('successfully!',state.msg_attach_id);
        },
        error: function (xhr, status, message){
          if(status!=0){
            var title = "Loading Failed";
            f7.dialog.close();
            try { var data = JSON.parse(xhr.response); f7.dialog.create({ text: data.message, title: title, buttons: [ { text: 'OK' } ] }).open(); } 
            catch (e) { f7.dialog.create({ text: 'An unknown error occured. Please try again. If this continues please contact customer support on support.com', title: title, buttons: [ { text: 'OK' } ] }).open(); }
            return false;
          }else{ // Server down or phone is offline
            var test = { code: '0110' , data: res };
            return test;
          }
        }
      });
      if(request.status>0){
        return request;
      }else{
        return false;
      }
    },

    
    // MessageData
    storeMessage( { state } ){
      //for dashboard
      var request = f7.request({
        url : state.api_url+state.webapi.store_message,
        dataType: 'json', async: false, method: 'POST', cache: false,
        data: { 
          // 'header_id':
          'id':state.employee_id,
          "jobtype":"joball"
        },
        success: function(data, status, xhr){
          state.msg_data = data.data;

        },
        error: function (xhr, status, message){
          if(status!=0){
            var title = "Loading Failed";
            f7.dialog.close();
            try { var data = JSON.parse(xhr.response); f7.dialog.create({ text: data.message, title: title, buttons: [ { text: 'OK' } ] }).open(); } 
            catch (e) { f7.dialog.create({ text: 'An unknown error occured. Please try again. If this continues please contact customer support on support.com', title: title, buttons: [ { text: 'OK' } ] }).open(); }
            return false;
          }else{ // Server down or phone is offline
            var test = { code: '0110' , data: res };
            return test;
          }
        }
      });
      if(request.status>0){
        return request;
      }else{
        return false;
      }
    },

  },
})
export default store;
