<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h2 class="text-xl font-semibold mb-4">Profile Settings</h2>

    <form @submit.prevent="saveProfile" class="space-y-4">
      <div>
        <label class="block text-sm">Full name</label>
        <input v-model="form.fullName" required class="border px-3 py-2 rounded w-full" />
      </div>

      <div>
        <label class="block text-sm">Email</label>
        <input v-model="form.email" type="email" required class="border px-3 py-2 rounded w-full" />
      </div>

      <div class="flex gap-2 justify-end">
        <button @click="resetForm" type="button" class="px-4 py-2 bg-gray-200 rounded">Reset</button>
        <button :disabled="saving" class="px-4 py-2 bg-green-600 text-white rounded">
          <span v-if="!saving">Save</span>
          <span v-else>Saving...</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "@/api/api"; // your configured axios
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const saving = ref(false);

const form = ref({ fullName: "", email: "" });

onMounted(() => {
  // populate from Pinia/localStorage
  form.value.fullName = auth.user?.fullName || (JSON.parse(localStorage.getItem("auth") || "null")?.user?.fullName) || "";
  form.value.email = auth.user?.email || (JSON.parse(localStorage.getItem("auth") || "null")?.user?.email) || "";
});

const resetForm = () => {
  form.value = { fullName: auth.user?.fullName || "", email: auth.user?.email || "" };
};

const saveProfile = async () => {
  saving.value = true;
  try {
    const res = await api.patch("/api/settings/me", {
      fullName: form.value.fullName,
      email: form.value.email,
    });

    // update Pinia store + localStorage so UI shows new name immediately
    const updatedUser = res.data.user;
    try {
      auth.setUser(updatedUser); // implement setUser in your Pinia store
      const saved = JSON.parse(localStorage.getItem("auth") || "{}");
      saved.user = updatedUser;
      localStorage.setItem("auth", JSON.stringify(saved));
    } catch (e) { console.warn(e); }

    alert("Profile updated");
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Failed to update profile");
  } finally {
    saving.value = false;
  }
};
</script>
