
Vue.filter('currency', (value) => {
    return '$' + value.toLocaleString();
});

new Vue({
    el: '#app',
    data: {
        total: 0,
        items: [
            { id: 1, title: 'something 1', price: 3.22},
            { id: 2, title: 'something 2', price: 4.33},
            { id: 3, title: 'something 3', price: 5.44}
        ],
        cart: []
    },
    methods: {
        addToCart(index) {
            var item = this.items[index];

            var cartItem = null;

            for(var i = 0; i < this.cart.length; i++) {
                if (this.cart[i].id === item.id) {
                    cartItem = this.cart[i];
                    cartItem.qty++;
                }
            }

            if (!cartItem) {
                cartItem = {
                    id: item.id,
                    title: item.title,
                    price: item.price,
                    qty: 1
                };
                this.cart.push(cartItem);
            }

            this.total += item.price;
        }
    }
});
