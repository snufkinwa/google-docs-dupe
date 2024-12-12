import { useUserSync } from "~/composables/useUserSync";

export default defineNuxtRouteMiddleware((to) => {
  const { isSignedIn } = useAuth();

  if (isSignedIn.value) {
    const { user } = useUserSync();
    console.log("User info:", user.value);
  }

  console.log("Middleware executed for route:", to.path);
  console.log("User signed in:", isSignedIn.value);

  if (isSignedIn.value && to.path === "/") {
    console.log("User is signed in. Redirecting to /document.");
    return navigateTo("/document");
  }

  const publicRoutes = ["/"];

  if (publicRoutes.includes(to.path)) {
    console.log("Access granted to public route:", to.path);
    return;
  }

  if (!isSignedIn.value) {
    console.log("User not signed in. Redirecting to /sign-in.");
    return navigateTo("/");
  }

  console.log("User is signed in. Allowing navigation to:", to.path);
});
