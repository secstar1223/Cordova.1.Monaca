<template>
  <f7-panel right cover theme-dark>
    <f7-view>
      <f7-page>
        <!-- <f7-navbar :title="lang.menus.right_heading"></f7-navbar> -->
        <f7-navbar >
          My Account
        </f7-navbar>
        <f7-list style="margin-top:0px;">
          <f7-list-item title="Account Settings" link="/dashboard/" panel-close view=".view-main"></f7-list-item>
          <f7-list-item title="My Subscription" link="/my-subscription/" panel-close view=".view-main"></f7-list-item>
          <f7-list-item title="Logout" link="/logout/" panel-close view=".view-main"></f7-list-item>
        </f7-list>
      </f7-page>
    </f7-view>
  </f7-panel>
</template>
<script>
  import store from '../../js/store';
  export default {
    computed:{
      fname(){ return store.state.user.fname; },
      lname(){ return store.state.user.lname; },
      email(){ return store.state.user.email; }
    },
  }
</script>