---
tags:
- administration
- admin-ui
- interaction
---
# Interaction with Jans Auth Server

This user-friendly interface facilitates interaction with the [Jans Auth Server](https://docs.jans.io) through a REST API layer known as the [Jans Config API](https://docs.jans.io/v1.0.16/admin/config-guide/config-api). Here, we'll explore the working mechanism of the Gluu Flex Admin UI, focusing on its interaction with the Jans Auth Server and the key steps involved.

## The Authorization Code Flow

When accessing the Gluu Flex Admin UI through a web browser, the following steps are involved in the Authorization Code Flow:

1. The user accesses the Gluu Flex Admin UI frontend through a web browser.
2. The frontend initiates the Authorization Code Flow by redirecting the user to the login page of the authorization server (`jans-auth-server`) for user authentication.
3. The authorization server authenticates the end-user and obtains their consent/authorization.
4. Upon successful authentication, the authorization server sends an authorization `code` and a `state` to the frontend. The frontend verifies the state.
5. The frontend sends a request for a User-Info JWT (`UJWT`) response using the authorization code to the Admin UI Backend. The Admin UI Backend is a plugin of the Jans Config API.
6. The Admin UI Backend utilizes the authorization code to first obtain an access token (`AT1`) from the token endpoint of the authorization server.
7. With AT1, the backend fetches the User-Info JWT (`UJWT`) from the authorization server and forwards it to the frontend.
8. The frontend stores the UJWT and its claims, including the user's role (`jansAdminUIRole`) and other relevant information, in the Redux store.

## API Protection and Scopes

To ensure security and access control, Gluu Flex Admin UI leverages API protection and scopes:

1. The Jans Config API's endpoints are protected and can only be accessed using an API protection token (`AT2`) with the required scopes.
2. To generate an API protection token (`AT2`), the frontend requests the Token Server (`jans-auth-server`) via the backend. The Token Server and Authorization Server can be the same or different.
3. The Token Server employs an introspection script that validates the `UJWT` and refers to the role-scope mapping in the Jans Auth Server persistence.
4. The introspection script validates the UJWT and includes the appropriate scopes in AT2 based on the user's role.
5. The frontend receives AT2 and associated scopes from the backend.
6. Features in the frontend are enabled or disabled based on the scopes provided in AT2.

## Accessing Config-API Endpoints

To access config-api endpoints, the following steps are taken:

1. The Admin UI frontend requests AT2 from the Token Server through the backend.
2. Armed with AT2, the frontend sends a request to the desired config-api endpoint. AT2 is included in the authorization header, along with other request parameters.
3. At the Jans Config API, AT2 is validated, and the provided scopes are verified to ensure the necessary scope for the requested endpoint is present.
4. If the above steps are successful, the requested data is fetched from the Jans Config API and forwarded to the frontend.

## Conclusion

The Gluu Flex Admin UI simplifies the process of managing configuration and features of the Jans Auth Server through an intuitive graphical user interface. By following the Authorization Code Flow and leveraging API protection and scopes, the Gluu Flex Admin UI ensures secure and controlled interaction with the Jans Auth Server's REST API layer. This seamless interaction empowers administrators to efficiently manage the Jans Auth Server's settings while adhering to strict access controls and security protocols.

