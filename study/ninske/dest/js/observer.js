var EventBroker = function EventBroker(){
  this.subjects = {};
};

EventBroker.prototype.subscribe = function(subject,callback){
  var id = this.getNextId();
  this.get(subject)[id] = callback;
  return id;
};

EventBroker.prototype.clearSubscribe = function(subject, id){
  this.get(subject)[id] = null;
};

EventBroker.prototype.count = 0;
EventBroker.prototype.getNextId = function() {
  this.count++;
  return Date.now() + '_' + this.count;
}
EventBroker.prototype.create = function(subject){
  this.subjects[subject] = {}; 
};

EventBroker.prototype.get = function(subject){
  if( !this.has(subject) ) {
    throw new Error("Subject Not Found: "+subject);
  }

  return this.subjects[subject];
};

EventBroker.prototype.has = function(subject){
  return this.subjects.hasOwnProperty(subject);
}

EventBroker.prototype.publish = function(subject){
  var subscriberMap = this.get(subject);
  var subscribers = Object.keys(subscriberMap).map(function(key){ return subscriberMap[key]; }),
      args = Array.prototype.slice.call(arguments,1);

  args.splice(0,0, null);

  for(var i = -1, len=subscribers.length; ++i < len; ){
    if(!subscribers[i]) continue;
    setTimeout(Function.prototype.bind.apply(subscribers[i], args), 0);   
  };
};

function Observable(){
  this.events = new EventBroker();
  this.on = this.events.subscribe.bind(this.events);
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