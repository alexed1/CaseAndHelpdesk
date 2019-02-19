({
  doInit: function(component, event, helper) {
    var listener = function (messageEvent) {
      if (!(messageEvent.origin.endsWith('cogitocorp.com') ||
            messageEvent.origin.endsWith('localhost:3443'))) {
        console.log('message from unrecognized origin ' + messageEvent.origin);
        return;
      }
      var utilityAPI = component.find("utilitybar");
      if (messageEvent.data.type === 'SFDC_LIGHTNING_UTILITY_CLOSE') {
        utilityAPI.minimizeUtility();
      } else if (messageEvent.data.type === 'SFDC_LIGHTNING_UTILITY_OPEN') {
        utilityAPI.openUtility();
      }
    };
    if (window.addEventListener !== undefined) {
      window.addEventListener('message', listener, false);
    } else {
      window.attachEvent('onmessage', listener);
    }
  },
})