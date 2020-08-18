export default  [
  {
    path: '/admin',
    name: 'admin权限',
    children: [
      {
        name: '用户管理',
        path: '/admin/user',
        children: [],
      },
      {
        name: '角色管理',
        path: '/admin/role',
        children: [],
      },
      {
        name: '菜单管理',
        path: '/admin/menu',
        children: [],
      },
    ],
  },
  {
    path: '/freeUser',
    name: '免支付用户',
  },
  {
    path: '/order',
    name: '订单管理',
    children: [
      {
        path: '/order/list',
        name: '订单列表',
        children: [
          
        ],
      }
    ],
  },
  {
    path: '/goodsList',
    name: '商品列表',
    children: [
      
    ],
  },
  {
    path: '/shopList',
    name: '店铺列表',
    children: [
      
    ],
  },
  {
    path: '/sku',
    name: 'sku管理',
    children: [
      {
        name: 'sku类型列表',
        path: '/sku/skuType',
        children: [],
      },
      {
        name: 'sku明细列表',
        path: '/sku/detail',
        children: [],
      },
    ],
  },
  {
    path: '/active',
    name: '活动管理',
    children: [
      
    ],
  },
  {
    path: '/category',
    name: '分类列表',
    children: [
      
    ],
  },
  {
    path: '/carousel',
    name: '首页轮播配置',
    children: [
      
    ],
  },
  {
    path: '/experience',
    name: '体验券',
    children: [
      
    ],
  },
  {
    path: '/coupon',
    name: '优惠券',
    children: [
      
    ],
  },
  {
    path: '/shopStorage',
    name: '库存管理',
    children: [
      
    ],
  },
  {
    path: '/asset',
    name: '资产管理',
    children: [
      {
        name: '打印机管理',
        path: '/asset/print',
        children: [],
      },
    ],
  },
  {
    path: '/userList',
    name: '用户列表',
    children: [
      
    ],
  },
  {
    path: '/preferentialCompany',
    name: '优惠企业列表',
    children: [
      
    ],
  },
  {
    path: '/recommend',
    name: '推荐管理',
    children: [
      
    ],
  },
  {
    path: '/reportForms',
    name: '统计报表',
    children: [
      {
        path: '/turnoverForms',
        name: '营业额统计',
        children: [
          
        ],
      },
      {
        path: '/orderForms',
        name: '订单统计',
        children: [
          
        ],
      },
    ],
  },
  // Preferential company
]