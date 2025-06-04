import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::order.order', ({ strapi }) => ({
  async create(ctx) {
    const { data } = ctx.request.body;

    // 1. Find last order to get the latest order number
    const lastOrder = await strapi.entityService.findMany('api::order.order', {
      sort: { createdAt: 'desc' },
      limit: 1,
      fields: ['orderNo'],
    });

    let lastNumber = 0;
    if (lastOrder.length && lastOrder[0].orderNo) {
      const match = lastOrder[0].orderNo.match(/ORD(\d{6})/);
      if (match) {
        lastNumber = parseInt(match[1], 10);
      }
    }

    // 2. Generate new order number
    const newNumber = lastNumber + 1;
    const orderNo = `ORD${String(newNumber).padStart(6, '0')}`;

    // 3. Generate a simple unique order ID (optional)
    const orderId = `ORDER-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;

    // 4. Inject into data
    data.orderNo = orderNo;
    data.orderId = orderId;

    // 5. Call the default create method with the updated data
    const response = await super.create(ctx);
    return response;
  },
}));

