function reflexApp() {
  return {
    filter: "all",

    openCreate: false,

    detail: null,

    form: {
      retailer: "",
      destination: "",
      rider: "Unassigned"
    },

    deliveries: [
      {
        id: "RX-1042",
        retailer: "Mara Market",
        destination: "Westlands, Nairobi",
        rider: "Amina K.",
        status: "in transit",
        code: "4218"
      },

      {
        id: "RX-1041",
        retailer: "Kijani Home",
        destination: "Kilimani, Nairobi",
        rider: "Brian O.",
        status: "assigned",
        code: ""
      },

      {
        id: "RX-1040",
        retailer: "Urban Basket",
        destination: "Lavington, Nairobi",
        rider: "David M.",
        status: "delivered",
        code: "8031"
      },

      {
        id: "RX-1039",
        retailer: "Soko Fresh",
        destination: "Parklands, Nairobi",
        rider: "",
        status: "requested",
        code: ""
      }
    ],

    get filtered() {
      if (this.filter === "active") {
        return this.deliveries.filter(
          item => item.status !== "delivered"
        );
      }

      if (this.filter === "delivered") {
        return this.deliveries.filter(
          item => item.status === "delivered"
        );
      }

      return this.deliveries;
    },

    get activeCount() {
      return this.deliveries.filter(
        item => item.status !== "delivered"
      ).length;
    },

    get inTransitCount() {
      return this.deliveries.filter(
        item => item.status === "in transit"
      ).length;
    },

    get deliveredCount() {
      return this.deliveries.filter(
        item => item.status === "delivered"
      ).length;
    },

        currentRider: "Amina K.", // later this comes from login

    get myDeliveries() {
      return this.deliveries.filter(
        item => item.rider === this.currentRider
      );
    },

    advanceStatus(item) {
      const order = ["assigned", "in transit", "delivered"];
      const currentIndex = order.indexOf(item.status);

      if (currentIndex === -1 || currentIndex === order.length - 1) {
        return; // already delivered, or unknown status
      }

      item.status = order[currentIndex + 1];
    },

    create() {
      const nextNumber =
        1042 + this.deliveries.length - 3;

      const newDelivery = {
        id: `RX-${nextNumber}`,
        retailer: this.form.retailer,
        destination: this.form.destination,
        rider:
          this.form.rider === "Unassigned"
            ? ""
            : this.form.rider,
        status:
          this.form.rider === "Unassigned"
            ? "requested"
            : "assigned",
        code: ""
      };

      this.deliveries.unshift(newDelivery);

      this.form = {
        retailer: "",
        destination: "",
        rider: "Unassigned"
      };

      this.openCreate = false;
      this.filter = "all";
    },

    openDetail(item) {
      this.detail = {
        ...item
      };
    },

    updateStatus(status) {
      if (!this.detail) {
        return;
      }

      this.detail.status = status;
    },

    saveDetail() {
      if (!this.detail) {
        return;
      }

      const index = this.deliveries.findIndex(
        item => item.id === this.detail.id
      );

      if (index === -1) {
        return;
      }

      this.deliveries[index] = {
        ...this.detail
      };

      this.detail = null;
    }
  };
}