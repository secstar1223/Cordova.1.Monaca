

// Login Pages
import LoginPage from '../pages/login/login.vue';

// Registrations Pages
import verifyCompany from '../pages/register/verify-company.vue';
import regAccount from '../pages/register/create-account.vue';

// Account - Dashboard
import DashboardPage from '../pages/dashboard.vue';


// Jobchat
import NewjobchatPage from '../pages/job/newjobchat.vue';
import JobchatdetailallPage from '../pages/job/jobchatdetail-all.vue';
import JobwallPage from '../pages/job/jobchatdetail-wall.vue';
import JobdrawerPage from '../pages/job/jobchatdetail-drawer.vue';
import JobchatMsgPage from '../pages/job/jobchatmsg.vue';
import JobAttachWallPage from '../pages/job/jobattach-list-wall.vue';
import JobAttachDrawerPage from '../pages/job/jobattach-list-drawer.vue';


// Sidebars
import leftsidebar from '../pages/sidebars/left.vue';
import rightsidebar from '../pages/sidebars/right.vue';


import store from './store';

var routes = [
  // Sidebars
  { path: '/leftsidebar/', panel: { component: leftsidebar } },
  { path: '/rightsidebar/', panel: { component: rightsidebar } },
  
  { 
    path: '/', 
    async({resolve}){
      // localStorage.setItem("is_login",1);
      // store.state.employee_id = 1;
      // store.state.admin_id = 1;
      // resolve({ component: DashboardPage });
      // Check for login before continuing
      if(localStorage.getItem('is_login') == 1){
        // No token saved - User must login before using the app.
        store.state.employee_id = localStorage.getItem("employee_id");
        store.state.admin_id = localStorage.getItem("admin_id");
        store.state.phone = localStorage.getItem("phone");
        console.log('when save localstorage, store employee_id, phone',store.state.employee_id, store.state.phone);
        resolve({ component: DashboardPage });
      }else{
        resolve({ component: LoginPage });
      }
    }
  },

  // Registration Pages
  { path: '/verifyCompany/', component: verifyCompany },
  { path: '/regAccount/', component: regAccount },
  
  // Main App Pages
  { path: '/dashboard/', component: DashboardPage },


  // Main App Pages
  { path: '/newjobchat/', component: NewjobchatPage },
  { path: '/jobchatdetail-all/', component: JobchatdetailallPage },
  { path: '/jobwall-all/', component: JobwallPage },
  { path: '/jobdrawer-all/', component: JobdrawerPage },
  { path: '/jobchatMgs/:id/', component: JobchatMsgPage,
  async: function ({ router, to, resolve }) {

    store.state.msg_id = to.params.id;
    resolve({ component: JobchatMsgPage });
    },
  },
  { path: '/jobattachwall/:id/', component: JobAttachWallPage,
  async: function ({ router, to, resolve }) {

    store.state.msg_id = to.params.id;
    },
  },
  { path: '/jobattachdrawer/:id/', component: JobAttachDrawerPage,
  async: function ({ router, to, resolve }) {

    store.state.msg_id = to.params.id;
    },
  },
  
  { path: '/logout/', 
    async({resolve}){
      localStorage.setItem("is_login",0);
      store.state.loginMessage.title = 'Logged Out';
      store.state.loginMessage.message = 'You have successfully logged out.';

      resolve({ component:LoginPage});
    }  
 },
  
];

export default routes;
