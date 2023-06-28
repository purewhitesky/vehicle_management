<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { mdiAccount, mdiAsterisk } from "@mdi/js";
import SectionFullScreen from "@/components/SectionFullScreen.vue";
import CardBox from "@/components/CardBox.vue";
import CardBoxComponentTitle from "@/components/CardBoxComponentTitle.vue";
import FormCheckRadio from "@/components/FormCheckRadio.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import LayoutGuest from "@/layouts/LayoutGuest.vue";

import { useMainStore } from "@/stores/main";
//useMainStore().setPermissions("1");
//console.log()
const form = reactive({
  login: "Joun",
  pass: "abcd1234",
  remember: true,
});

const router = useRouter();

const submit = () => {
  router.push("/");
};
</script>

<template>
  <LayoutGuest>
    <SectionFullScreen v-slot="{ cardClass }" bg="purplePink">
      <CardBox :class="cardClass" is-form @submit.prevent="submit">
        <CardBoxComponentTitle title="Create account"></CardBoxComponentTitle>
        <FormField label="Your name" help="Please enter your name">
          <FormControl :icon="mdiAccount" name="name" autocomplete="username" />
        </FormField>

        <FormField label="Your Email" help="Please enter your Email">
          <FormControl
            :icon="mdiAccount"
            name="email"
            autocomplete="useremail"
          />
        </FormField>

        <FormField label="Your cellphone" help="Please enter your cellphone">
          <FormControl
            :icon="mdiAccount"
            name="phone"
            autocomplete="userphone"
          />
        </FormField>

        <FormField
          label="Your Password"
          help="Passwords must be at least 6 characters."
        >
          <FormControl
            :icon="mdiAsterisk"
            type="password"
            name="password"
            autocomplete="current-password"
          />
        </FormField>

        <FormField
          label="Password Check"
          help="Please enter your password again"
        >
          <FormControl :icon="mdiAsterisk" type="password" />
        </FormField>

        <template #footer>
          <BaseButtons>
            <BaseButton type="submit" color="info" label="continue" />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionFullScreen>
  </LayoutGuest>
</template>
