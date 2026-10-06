<script setup>
import BusinessLayout from '../components/layout/BusinessLayout.vue';
</script>

<template>
  <BusinessLayout title="ホーム">
    <main class="legacy-page">
        <div>
            <p class="right-text">基準日：2026年8月20日</p>
        </div>

        <section class="main-box box flex">
            <div class="main-box-info">
                <h3>社員情報</h3>
                <dl class="info-list long-text">
                    <dt>社員番号</dt>
                    <dd>EMP-00001</dd>

                    <dt>氏名</dt>
                    <dd>山田 太郎</dd>

                    <dt>所属</dt>
                    <dd>システム開発部</dd>
                </dl>
            </div>

            <div class="main-box-stat flex">
                <div class="box blue-box">
                    <p>有給残日数</p>
                    <p class="count">12</p>
                    <p>日</p>
                </div>
                <div class="box blue-box">
                    <p>申請中</p>
                    <p class="count">0</p>
                    <p>件</p>
                </div>
                <div class="box blue-box">
                    <p>当月承認済</p>
                    <p class="count">0</p>
                    <p>件</p>
                </div>
            </div>
        </section>

        <section class="middle-bar">
            <div class="middle-box box">
                <a href="apply.html">休暇を申請する</a>
                <p>新しい休暇申請を入力します</p>
            </div>

            <div class="middle-box box">
                <a href="applications.html">申請一覧を確認する</a>
                <p>申請状況を検索・確認します</p>
            </div>
        </section>

        <section class="bottom-box box">
            <h3>注意事項</h3>
            <ul>
                <li>原則として、3営業日前までに申請してください。</li>
                <li>緊急の場合は、直属の上司に連絡してください。</li>
            </ul>
        </section>
    </main>
  </BusinessLayout>
</template>

<style scoped></style>