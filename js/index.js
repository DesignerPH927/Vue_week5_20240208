// 步驟：
// 1. 切版 v
// 2. 取得遠端資料並渲染 v
// 3. 製作 modal 及 modal內容 v
// 4. 加入購物車(需看API文件) v
// 5. 取得購物車資料並渲染 v
// 6. 調整 modal、購物車數量(需看API文件) v
// 7.刪除單一、全購物車品項(需看API文件) v
// 8. 加上loading效果 v
// 9. 製作表單驗證 v



const apiUrl = 'https://vue3-course-api.hexschool.io/v2'
const apiPath = 'vuejs2024';

import pModal from './productModal.js'


Object.keys(VeeValidateRules).forEach((rule) => {
  if (rule !== 'default') {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});

// 讀取外部的資源
VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});


const app = Vue.createApp({
  data() {
    return {
      remoteData: [],
      tempProduct: {},
      carts: [],
      status: {
        addToCartLoading: '',
        delCartLoading: '',
      },
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: ''
      },
    };
  },
  components: {
    pModal,
  },
  methods: {
    getRemoteData() {
      axios(`${apiUrl}/api/${apiPath}/products/all`)
        .then((res) => {
          // console.log('已取得產品', res);
          this.remoteData = res.data.products;
        })
        .catch((err) => {
          alert('未取得產品', err.response.data.message);
        });
    },
    openModal(product) {
      // console.log(product);
      this.tempProduct = product;
      this.$refs.pModal.show();
    },
    // 以下加入的是產品內容
    addToCart(product, qty = 1) {
      // console.log(product, qty);
      const cartData = {
        product_id: product.id,
        qty,
      };
      this.status.addToCartLoading = product.id;
      // console.log(cartData);
      axios
        .post(`${apiUrl}/api/${apiPath}/cart`, { data: cartData })
        .then((res) => {
          // alert('已加入購物車', res);
          this.status.addToCartLoading = '';
          this.$refs.pModal.close();
          this.getCarts();
        })
        .catch((err) => {
          alert('未加入購物車', err.response);
        });
    },
    getCarts() {
      axios(`${apiUrl}/api/${apiPath}/cart`)
        .then((res) => {
          // console.log('取得購物車資料', res);
          this.carts = res.data.data;
        })
        .catch((err) => {
          alert('未取得購物車資料', err.response);
        });
    },
    // 以下變更的是購物車內容
    changeQty(cart, qty = 1) {
      // console.log(cart, qty);
      const cartData = {
        product_id: cart.product_id,
        qty,
      };
      // console.log(cartData);
      axios
        .put(`${apiUrl}/api/${apiPath}/cart/${cart.id}`, { data: cartData })
        .then((res) => {
          // console.log('已變更購物車數量', res);
          this.getCarts();
        })
        .catch((err) => {
          alert('未變更購物車數量', err.response);
        });
    },
    delCart(id) {
      // console.log(id);
      axios
        .delete(`${apiUrl}/api/${apiPath}/cart/${id}`)
        .then((res) => {
          alert('已刪除單一購物車品項', res);
          this.getCarts();
        })
        .catch((err) => {
          alert('未刪除單一購物車品項', err.response);
        });
    },
    delCarts() {
      this.status.delCartLoading = this.carts;
      axios
        .delete(`${apiUrl}/api/${apiPath}/carts`)
        .then((res) => {
          this.status.delCartLoading = '';
          alert('已刪除全購物車品項', res);
          this.getCarts();
        })
        .catch((err) => {
          alert('未刪除購物車品項', err.response);
        });
    },
    isPhone(value) {
      const phoneNumber = /^(09)[0-9]{8}$/
      return phoneNumber.test(value) ? true : '請輸入正確的電話號碼'
    },
    onSubmit () {
      // console.log(this);
      const sendData = this.form
      axios.post(`${apiUrl}/api/${apiPath}/order`, { data: sendData })
        .then((res) => {
          alert("已建立訂單囉", res);
          this.$refs.form.resetForm()
          this.getCarts()
        })
        .catch((err) => {
          alert("未送表單", err.response);
        })
    },
    resetForm () {
      this.$refs.form.resetForm()
    }
  },
  mounted() {
    this.getRemoteData();
    this.getCarts();
  },
});



app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);


app.mount('#app')