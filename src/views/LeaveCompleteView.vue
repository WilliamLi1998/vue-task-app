<script setup>
import BusinessLayout from '../components/layout/BusinessLayout.vue';
</script>

<template>
  <BusinessLayout title="申請完了">
    <main class="legacy-page">
      <section class="box">
        <p class="center-large-text">申請が完了しました</p>
        <h3 class="long-text">受付番号：<strong>REQ-20260820-001</strong></h3>

        <p class="confirm-button">
          <a href="index.html" class="secondary-button-link">ホームページへ</a>
          <a href="applications.html" class="main-button-link">申請一覧へ</a>
        </p>
      </section>

    </main>

    <footer>
      <p>現在のHTML段階では、申請内容をサーバーまたはブラウザに保存する処理は実装していません。</p>
    </footer>
  </BusinessLayout>
</template>

<style scoped></style>