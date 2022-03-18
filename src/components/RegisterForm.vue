<script setup>
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { supabase } from "@/supabase";

const router = useRouter();

const email = ref("");
const username = ref("");
const password = ref("");
const error = ref(null);

async function handleSignUp() {
  try {
    const { error: authError } = await supabase.auth.signUp(
      {
        email: email.value,
        password: password.value,
      },
      {
        data: {
          username: username.value,
        },
      }
    );

    if (authError) {
      error.value = authError;
      return;
    }

    router.push({ name: "login" });
  } catch (error) {
    console.error(error.message);
  }
}
</script>

<template>
  <div class="register-container">
    <h1>Sign up</h1>
    <h2 v-if="error">{{ error.message }}</h2>

    <form class="register-form" @submit.prevent="handleSignUp">
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
        <label for="username">username</label>
        <input
          type="username"
          name="username"
          id="username"
          placeholder="username"
          v-model="username"
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

      <div class="form-input">
        <label for="password">confirm password</label>
        <input
          type="password"
          name="confirm-password"
          id="confirm-password"
          placeholder="confirm password"
        />
      </div>

      <button type="submit" class="register-submit">Sign up</button>
    </form>

    <div class="login-link">
      <p>
        Have an account already?
        <RouterLink :to="{ name: 'login' }">Log in</RouterLink>
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.register-container {
  padding: 2rem;
  background: black;
  width: 500px;
  border-radius: 15px;

  h1,
  h2 {
    padding-left: 1.2rem;
  }

  .login-link {
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

.register-form {
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

  .register-submit {
    display: block;
    width: 100%;
    height: 50px;
    border-radius: 50px;
    margin-top: 3rem;
  }
}
</style>
