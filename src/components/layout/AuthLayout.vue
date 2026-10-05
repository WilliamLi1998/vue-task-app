<script setup>

</script>

<template>
  <v-app>
    <v-app-bar color="primary">
      <v-app-bar-title>有給休暇申請システム</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <v-container class="py-6">
        <h1 class="text-h4">ログイン</h1>
        <v-card title="" text="" class="pa-8">
          <slot></slot>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped></style>