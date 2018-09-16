
var Load_Num = 10;

Vue.filter('currency', (value) => {
    return '$' + value.toLocaleString();
});

new Vue({
    el: '#app',
    data: {
        newSearchTerm: 'anime',
        lastSearchTerm: '',
        total: 0,
        items: [],
        results: [],
        cart: [],
        loading: false
    },
    computed: {
        noMoreItems() {
            return this.items.length === this.results.length && this.results.length > 0;
        }
    },
    methods: {
        appendItems() {
            if (this.results.length === this.items.length) {
                return;
            }
            var nextResults = this.results.slice(this.items.length, this.items.length + Load_Num);
            this.items = this.items.concat(nextResults);
        },
        onSubmit() {
            var me = this;

            if (!me.newSearchTerm) {
                return;
            }

            me.items = [];
            me.loading = true;
            axios.get('/search/' + me.newSearchTerm)
                .then(response => {
                    var searchResults = response.data;
                    searchResults.map(item => {
                        item.price = 0.99;
                    });
                    me.results = searchResults;
                    me.appendItems();
                    me.lastSearchTerm = me.newSearchTerm;
                    me.loading = false;
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
    },
    mounted() {
        var me = this;
        // run search on launch
        me.onSubmit();

        // load more on scroll
        var scrollEl = document.getElementById('product-list-bottom');
        var watcher = scrollMonitor.create(scrollEl);
        watcher.enterViewport(function() {
            me.appendItems();
        });
    }
});
