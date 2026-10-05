<script setup>
import BusinessLayout from '../components/layout/BusinessLayout.vue';
</script>

<template>
  <BusinessLayout>
    <main class="legacy-page">
      <div>
        <h2>休暇申請</h2>
      </div>

      <section class="box">
        <form id="apply-form" action="confirm.html" method="get" novalidate>
          <p id="paidLeaveDaysError" class="error-message"></p>
          <p>
            <label for="leave-type">休暇種別 <span>必須</span></label>
            <select id="leave-type" name="leave-type" aria-describedby="leaveTypeError" aria-invalid="false" required>
              <option value="">お選びください</option>
              <option value="paid">有給休暇</option>
              <option value="half-am">半日休暇（午前）</option>
              <option value="half-pm">半日休暇（午後）</option>
              <option value="special">特別休暇</option>
            </select>
          </p>
          <p id="leaveTypeError" class="error-message"></p>

          <div class="date-bar">
            <p>
              <label for="beginning-date">開始日 <span>必須</span></label>
              <input id="beginning-date" name="beginnign-date" type="date" aria-describedby="beginningDateError"
                aria-invalid="false" required>
            </p>
            <p>
              <label for="ending-date">終了日 <span>必須</span></label>
              <input id="ending-date" name="ending-date" type="date" aria-describedby="endingDateError"
                aria-invalid="false" required>
            </p>
          </div>
          <p id="beginningDateError" class="error-message"></p>
          <p id="endingDateError" class="error-message"></p>

          <p>
            <label for="reason">申請理由 <span>必須</span></label>
            <textarea id="reason" name="reason" rows="4" cols="40" maxlength="200" aria-describedby="reasonError"
              aria-invalid="false" required></textarea>
          </p>
          <p id="reasonError" class="error-message"></p>

          <fieldset id="handover" aria-describedby="handoverError" aria-invalid="false">
            <legend>引継ぎ状況 <span>必須</span></legend>
            <div class="fieldset-content">
              <div class="flex">
                <input id="finish" name="handover" type="radio" value="finish" required>
                <label for="finish">対応済</label>
              </div>
              <div class="flex">
                <input id="unneeded" name="handover" type="radio" value="unneeded">
                <label for="unneeded">対応不要</label>
              </div>
            </div>
          </fieldset>
          <p id="handoverError" class="error-message"></p>

          <p>
            <label for="notice">連絡事項</label>
            <textarea id="notice" name="notice" rows="5" cols="40" maxlength="300" aria-describedby="noticeError"
              aria-invalid="false"></textarea>
          </p>
          <p id="noticeError" class="error-message"></p>

          <button type="submit" id="apply-button">申請する</button>
        </form>
      </section>
    </main>

    <footer>
      <p>現在は確認画面の動作確認のため、固定のテストデータを表示しています。</p>
    </footer>
  </BusinessLayout>
</template>

<style scoped></style>