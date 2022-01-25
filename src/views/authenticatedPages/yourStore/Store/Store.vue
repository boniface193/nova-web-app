<template>
    <div class="store-page">
        <div class="store-page__header">
            <h4 class="store-name">Store name</h4>
            <v-btn height="40" class="copy-store-link">Copy link</v-btn>
        </div>
        <h4 class="mt-2">Products</h4>
    </div>
</template>
<script>
export default {
    name: "Store"
}
</script>
<style lang="scss" scoped>
.store-page{
    &__header{
        position: relative;
        width: 100%;
        height: 50px;
        display: flex;
        justify-content: end;
        .store-name{
            position: absolute;
            left: 0;
            right: 0;
            margin: auto;
            color: #FFA500;
            width: max-content;
            top: 10px;
        }
        .copy-store-link{
            background:#F5F5F5;
        }
    }
}
</style>