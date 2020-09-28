const routes = [
  {
    path: "/auth",
    component: () => import("layouts/LayoutAuth.vue"),
    children: [
      {
        path: "/auth/login",
        component: () => import("pages/PageLogin.vue"),
        name: "Login"
      },
      {
        path: "/auth/register",
        component: () => import("pages/PageRegister.vue"),
        name: "Register"
      }
    ]
  },
  {
    path: "/",
    component: () => import("layouts/LayoutMain.vue"),
    children: [
      {
        path: "/",
        component: () => import("pages/PageHome.vue"),
        name: "Home"
      },
      {
        path: "/profile",
        component: () => import("pages/PageProfile.vue"),
        name: "Profile"
      },
      {
        path: "/calendar",
        component: () => import("pages/PageCalendar.vue"),
        name: "Calendar"
      },
      {
        path: "/calendar_student",
        component: () => import("pages/PagePDF.vue"),
        name: "PDF"
      },
      {
        path: "stud/coordinator",
        component: () => import("pages/PageCoordinators.vue"),
        name: "Coordinator"
      },
      {
        path: "/request/:id",
        component: () => import("pages/PageRequest.vue"),
        name: "Request"
      },
      {
        path: "/cerere_inscriere",
        component: () => import("pages/PagePDF2.vue"),
        name: "PDF2"
      },
      {
        path: "/students",
        component: () => import("pages/PageStudents.vue"),
        name: "Students"
      },
      {
        path: "/coordinator",
        component: () => import("pages/PageCoordinators.vue"),
        name: "Coordinators"
      },
      {
        path: "/todo/:id",
        component: () => import("pages/PageTodo.vue"),
        name: "Todo"
      },
      {
        path: "/meetings/:id",
        component: () => import("pages/PageMeetings.vue"),
        name: "Meetings"
      },
      {
        path: "/message/:id",
        component: () => import("pages/PageMessages.vue"),
        name: "Messages"
      },
      {
        path: "/help",
        component: () => import("pages/PageHelp.vue"),
        name: "Help"
      }
    ]
  }
];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("pages/PageError404.vue")
  });
}

export default routes;
