<script setup>
import BusinessLayout from "../components/layout/BusinessLayout.vue";
</script>

<template>
	<BusinessLayout title="申請一覧">
		<main class="legacy-page">
			<section class="confirm-button">
				<p></p>
				<p>
					<a href="apply.html" class="main-button-link">新規申請</a>
				</p>
			</section>

			<section class="wrap">
				<table class="borderless-table">
					<!-- <caption>申請一覧</caption> -->
					<thead>
						<tr class="box deep-blue-box">
							<th scope="col">受付番号</th>
							<th scope="col">休暇種別</th>
							<th scope="col">休暇期間</th>
							<th scope="col">申請日数</th>
							<th scope="col">状態</th>
						</tr>
					</thead>
					<tbody class="box">
						<tr>
							<td>REQ-20260710-001</td>
							<td>有給休暇</td>
							<td>2026/07/24</td>
							<td>1日</td>
							<td>承認済</td>
						</tr>
						<tr>
							<td>REQ-20260801-001</td>
							<td>半日休暇（午後）</td>
							<td>2026/08/07</td>
							<td>0.5日</td>
							<td>承認済</td>
						</tr>
						<tr>
							<td>REQ-20260812-002</td>
							<td>有給休暇</td>
							<td>2026/08/22～2026/08/23</td>
							<td>2日</td>
							<td>申請中</td>
						</tr>
					</tbody>
				</table>
			</section>
		</main>
	</BusinessLayout>
</template>

<style scoped></style>
