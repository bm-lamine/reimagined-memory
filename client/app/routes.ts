import * as routes from "@react-router/dev/routes";

export default [
  routes.index("routes/home.tsx"),
  ...routes.prefix("auth", [
    routes.route("login", "routes/auth/login.tsx"),
    routes.route("register", "routes/auth/register.tsx"),
    routes.route("verify-email", "routes/auth/verify-email.tsx"),
  ]),
] satisfies routes.RouteConfig;
