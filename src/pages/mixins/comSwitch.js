
export default {
    
    watch : {
        /**
         * 处理视图切换
         */
        '$route' : {
            handler ( route ) {
                if ( typeof this.component_status !== 'object' ) {
                    /* eslint-disable no-console */
                    console.warn( '视图状态对象component_status未声明' );
                    return;
                    /* eslint-disable no-console */
                }
                if ( route.meta && route.meta.components ) {
                    for ( let key of Object.keys( this.component_status ) ) {
                        this.component_status[key] = ( route.meta.components.indexOf( key ) !== -1 );
                    }
                }
            },
            immediate : true,
        }
    }
}
