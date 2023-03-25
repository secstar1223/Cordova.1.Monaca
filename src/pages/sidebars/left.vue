<template>
  <f7-panel left cover theme-dark id="leftSidebar">
    <f7-view>
      <f7-page>
        <f7-navbar title="WhatsJOB">
          <img src="/assets/logo.png" alt="KLIK BILLING" style="width: 100px;">
        </f7-navbar>
        <f7-list style="margin-top:0px;" class="leftList">
          <f7-list-item title="Dashboard" link="/dashboard/" panel-close view=".view-main"><template #media><i class="fas fa-fw fa-tachometer-alt tooltip-init" data-tooltip="Dashboard"></i></template></f7-list-item>
          <f7-list-item title="JOBCHAT" link="/jobchatdetail-all/" panel-close view=".view-main"><template #media><i class="fas fa-fw fa-comment tooltip-init" data-tooltip="JOBChat"></i></template></f7-list-item>
          <f7-list-item title="JOBWALL" link="/jobwall-all/" panel-close view=".view-main"><template #media><i class="fas fa-fw fa-calendar tooltip-init" data-tooltip="JOBWall"></i></template></f7-list-item>
          <f7-list-item title="JOBDRAWER" link="/jobdrawer-all/" panel-close view=".view-main"><template #media><i class="fas fa-fw fa-calendar tooltip-init" data-tooltip="JOBDrawer"></i></template></f7-list-item>
          <f7-list-item title="Logout" link="/logout/" panel-close view=".view-main"><template #media><i class="fa fa-fw fa-lock tooltip-init" data-tooltip="Logout"></i></template></f7-list-item>
        </f7-list>
      </f7-page>
    </f7-view>
  </f7-panel>
</template>
<script>
  import store from '../../js/store';
  import { f7 } from 'framework7-vue';
  export default {
    
    computed:{
      fname(){ return store.state.user.fname; },
      lname(){ return store.state.user.lname; },
      email(){ return store.state.user.email; }
    }
  }
</script>