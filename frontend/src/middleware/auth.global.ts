// middleware/auth.ts
export default defineNuxtRouteMiddleware((to) => {
  const { isSignedIn } = useAuth();

  // Define public routes
  const publicRoutes = ["/"];

  // If the route is public, allow access
  if (publicRoutes.includes(to.path)) {
    return;
  }

  // If the user is not signed in, redirect to the home page
  if (!isSignedIn.value) {
    console.log("User is not signed in. Redirecting to /.");
    return navigateTo("/");
  }

  // If the user is signed in and accessing the landing page, redirect to /document
  if (isSignedIn.value && to.path === "/") {
    console.log("User is signed in. Redirecting to /document.");
    return navigateTo("/document");
  }

  // Allow navigation for authenticated users to other routes
  console.log("User is signed in. Allowing navigation to:", to.path);
});
