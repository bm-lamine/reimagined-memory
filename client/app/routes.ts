import * as routes from "@react-router/dev/routes";

export default [
  routes.index("routes/home.tsx"),
  ...routes.prefix("auth", [
    routes.route("register", "routes/auth/register.tsx"),
  ]),
] satisfies routes.RouteConfig;
