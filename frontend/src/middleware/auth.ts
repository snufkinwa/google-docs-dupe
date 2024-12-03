export default defineNuxtRouteMiddleware((to) => {
  const { isSignedIn } = useAuth();
  const publicRoutes = ["/"];

  if (isSignedIn && to.path === "/") {
    return navigateTo("/documents");
  }

  if (!isSignedIn && !publicRoutes.includes(to.path)) {
    return navigateTo("/");
  }
});
