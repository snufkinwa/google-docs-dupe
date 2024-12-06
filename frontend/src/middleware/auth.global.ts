export default defineNuxtRouteMiddleware((to) => {
  const { isSignedIn } = useAuth();

  // Define public routes
  const publicRoutes = ["/", "/sign-in", "/sign-up"];

  // Allow access to public routes
  if (publicRoutes.includes(to.path)) {
    console.log("Accessing public route:", to.path);
    return;
  }

  // Redirect unauthenticated users to the sign-in page
  if (!isSignedIn.value) {
    console.log("User not signed in. Redirecting to /sign-in.");
    return navigateTo("/sign-in");
  }

  // Redirect authenticated users from landing page to /document
  if (isSignedIn.value && to.path === "/") {
    console.log("User is signed in. Redirecting to /document.");
    return navigateTo("/document");
  }

  // Allow navigation for authenticated users
  console.log("User is signed in. Allowing navigation to:", to.path);
});
