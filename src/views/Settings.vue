<template>
  <div class="settings-page">
    <!-- Header -->
    <div class="header">
      <div class="icon-wrap">
        <Settings class="icon" />
      </div>
      <div>
        <h1>Settings</h1>
        <p>Manage your account preferences</p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button 
        class="tab" 
        :class="{ active: activeTab === 'profile' }"
        @click="activeTab = 'profile'">
        <User />
        Profile
      </button>

      <button 
        class="tab" 
        :class="{ active: activeTab === 'password' }"
        @click="activeTab = 'password'">
        <Lock />
        Password
      </button>

      <button class="tab">
        <Image />
        Avatar
      </button>
    </div>

    <!-- sections-->
    <div v-auto-animate>
          <!-- Profile Section -->
    <div v-if="activeTab === 'profile'" class="card">
      <h3>Profile Information</h3>

      <div class="form-row">
        <div class="field">
          <label>Full Name</label>
          <input v-model="form.fullName" />
        </div>

        <!-- <div class="field">
          <label>Last Name</label>
          <input v-model="form.lastName" />
        </div> -->
      </div>

      <div class="field">
        <label>Email Address</label>
        <input v-model="form.email" />
      </div>

      <button class="btn " :disabled="loading" @click="updateProfile">Save Changes</button>
    </div>

    <!-- Password Section -->
    <div  v-if="activeTab === 'password'" class="card">
      <h3>Change Password</h3>

      <div class="field">
        <label>Current Password</label>
        <input type="password" v-model="passwords.current" />
      </div>

      <div class="field">
        <label>New Password</label>
        <input type="password" v-model="passwords.newPass" />
      </div>

      <div class="field">
        <label>Confirm New Password</label>
        <input type="password" v-model="passwords.confirm" />
      </div>

      <button class="btn" :disabled="loading" @click="changePassword">Update Password</button>
    </div>
  </div>
    </div>

</template>

<script setup>
import { ref } from 'vue'
import api
 from '@/api/api';
import { Settings, User, Lock, Image } from 'lucide-vue-next'
import { useToast } from 'vue-toastification'
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
const route = useRoute()
const activeTab = ref(route.query.forceChange ? 'password' : 'profile')

const loading = ref(false);
const error = ref("");
const success = ref("");
const toast = useToast()

const form = ref({
  fullName: '',
  email: ''
})

const passwords = ref({
  current: '',
  newPass: '',
  confirm: ''
})

const updateProfile = async () => {
  error.value = "";
  success.value = "";

  if(!form.value.fullName || !form.value.email){
   error.value = "All fields are required";
   return toast.error(error.value)
  }

   try {
    loading.value = true;

   const res = await api.patch("/api/settings/me", {
      fullName: form.value.fullName,
      email: form.value.email,
    });
    console.log(res.data.user)
    success.value = "profile updated successfully";
    toast.success(success.value)
    // Clear inputs
  form.value.fullName = "";
  form.value.email = "";
  

  } catch (err) {
    console.log(err)
    error.value = err.response?.data?.message || "Something went wrong";
    toast.error(error.value)
  } finally {
    loading.value = false;
    
  }
}

const changePassword = async () => {
  error.value = "";
  success.value = "";

  if (!passwords.value.current || !passwords.value.newPass || !passwords.value.confirm) {
    error.value = "All fields are required";
    return toast.error(error.value)
  }

  if (passwords.value.newPass !== passwords.value.confirm) {
    error.value = "New passwords do not match";
    return toast.error(error.value)
  }

  console.log(passwords.value.current , passwords.value.newPass)

  try {
    loading.value = true;

    const res = await api.patch("/api/settings/change-password", {
      oldPassword: passwords.value.current,
      newPassword: passwords.value.newPass,
    });
    success.value = "Password updated successfully";
    toast.success(success.value)
    // Clear inputs
   passwords.value.current = "";
    passwords.value.newPass = "";
    passwords.value.confirm = "";

     const auth = useAuthStore();
    auth.user.mustChangePassword = false; 
    localStorage.setItem("auth", JSON.stringify(auth.user)); 

  } catch (err) {
    error.value = err.response?.data?.message || "Something went wrong";
    toast.error(error.value)
  } finally {
    loading.value = false;
    
  }
};



</script>

<style scoped>
.settings-page {
  max-width: 700px;
}

.header {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 24px;
}

.icon-wrap {
  width: 56px;
  height: 56px;
  background: #eef2ff;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon {
  color: #4f46e5;
}

.header h1 {
  margin: 0;
}

.header p {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
}

/* Tabs */
.tabs {
  background: #ffffff;
  padding: 6px;
  border-radius: 16px;
  display: flex;
  gap: 6px;
  margin-bottom: 20px;
  border: 1px solid #e5e7eb;
}

.tab {
  flex: 1;
  background: transparent;
  border: none;
  padding: 12px;
  border-radius: 12px;
  font-size: 14px;
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
}

.tab.active {
  background: #eef2ff;
  color: #4f46e5;
  font-weight: 500;
}

.tab.disabled {
  cursor: not-allowed;
  opacity: 0.4;
}

/* Card */
.card {
  background: white;
  border-radius: 18px;
  padding: 24px;
  border: 1px solid #e5e7eb;
}

/* Form */
.form-row {
  display: flex;
  gap: 16px;
}

.field {
  flex: 1;
  margin-bottom: 16px;
}

label {
  font-size: 13px;
  margin-bottom: 6px;
  display: block;
  color: #374151;
}

input {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  font-size: 14px;
}

input:focus {
  outline: none;
  border-color: #6366f1;
}

/* Buttons */
.btn {
  margin-top: 10px;
  padding: 12px 20px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  cursor: pointer;
}
.btn:disabled{
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
