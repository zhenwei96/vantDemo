<script>
export default {
    name: 'ItemCard',
    functional: true,
    render(...res) {
        const context = res[1];
        return (
            <div class='wrap'>
                <van-row>
                    {context.props.productList.map(item => (
                        <van-col span='12'>
                            <van-image src={item.productImage} />
                            <div class='van-multi-ellipsis--l2 margin12'>{item.productName}</div>
                        </van-col>
                    ))}
                </van-row>
            </div>
        );
    },
};
</script>

<style lang="scss" scoped>
.margin12 {
    margin: 12px;
}
</style>
