<script setup>
import BusinessLayout from '../components/layout/BusinessLayout.vue';

const whiteCard = {
  class: 'pa-8',
}
const buttonStyle = {
  block: true,
  color: 'primary',
  size: 'x-large',
  class: 'my-4',
}
</script>

<template>
  <BusinessLayout title="申請完了">
    <v-card v-bind="whiteCard">
      <v-card-title class="text-h1 text-center font-weight-bold">申請が完了しました</v-card-title>
      <h3 class="text-h2 text-break">受付番号：<strong class="text-primary">REQ-20260820-001</strong></h3>

      <v-container>
        <v-row>
          <v-col>
            <v-btn v-bind="buttonStyle" variant="tonal" :to="{ name: 'home' }">ホームページへ</v-btn>
          </v-col>
          <v-col>
            <v-btn v-bind="buttonStyle" :to="{ name: 'application-list' }">申請一覧へ</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>


    <footer>
    </footer>
  </BusinessLayout>
</template>

<style scoped></style>