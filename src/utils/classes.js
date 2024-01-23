// utils/classes.js

class Orderclass {
    constructor({ guideID, orderDate, allproducts, storeOrders = [] }) {
      this.guideID = guideID;
      this.orderDate = orderDate;
      this.allproducts = allproducts;
      this.storeOrders = storeOrders.map(
        (storeOrder) => new StoreOrderclass(storeOrder)
      );
    }
    addStoreOrder(storeOrderData) {
      const newStoreOrder = new StoreOrderclass(storeOrderData);
      this.storeOrders.push(newStoreOrder);
    }
  }
  
  class StoreOrderclass {
    constructor({ storeName, products, orderOwner }) {
      this.storeName = storeName;
      this.orderOwner = orderOwner;
      this.products = this.mapProducts(products);
    }
  
    mapProducts(products) {
      // Check if products array is empty before applying map
      return products.length
        ? products.map((product) => new Productclass(product))
        : this.getDefaultProducts(); // Call a method to get default products
    }
  
    getDefaultProducts() {
      // You can customize this method to return default products or perform other actions
      return [
        new Productclass({
          ProductId: "defaultId",
          productName: "Default Product",
          productQuantity: -1,
          
        }),
      ];
    }
  }
  
  class Productclass {
    constructor({ ProductId, productQuantity, lastupdate = {} }) {
      this.ProductId = ProductId;
      this.productQuantity = productQuantity;
      
      if (lastupdate && lastupdate.updatedBy && lastupdate.updateDate) {
        this.lastupdate = {
          updatedBy: lastupdate.updatedBy,
          updateDate: new UpdateDate(lastupdate.updateDate),
        };
      } else {
        this.lastupdate = null; // or any other default value or behavior you want
      }
    }
  }
  
  class UpdateDate {
    constructor({ date, time }) {
      this.date = date;
      this.time = time;
    }
  }
  
  module.exports = { Orderclass, StoreOrderclass, Productclass, UpdateDate };
  