var EventBroker = function() {
  var subjects = {};
  var count = 0;
  
  function getNextId() {
    return Date.now() + '_' + (count++);
  }
  
  function has(subject) {
    return subjects.hasOwnProperty(subject);
  }
  
  function get(subject) {
    if(!has(subject)) {
      throw new Error("Subject Not Found: " + subject);
    }
    return subjects[subject];
  }
  
  function create(subject) {
    subjects[subject] = {}; 
  }
  
  function subscribe(subject,callback) {
    var id = getNextId();
    get(subject)[id] = callback;
    return id;
  }
  
  function clearSubscribe(subject, id) {
    delete get(subject)[id];
  }
  
  function publish(subject) {
    var subscriberMap = get(subject);
    var subscribers = Object.keys(subscriberMap).map(function(key){ return subscriberMap[key]; });
    var args = Array.prototype.slice.call(arguments, 1);
    args.splice(0,0, null);
    for(var i = 0, len = subscribers.length; i < len; i++){
      if(!subscribers[i]) continue;
      setTimeout(Function.prototype.bind.apply(subscribers[i], args), 0);   
    }
  }
  
  // public methods
  return {
    create: create,
    subscribe: subscribe,
    clearSubscribe: clearSubscribe,
    publish: publish,
    has: has
  };
};

var EventBrokerWrapper = function(events, subject) {
  events.create(subject);
  return {
    subscribe: function(callback) {
      return events.subscribe(subject, callback);
    },
    clearSubscribe: function(subscribeId) {
      events.clearSubscribe(subject, subscribeId);
    },
    publish: function(value) {
      events.publish(subject, value);
    }
  };
};
