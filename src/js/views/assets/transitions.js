define([], function() {
  var transitions;
  return transitions = [
    {
      origin: "home.home",
      destination: "store.home",
      type: "a.forward"
    }, {
      origin: "client.login",
      destination: "client.dashboard",
      type: "b.forward"
    }, {
      origin: "client.dashboard",
      destination: "client.config",
      type: "c.backward"
    }, {
      origin: "client.dashboard",
      destination: "store.config",
      type: "b.backward"
    }, {
      origin: "client.dashboard",
      destination: "store.dashboard",
      type: "b.backward"
    }, {
      origin: "client.config",
      destination: "client.dashboard",
      type: "c.forward"
    }, {
      origin: "store.home",
      destination: "home.home",
      type: "a.backward"
    }, {
      origin: "store.home",
      destination: "store.selection",
      type: "b.forward"
    }, {
      origin: "store.home",
      destination: "store.tray",
      type: "b.forward"
    }, {
      origin: "store.home",
      destination: "store.config",
      type: "b.forward"
    }, {
      origin: "store.home",
      destination: "store.assortment",
      type: "b.forward"
    }, {
      origin: "store.selection",
      destination: "store.home",
      type: "b.backward"
    }, {
      origin: "store.selection",
      destination: "store.tray",
      type: "b.forward"
    }, {
      origin: "store.dashboard",
      destination: "store.config",
      type: "b.forward"
    }, {
      origin: "store.dashboard",
      destination: "store.assortment",
      type: "c.forward"
    }, {
      origin: "store.dashboard",
      destination: "client.dashboard",
      type: "b.forward"
    }, {
      origin: "store.assortment",
      destination: "store.config",
      type: "b.forward"
    }, {
      origin: "store.assortment",
      destination: "store.dashboard",
      type: "c.backward"
    }, {
      origin: "store.assortment",
      destination: "client.dashboard",
      type: "b.forward"
    }, {
      origin: "store.config",
      destination: "client.dashboard",
      type: "b.forward"
    }, {
      origin: "store.config",
      destination: "store.assortment",
      type: "b.backward"
    }, {
      origin: "store.config",
      destination: "store.dashboard",
      type: "b.backward"
    }, {
      origin: "store.tray",
      destination: "store.home",
      type: "b.backward"
    }, {
      origin: "store.tray",
      destination: "store.selection",
      type: "b.backward"
    }, {
      origin: "store.tray",
      destination: "store.checkout",
      type: "b.backward"
    }, {
      origin: "store.checkout",
      destination: "store.home",
      type: "b.forward"
    }
  ];
});

/*
//@ sourceMappingURL=transitions.js.map
*/