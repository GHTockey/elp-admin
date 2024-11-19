import { defineStore } from 'pinia';
import { store } from '../index';
import { NavData } from '@/api/other/types';


// nav数据类型
interface OtherState {
    navs: NavData
    tableRowData: any
};


export const useOtherStore = defineStore('other', {
    state: (): OtherState => {
        return {
            navs: {} as NavData,
            tableRowData: {}
        }
    },
    getters: {
        getNavs(): NavData {
            return this.navs
        },
        getTableRowData(): any {
            return this.tableRowData
        }
    },
    actions: {
        setNavs(navs: NavData) {
            this.navs = navs
        },
        setTableRowData(data: any) {
            this.tableRowData = data
        }
    },
    // persist: true
});

export const useOtherStoreWithOut = () => {
    return useOtherStore(store)
};
