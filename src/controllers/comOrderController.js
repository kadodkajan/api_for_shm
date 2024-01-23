const Order = require('../models/orderModel');
const Guide = require('../models/guideModel');
const StoreGuide = require('../models/storeGuideModel');
const Store = require('../models/storeModel');
const { Orderclass, StoreOrderclass, Productclass, UpdateDate } = require('../utils/classes');
const { isOrderWithinCutoff } = require('../utils/dateService');

exports.getOrdersForCommisary = async (req, res) => {
  try {
    const { guideID, date } = req.body;

    var message = {
      code: 1,
      message: "all Stores has the orders",
      noPlacedStores: [],
      stores: [],
      systemorder: [],
    };
    if (!guideID || !date) {
      return res.status(400).json({
        status: "error",
        message: "Missing guideID or date parameter",
      });
    }
    const commisaryguide = await Guide.findOne({
      _id: guideID,
    });

    const productsForOrder = commisaryguide.products.map((product) => ({
      ProductId: product.ProductId,
      productName: product.productName,
    }));

    const allStores = await Store.find({ storeId: { $ne: 0 } });

    const storeOrdersPromises = allStores.map(async (store) => {
      const storeName = store.storeName;

      var ordersForStore = await Order.findOne({
        guideID: guideID,
        orderDate: date,
        orderLocation: storeName,
      });

      if (!ordersForStore) {
        const storeguide = await StoreGuide.findOne({
          guideID: guideID,
          user_location: storeName,
        });
        message.code = 2;
        message.message = "Some Stores did not place the order";
        message.noPlacedStores.push(storeName);
        var productsWithQuantity = [];
        var guideName = "System generated";

        if (!storeguide) {
          guideName = commisaryguide.guideName;
          productsWithQuantity = commisaryguide.products.map((product) => ({
            ProductId: product.ProductId,
            productName: product.productName,
            productQuantity: 0,
            _id: product._id,
          }));
        } else {
          guideName = storeguide.guideName;
          productsWithQuantity = storeguide.products.map((product) => ({
            ProductId: product.ProductId,
            productName: product.productName,
            productQuantity: Math.floor(product.productPar / 2),
            _id: product._id,
          }));
        }
        const currentDate = new Date();

        const submissionDate = {
          day: getDayOfWeek(currentDate),
          date: currentDate.toLocaleDateString("en-US"),
          time: currentDate.toLocaleTimeString("en-US"),
        };

        function getDayOfWeek(date) {
          const daysOfWeek = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ];
          return daysOfWeek[date.getDay()];
        }

        const isWithinCutoff = isOrderWithinCutoff(
          date,
          commisaryguide.cutoffTime
        );

        if (isWithinCutoff) {
          message.code = 2;
          message.message =
            "Some Stores did not place the order but they still have the time";
          productsWithQuantity = commisaryguide.products.map((product) => ({
            ProductId: product.ProductId,
            productName: product.productName,
            productQuantity: -1,
            _id: product._id,
          }));
        } else {
          message.code = 3;
          message.message =
            "Some Stores did not place the order yet and the cut off time is over so the system will place the order";
          const newOrder = new Order({
            guideID: guideID,
            guideName: guideName,
            orderLocation: storeName,
            orderDate: date,
            submissionDate: submissionDate,
            orderOwner: "System",
            products: productsWithQuantity,
          });
          await newOrder.save();
          ordersForStore = await Order.findOne({
            guideID: guideID,
            orderDate: date,
            orderLocation: storeName,
          });
        }
      } else {
        if (ordersForStore.orderOwner == "System") {
          message.systemorder.push(storeName);
        } else {
          message.stores.push(storeName);
        }
      }

      return {
        storeName,
        orderOwner: ordersForStore ? ordersForStore.orderOwner : "System",
        products: ordersForStore
          ? ordersForStore.products
          : productsWithQuantity,
      };
    });

    const storeOrders = await Promise.all(storeOrdersPromises);

    const storeOrderInstances = storeOrders.map(
      (storeOrder) => new StoreOrderclass(storeOrder)
    );

    const orderData = {
      guideID,
      orderDate: date,
      allproducts: productsForOrder,
      storeOrders: storeOrderInstances,
    };

    const orderInstance = new Orderclass(orderData);

    res.json({
      status: "success",
      message: {
        text: "Orders fetched successfully",
        details: message,
      },
      data: orderInstance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};
