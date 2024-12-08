import { useAuth, useUser } from "vue-clerk";

export function useUserSync() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  const syncUserToDb = async () => {
    if (!isSignedIn.value || !user.value) return;

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
  };

  watch(user, syncUserToDb, { immediate: true });

  return { user };
}
