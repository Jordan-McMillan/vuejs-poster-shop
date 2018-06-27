
Vue.filter('currency', (value) => {
    return '$' + value.toLocaleString();
});

new Vue({
    el: '#app',
    data: {
        searchTerm: '',
        total: 0,
        items: [],
        cart: []
    },
    methods: {
        onSubmit() {
            var me = this;
            axios.get('/search/' + this.searchTerm)
                .then(response => {
                    var searchResults = response.data;
                    me.items = searchResults;
                    me.items.map(item => {
                        item.price = 0.99;
                    });
                });
        },
        increment(item) {
            item.qty++;
        },
        decrement(item) {
            item.qty--;

            if (item.qty <= 0) {
                var cartItemIndex = -1;
                for (var i = 0; i < this.cart.length; i++) {
                    if (this.cart[i].id === item.id) {
                        cartItemIndex = i;
                        break;
                    }
                }
                if (cartItemIndex > -1)
                    this.cart.splice(cartItemIndex, 1);
            }
        },
        addToCart(index) {
            var item = this.items[index];

            var cartItem = null;

            for (var i = 0; i < this.cart.length; i++) {
                if (this.cart[i].id === item.id) {
                    cartItem = this.cart[i];
                    cartItem.qty++;
                    break;
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
