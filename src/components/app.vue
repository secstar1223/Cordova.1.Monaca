<template>
  <f7-app v-bind="f7params" >

  <!-- Your main view, should have "view-main" class -->
  <f7-view main class="safe-areas" url="/" id="mainView"></f7-view>

  </f7-app>
</template>
<script>
  import { ref, onMounted } from 'vue';
  import { f7, f7ready } from 'framework7-vue';
  import { getDevice }  from 'framework7/lite-bundle';
  import cordovaApp from '../js/cordova-app.js';

  import $$ from 'dom7';
  
  import routes from '../js/routes.js';
  import store from '../js/store';

  export default {
    setup() {
      const device = getDevice();
      // Framework7 Parameters
      const f7params = {
        name: 'WhatsJob', // App name
        theme: 'auto', // Automatic theme detection
        id: 'com.whatsjob.app', // App bundle ID
        // App store
        store: store,
        // App routes
        routes: routes,


        // Input settings
        input: {
          scrollIntoViewOnFocus: device.cordova && !device.electron,
          scrollIntoViewCentered: device.cordova && !device.electron,
        },
        // Cordova Statusbar settings
        statusbar: {
          iosOverlaysWebView: true,
          androidOverlaysWebView: false,
        },
      };

      onMounted(() => {
        f7ready(() => {
          // Init cordova APIs (see cordova-app.js)
          if (device.cordova) {
            cordovaApp.init(f7);
          }

          // Call F7 APIs here
        });
      });

      return {
        f7params,
      }
    }
  }

//   $$(document).on('backbutton',function(e){
//   if (1==2) return false; //do nothing on condition
//   var view=app.views.reloadPrevious;
//   var comp=['actions','popover','picker','sheet'].filter(function(itm){
//     if(app[itm].get()){
//       app[itm].close();
//       return itm;
//     }
//   });
//   if (!comp.length && view.history.length) {
//     view.router.back();
//   } 
// });
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady(){
    document.addEventListener("backbutton", onBackKeyDown, false);
}
function onBackKeyDown() {
   window.history.back();   
   window.location.reload();
}
</script>