<script setup>
defineProps({
  title:{ type:String, required: true}
})
</script>

<template>
  <v-app>
    <v-app-bar color="primary">
      <v-app-bar-title class="font-weight-bold">有給休暇申請システム</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <v-container class="py-6">
        <h1 class="text-h4">{{title}}</h1>
        <v-card class="pa-8">
          <slot></slot>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped></style>