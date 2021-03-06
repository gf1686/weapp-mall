const { regeneratorRuntime } = global;

const app = getApp();
Page({
    data: {
        scrollLeft: 0,
        currIndex: 0,
        navItem: [
            {name: '今日精选', id: 'a'},
            {name: '手机数码', id: 'b'},
            {name: '电脑办公', id: 'c'},
            {name: '家用电器', id: 'd'},
            {name: '服饰内衣', id: 'e'},
            {name: '个护化妆', id: 'f'},
            {name: '运动户外', id: 'g'},
            {name: '母婴呵护', id: 'h'},
            {name: '家居家装', id: 'i'},
            {name: '礼品箱包', id: 'j'},
            {name: '珠宝首饰', id: 'k'}
        ],
        banner: [
            '//m.360buyimg.com/mobilecms/s750x366_jfs/t1/23360/8/4031/468576/5c2dc861E189161bc/bac4293f6060aa5f.jpg!cr_1125x549_0_72!q70.jpg.dpg',
            '//m.360buyimg.com/mobilecms/s750x366_jfs/t1/28271/11/4014/197362/5c2dece0E62c983d6/63877ba3cf1d8e36.jpg!cr_1125x549_0_72!q70.jpg.dpg',
            '//m.360buyimg.com/mobilecms/s750x366_jfs/t23554/196/252614617/149239/73b66270/5b2a6ecdNc10d686b.jpg!cr_1125x549_0_72!q70.jpg.dpg',
            '//m.360buyimg.com/mobilecms/s750x366_jfs/t1/28339/2/4203/79668/5c2f0645E57c94f60/78268550cb01f021.jpg!cr_1125x549_0_72!q70.jpg.dpg',
        ]
    },

    // 切换导航类目
    async changeNav(e) {
        let viewWidth = 375,     // 屏幕的宽
            halfViewWidth = viewWidth / 2;

        let currNode = await this.boundingClientRectSync(`#${e.currentTarget.id}`);   // 选中节点的属性

        // 选中节点的前面所有节点的宽度之和
        let beforeAllWidth = e.currentTarget.offsetLeft;

        // 偏移量
        let scrollLeft = beforeAllWidth - halfViewWidth + currNode.width / 2;
        scrollLeft < 0 && (scrollLeft = 0);

        this.setData({
            currIndex: e.currentTarget.dataset.index,
            scrollLeft: scrollLeft
        });
    },

    // 同步获取元素的属性
    boundingClientRectSync(selector) {
        return new Promise((resolve, reject) => {
            wx.createSelectorQuery().select(selector).boundingClientRect(function (rect) {
                resolve(rect);
            }).exec();
        });
    }
});
