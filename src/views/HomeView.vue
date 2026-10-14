<script setup>
import BusinessLayout from '../components/layout/BusinessLayout.vue';

const blueCard = {
    class: 'pa-4',
    color: 'primary',
    variant: 'tonal',
}
const blueTitle = {
    class: ['text-wrap', 'px-0'],
}
const blueNumber = {
    class: ['text-primary', 'font-weight-bold'],
}

const whiteCard = {
    class: 'pa-8',
}
</script>

<template>
    <BusinessLayout title="ホーム">
        <div>
            <p class="text-right">基準日：2026年8月20日</p>
        </div>

        <v-card title="社員情報" v-bind="whiteCard">
            <v-container>
                <v-row>
                    <v-col cols="12" md="4">
                        <v-list>
                            <v-list-item title="社員番号">EMP-00001</v-list-item>
                            <v-list-item title="氏名">山田 太郎</v-list-item>
                            <v-list-item title="所属">システム開発部</v-list-item>
                        </v-list>
                    </v-col>
                    <v-col cols="12" md="8">
                        <v-container class="text-center">
                            <v-row>
                                <v-col cols="12" md="4">
                                    <v-card v-bind="blueCard">
                                        <v-card-title v-bind="blueTitle">有給残日数</v-card-title>
                                        <p v-bind="blueNumber">12</p>
                                        <p>日</p>
                                    </v-card>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-card v-bind="blueCard">
                                        <v-card-title v-bind="blueTitle">申請中</v-card-title>
                                        <p v-bind="blueNumber">0</p>
                                        <p>件</p>
                                    </v-card>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-card v-bind="blueCard">
                                        <v-card-title v-bind="blueTitle">当月承認済</v-card-title>
                                        <p v-bind="blueNumber">0</p>
                                        <p>件</p>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-col>
                </v-row>
            </v-container>
        </v-card>

        <v-container class="px-0">
            <v-row>
                <v-col cols="12" md="6">
                    <v-card :to="{ name: 'leave-apply' }" hover title="休暇を申請する" text="新しい休暇申請を入力します" v-bind="whiteCard" />
                </v-col>
                <v-col cols="12" md="6">
                    <v-card :to="{ name: 'leave-confirm' }" hover title="申請一覧を確認する" text="申請状況を検索・確認します" v-bind="whiteCard" />
                </v-col>
            </v-row>
        </v-container>

        <v-card title="注意事項" v-bind="whiteCard">
            <v-list>
                <v-list-item title="原則として、3営業日前までに申請してください。" />
                <v-list-item title="緊急の場合は、直属の上司に連絡してください。" />
            </v-list>
        </v-card>
    </BusinessLayout>
</template>

<style scoped>
</style>