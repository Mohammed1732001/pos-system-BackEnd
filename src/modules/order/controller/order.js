import orderModel from "../../../DB/models/order.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import productModel from "../../../DB/models/product.model.js";


export const openOrder = asyncHandler(async (req, res, next) => {
  const order = await orderModel.find({ status: "open" }).populate("tableId").populate("cashierId").populate("items.productId")
  res.status(200).json({ message: "Done", order })
})

export const transeferOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const { itemId, orderId, quantity } = req.body
  if (!itemId) {
    return next(new Error("please send all item"))
  }
  if (!orderId) {
    return next(new Error("please send all order"))
  }
  if (!quantity) {
    return next(new Error("please send all quantaty"))
  }
  const currentOrder = await orderModel.findById(id)
  if (!currentOrder || currentOrder.status === "closed") {
    return next(new Error("order not found or order is closed"))
  }
  const targetOrder = await orderModel.findById(orderId);
  if (!targetOrder || targetOrder.status === "closed") {
    return next(new Error("order not found or order is closed"))

  }
  const currentItemIndex = currentOrder.items.findIndex(
    (item) => item.productId.toString() === itemId
  );
  if (currentItemIndex === -1) {
    return next(new Error("product not found in current order"));
  }
  const currentItem = currentOrder.items[currentItemIndex];
  if (quantity > currentItem.quantity) {
    return next(new Error("quantity is more than current quantity"));
  }

  // تحديث كمية المنتج في الأوردر الحالي
  if (quantity === currentItem.quantity) {
    // حذف المنتج تماماً من الأوردر الحالي
    currentOrder.items.splice(currentItemIndex, 1);
  } else {
    // تقليل الكمية فقط
    currentOrder.items[currentItemIndex].quantity -= quantity;
  }

  const targetItemIndex = targetOrder.items.findIndex(
    (item) => item.productId.toString() === itemId
  );

  if (targetItemIndex === -1) {
    // إذا المنتج غير موجود في الأوردر الهدف، نضيفه بكمية جديدة
    targetOrder.items.push({
      productId: itemId,
      quantity: quantity,
      price: currentItem.price, // أو حسب السعر المطلوب
    });
  } else {
    // إذا المنتج موجود، نزود الكمية
    targetOrder.items[targetItemIndex].quantity += quantity;
  }

  await orderModel.updateOne({ _id: id }, { items: currentOrder.items });
  await orderModel.updateOne({ _id: orderId }, { items: targetOrder.items });

  res.status(200).json({ message: "transfer is success" });


})

export const createOrder = asyncHandler(async (req, res, next) => {
  const order = await orderModel.create(req.body)
  res.status(200).json({ message: "Done", order })
})

export const getOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  if (!id) {
    return next(new Error("id is required"))
  }
  const order = await orderModel.findById(id).populate("tableId").populate("items.productId")
  if (!order) {
    return next(new Error("order not found"))
  }
  res.status(200).json({ message: "Done", order })

})
export const getAllOrder = asyncHandler(async (req, res, next) => {
  const order = await orderModel.find().populate("tableId").populate("cashierId").populate("items.productId")
  res.status(200).json({ message: "Done", order })
})
export const deleteOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  if (!id) {
    return next(new Error("id is required"))
  }
  const order = await orderModel.findById(id)
  if (!order) {
    return next(new Error("order not found"))
  }
  const deletedOrder = await orderModel.findByIdAndDelete(id)
  res.status(200).json({ message: "Done Deleted" })

})


export const addItemToOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  let items = [];

  if (Array.isArray(req.body.items)) {
    // الحالة: مجموعة منتجات
    items = req.body.items;
  } else if (req.body.productId) {
    // الحالة: منتج واحد
    items = [
      {
        productId: req.body.productId,
        quantity: req.body.quantity || 1,
      },
    ];
  } else {
    return next(new Error("Invalid request format: provide items or productId"));
  }

  // العثور على الطلب
  const order = await orderModel.findById(id);
  if (!order) {
    return next(new Error("Order not found"));
  }
  if (order.status === "closed") {
    return next(new Error("Order is closed"));

  }
  order.items = order.items || [];

  for (const newItem of items) {
    const { productId, quantity } = newItem;
    const product = await productModel.findById(productId);

    if (!product) {
      return next(new Error(`Product not found: ${productId}`));
    }

    const qty = quantity || 1;
    const price = product.price;

    const existingItemIndex = order.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (existingItemIndex > -1) {
      // المنتج موجود بالفعل، نزيد الكمية
      order.items[existingItemIndex].quantity = qty;
    } else {
      // منتج جديد
      order.items.push({
        productId: product._id,
        quantity: qty,
        price: price,
        total: price * qty,
      });
    }
  }

  // الحفظ - سيتم حساب totalAmount تلقائياً من الـ pre('save')
  await order.save();

  res.status(200).json({
    message: "Item(s) added or updated successfully",
    order,
  });
});


export const removeItemFromOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { productId } = req.body;
  const order = await orderModel.findById(id).populate();
  if (!order) {
    return next(new Error("Order not found"));
  }
  const itemIndex = order.items.findIndex(
    (item) => item.productId.toString() === productId
  )
  if (itemIndex === -1) {
    return next(new Error("Item not found in order"));
  }
  const item = order.items[itemIndex];
  if (item.quantity > 1) {
    item.quantity -= 1;
    item.total = item.quantity * item.price;
  } else {
    order.items.splice(itemIndex, 1);
  }
  order.totalAmount = order.items.reduce((acc, item) => acc + item.total, 0);
  const updatedOrder = await order.save();
  res.status(200).json({ message: "Item updated/removed successfully", updatedOrder });

})
export const removeItemCompletelyFromOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { productId } = req.body;
  const order = await orderModel.findById(id);
  if (!order) {
    return next(new Error("Order not found"));
  }
  const findItem = order.items.find(item => item.productId.toString() === productId);
  if (!findItem) {
    return next(new Error("Item not found in order"));
  }


  const itemIndex = order.items.findIndex(item => item.productId.toString() === productId);
  if (itemIndex === -1) {
    return next(new Error("Item not found in order"));
  }
  order.items.splice(itemIndex, 1);
  order.totalAmount = order.items.reduce((acc, item) => acc + item.total, 0);
  const updatedOrder = await order.save();
  res.status(200).json({ message: "Item removed", order: updatedOrder });
})