<script setup>
import BusinessLayout from '../components/layout/BusinessLayout.vue';
</script>

<template>
  <BusinessLayout title="申請内容確認">
    <main class="legacy-page">
      <section class="box">
        <table class="row-table">
          <tbody>
            <tr>
              <th scope="row">休暇種別</th>
              <td>有給休暇</td>
            </tr>
            <tr>
              <th scope="row">開始終了日</th>
              <td>2026年8月24日至25日</td>
            </tr>
            <tr>
              <th scope="row">休暇期間</th>
              <td>2日</td>
            </tr>
            <tr>
              <th scope="row">申請理由</th>
              <td>私用</td>
            </tr>
            <tr>
              <th scope="row">引継ぎ状況</th>
              <td>引继完成</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <p class="confirm-button">
          <a href="apply.html" class="secondary-button-link">修正する</a>
          <a href="complete.html" class="main-button-link">申請する</a>
        </p>
      </section>
    </main>

    <footer>
    </footer>
  </BusinessLayout>
</template>

<style scoped></style>