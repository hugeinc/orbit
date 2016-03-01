import 'babel-polyfill';
import Mediator from './core/mediator/channel';
import Class from './core/factories/application-class.factory';
import ViewProvider from './core/factories/view-provider.factory';
import ActionEmitter from './core/factories/action-emitter.factory';
import Dispatcher from './core/factories/dispatcher.factory';
import ActionsCreator from './core/factories/actions-creator.factory';

export default {
	Orbit: {
		Mediator,
		Class,
		ViewProvider,
		ActionEmitter,
		Dispatcher,
		ActionsCreator,
		Controller: ViewProvider,
		Service: ActionEmitter
	}
};
