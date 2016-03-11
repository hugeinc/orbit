import OrbitMediator from '../mediator/channel';
import Logger from '../logger/logger';

function createModule() {
  let instance = Object.assign({}, this);

  instance.actions = actionsCreator(this.actions);

  for (let method of Object.getOwnPropertySymbols(this)) {
    Logger.log({ message: `[Module.createModule] Assigning method ${method.toString()}() to object.`, level: 'ALL'});
    instance[method] = this[method].bind(instance);
  }

  registerActions(instance.actions, instance);

  return instance;
}

function actionsCreator(actions) {
  let symbolActions = {};

  Logger.log({ message: '[Module.actionsCreator] Trying to create actions.', level: 'ALL' });

  for (let action in actions) {
    Logger.log({ message: `[Module.actionsCreator] Creating action ${action}.`, level: 'ALL' });
    symbolActions[action] = Symbol(action);
  }

  return symbolActions;
}

function registerActions(actions, instance) {
  Logger.log({ message: `[Module.registerActions] Trying to register actions`, level: 'ALL'});
  for (let action in actions) {
    if (typeof instance[actions[action]] === 'function') {
      Logger.log(`[Module.registerActions] Subscribing to ${actions[action].toString()} action.`, 'ALL');
      OrbitMediator.subscribe({
        topic: actions[action],
        callback: (data) => {
          let response;

          Logger.log(`[Module.callback] Action ${actions[action].toString()} callback called with ${data}`, 'ALL');

          try {
            Logger.log(`[Module.callback] ${actions[action].toString()} Promise resolved`, 'ALL');
            response = instance[actions[action]](data);
          } catch (e) {
            Logger.log(`[Module.callback] ${actions[action].toString()} Promise rejected ${e}`, 'ERROR');
            response = e;
          }

          return response;
        }
      });
    } else {
      Logger.log(`[Module.registerActions] ${actions[action].toString()} doesn't have a function callback.`, 'ERROR');
    }
  }
}

export default createModule;
