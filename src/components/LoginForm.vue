<script setup>
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { supabase } from "../supabase";
import { useAuthStore } from "../stores/auth";

const router = useRouter();

const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const error = ref({});
const loading = ref(false);

async function handleLogin() {
  try {
    const { user, error: authError } = await supabase.auth.signIn({
      email: email.value,
      password: password.value,
    });

    if (authError) {
      error.value = authError;
      return;
    }

    authStore.user = user;

    router.push({ name: "home" });
  } catch (error) {
    console.error(error.message);
  }
}
</script>

<template>
  <div class="login-container">
    <h1>Sign in</h1>
    <h2 v-if="error">{{ error.message }}</h2>

    <form class="login-form" @submit.prevent="handleLogin">
      <div class="form-input">
        <label for="email">email</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="email"
          v-model="email"
        />
      </div>

      <div class="form-input">
        <label for="password">password</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="password"
          v-model="password"
        />
      </div>

      <button type="submit" :disabled="loading" class="login-submit">
        Login
      </button>
    </form>

    <div class="sign-up-link">
      <p>
        Don't have an account?
        <RouterLink :to="{ name: 'register' }">Sign up</RouterLink>
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-container {
  padding: 2rem;
  background: black;
  width: 500px;
  border-radius: 15px;

  h1,
  h2 {
    padding-left: 1.2rem;
  }
  .sign-up-link {
    padding-top: 2rem;
    text-align: center;

    a {
      color: white;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.login-form {
  .form-input {
    display: flex;
    flex-direction: column;
    margin: 1rem 0;

    label {
      padding-left: 1.2rem;
      margin-bottom: 0.5rem;
    }

    input {
      font-size: 1.2rem;
      height: 50px;
      border-radius: 50px;
      padding-left: 1.2rem;
    }
  }

  .login-submit {
    display: block;
    width: 100%;
    height: 50px;
    border-radius: 50px;
    margin-top: 3rem;
  }
}
</style>
