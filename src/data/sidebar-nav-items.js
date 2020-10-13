export default function() {
  return [
    {
      title: "sidemenu.dashboard",
      items: [
        {
          title: "sidemenu.home",
          to: "/home",
          htmlBefore: '<i class="material-icons">dashboard</i>',
          htmlAfter: ""
        }
      ]
    },
    {
      title: "sidemenu.identities",
      items: [
        {
          title: "sidemenu.attributes",
          to: "/attributes",
          htmlBefore: '<i class="material-icons">gavel</i>',
          htmlAfter: ""
        },
        {
          title: "CUSTOM SCRIPTS",
          to: "/attributes",
          htmlBefore: '<i class="material-icons">gavel</i>',
          htmlAfter: ""
        }
      ]
    },
    {
      title: "SSO",
      items: [
        {
          title: "sidemenu.openid_connect",
          htmlBefore: '<i class="material-icons">control_camera</i>',
          open: false,
          items: [
            {
              title: "sidemenu.scopes",
              to: "/openid_scopes"
            },
            {
              title: "sidemenu.clients",
              to: "/openid_clients"
            },
            {
              title: "sidemenu.sectors",
              to: "/openid_sector_identifiers"
            }
          ]
        },
        {
          title: "sidemenu.uma",
          htmlBefore: '<i class="material-icons">polymer</i>',
          open: false,
          items: [
            {
              title: "sidemenu.scopes",
              to: "/uma_scopes"
            },
            {
              title: "sidemenu.resources",
              to: "/uma_ressources"
            }
          ]
        }
      ]
    },
    {
      title: "CONFIGURATION",
      items: [
        {
          title: "BASIC",
          htmlBefore: '<i class="material-icons">vpn_key</i>',
          open: false,
          items: [
            {
              title: "ACRS",
              to: "/user-profile-lite"
            },
            {
              title: "SMTP",
              to: "/user-profile"
            },
            {
              title: "LOGGING",
              to: "/user-profile-lite"
            },
            {
              title: "FIDO2",
              to: "/user-profile-lite"
            }
          ]
        },
        {
          title: "ADVANCED",
          htmlBefore: '<i class="material-icons">how_to_reg</i>',
          open: false,
          items: [
            {
              title: "LDAP",
              to: "/user-profile"
            },
            {
              title: "COUCHBASE",
              to: "/user-profile"
            },
            {
              title: "CACHE",
              to: "/user-profile-lite"
            },
            {
              title: "JWK",
              to: "/user-profile-lite"
            },
            {
              title: "CONFIG",
              to: "/user-profile-lite"
            }
          ]
        }
      ]
    },
    {
      title: "SETTINGS",
      items: [
        {
          title: "CLOSE MENU",
          htmlBefore: '<i class="material-icons">fast_rewind</i>',
          to: "/icon"
        },
        {
          title: "LOGOUT",
          htmlBefore: '<i class="material-icons">logout</i>',
          to: "/"
        }
      ]
    }
  ];
}
