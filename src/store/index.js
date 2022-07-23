import { createStore } from "vuex";

export default createStore({
    state: {
        accessToken: ''
    },
    // getters: {
    //     time2(state) {
    //         return state.counter * 2;
    //     }
    // },
    mutations: {
        // const urlParams = new URL(location.href).searchParams;
        // const accessToken = urlParams.get('access_token');
        // this.cookies.set("accessToken", accessToken);
        //
        // var access = this.cookies.get("accessToken")
        getAccessToken(state, access) {
            state.accessToken = access;
        }
    }
});