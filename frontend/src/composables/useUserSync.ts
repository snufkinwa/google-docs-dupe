import { useAuth, useUser } from "vue-clerk";
import { ref, watch, onUnmounted } from "vue";

export function useUserSync() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  const syncUserToDb = async () => {
    if (!isSignedIn.value || !user.value) return;

    try {
      await fetch("/api/users/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: user.value.id,
          email: user.value.primaryEmailAddress?.emailAddress,
          name: user.value.fullName,
          profile_pic: user.value.imageUrl,
        }),
      });
    } catch (error) {
      console.error("Failed to sync user:", error);
    }
  };

  watch(user, syncUserToDb, { immediate: true });

  return { user };
}
