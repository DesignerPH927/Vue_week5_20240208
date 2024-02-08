
export default {
  props: ['tempModal', 'addCartModal', 'isLoading'],
  data() {
    return {
      modal: '',
      qty: 1,
    };
  },
  watch: {
    tempModal () {
      this.qty = 1
    }
  },
  methods: {
    show() {
      this.modal.show();
    },
    close() {
      this.modal.hide();
    },
  },
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.pModal, {
      keyboard: false,
    });
  },
  template: `
    <!-- Modal -->
    <div class="modal fade" ref="pModal">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header bg-primary">
            <h1 class="modal-title fs-5 text-white">
              {{tempModal.title}}
            </h1>
            <button type="button" class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div className="row align-items-center">
              <div className="col-md-6">
                <img :src="tempModal.imageUrl"
                :alt="tempModal.title"
                className="img-fluid"
                style="width:500px"
                />
              </div>
              <div className="col-md-5">
                <div className="mb-3">
                  <h5 className="card-title fw-bold">
                    商品描述：
                  </h5>
                  <p className="mb-0">
                    {{tempModal.description}}
                  </p>
                </div>
                <div className="mb-3">
                  <h5 className="card-title fw-bold">
                    商品內容：
                  </h5>
                  <p className="mb-0">
                    {{tempModal.content}}
                  </p>
                </div>
                <div className="mb-3">
                  <div v-if="tempModal.origin_price ===
                  tempModal.price">
                    <p className="mb-0 fw-bold">
                      原價{{tempModal.origin_price}}元
                    </p>
                  </div>
                  <div v-else>
                    <del className="mb-0 text-muted">
                      原價{{tempModal.origin_price}}元
                    </del>
                    <p className="mb-0 fw-bold">
                      現在只要{{tempModal.price}}元
                    </p>
                  </div>
                  <div className="mb-4">
                    <hr />
                  </div>
                </div>
                <div className="input-group">
                  <select className="form-select" v-model="qty">
                    <option :value="i" v-for="i in 50" :key="i"
                    >{{i}}</option>
                  </select>
                  <button className="btn btn-primary"
                  type="button"
                  @click="addCartModal(tempModal, qty)"
                  >
                  <span
                  v-if="tempModal.id === isLoading"
                  class="spinner-border
                  spinner-border-sm"
                  aria-hidden="true"></span>
                  加入購物車</button>
                </div>
              </div>
            </div>
          </div>          
        </div>
      </div>
    </div>
  `,
};