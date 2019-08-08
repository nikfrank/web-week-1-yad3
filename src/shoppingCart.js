const cart = {};

let subscriptions = [];

export const getValue = key => cart[key];

export const publish = (key, value)=> {
  cart[key] = value;

  // call subscribers
  subscriptions.filter(subscription => subscription.key === key)
               .forEach(subscription => subscription.callback(value));
};

export const subscribe = (key, callback)=>{
  const id = Math.random();

  subscriptions.push({ id, key, callback });

  return ()=> {
    subscriptions = subscriptions.filter(subscription => subscription.id !== id);
  };
};
