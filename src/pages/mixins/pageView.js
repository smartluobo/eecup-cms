import { resetStoreModule } from 'vuex-declaration'

export default {
    methods : {
        getSysView() {
            const view = {
                state : this.$store.state,
                path : this.$route.path,
            }

            return view;
        },

        setSysView( view ) {
            // 跳转页面
            this.$router.replace( { path : view.path } );

            var stateGroup = {};
            var commentGroup = {};

            var state = view.state;
            for ( let moduleName in state ) {
                for ( let stateName in state[moduleName] ) {
                    stateGroup[stateName] = { module : moduleName };

                    commentGroup[stateName] = state[moduleName][stateName];
                }
            }

            // 重置store
            resetStoreModule ( this.$store, stateGroup );

            for ( let stateName in commentGroup ) {
                this.$store.commit( stateName, commentGroup[stateName] );
            }
        }
    }
}
