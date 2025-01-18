import { useAuth, useUser } from "vue-clerk";
import { ref, watch, onUnmounted } from "vue";

export function useUserSync() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  console.log("User data:", user);

  const syncUserToDb = async () => {
    if (!isSignedIn.value || !user.value) return;

    try {
      const response = await fetch("http://127.0.0.1:8080/api/users/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: user.value.id,
          email: user.value.primaryEmailAddress?.emailAddress,
          name: user.value.fullName,
          profile_pic: user.value.imageUrl,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error("Failed to sync user:", errorMessage);
      }
    } catch (error) {
      console.error("Failed to sync user:", error);
    }
  };

  watch(user, syncUserToDb, { immediate: true });

  return { user };
}
