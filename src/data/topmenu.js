export default function() {
  return [
    {
      title: "DASHBOARD",
      htmlBefore: '<i class="material-icons">&#xE2C7;</i>',
      items: [
        {
          title: "Users",
          to: "/users"
        },
        {
          title: "Groups",
          to: "/groups"
        },
        {
          title: "Attributes",
          to: "/attributes"
        }
      ]
    },
    {
      title: "Header Nav",
      htmlBefore: '<i class="material-icons">view_day</i>',
      to: "/header-navigation"
    },
    {
      title: "Icon Sidebar",
      htmlBefore: '<i class="material-icons">&#xE251;</i>',
      to: "/icon-sidebar-nav"
    },
    {
      title: "Organization",
      htmlBefore: '<i class="material-icons">view_module</i>',
      items: [
        {
          title: "System",
          to: "/components-overview"
        },
        {
          title: "Smtp",
          to: "/blog-posts"
        },
        {
          title: "Settings",
          to: "/blog-posts"
        },
        {
          title: "Extra libraries",
          to: "/blog-posts"
        }
      ]
    },
    {
      title: "Authentication",
      htmlBefore: '<i class="material-icons">view_module</i>',
      items: [
        {
          title: "Default",
          to: "/components-overview"
        },
        {
          title: "SCIM",
          to: "/blog-posts"
        }
      ]
    },
    {
      title: "Registration",
      htmlBefore: '<i class="material-icons">view_module</i>',
      items: [
        {
          title: "Default",
          to: "/components-overview"
        },
        {
          title: "SCIM",
          to: "/blog-posts"
        }
      ]
    },
    {
      title: "Oxtrust Json",
      htmlBefore: '<i class="material-icons">view_module</i>',
      items: [
        {
          title: "Default",
          to: "/components-overview"
        },
        {
          title: "SCIM",
          to: "/blog-posts"
        }
      ]
    },
    {
      title: "OxAuth Json",
      htmlBefore: '<i class="material-icons">view_module</i>',
      items: [
        {
          title: "Default",
          to: "/components-overview"
        },
        {
          title: "SCIM",
          to: "/blog-posts"
        }
      ]
    }
  ];
}
