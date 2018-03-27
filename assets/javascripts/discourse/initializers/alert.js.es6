import { withPluginApi } from 'discourse/lib/plugin-api';

export default {
	name: 'bbf',
	initialize() {
		let timer = 0;
		let apiUser;
		function setLogoutTimer(eventType) {
			clearTimeout(timer);
			timer = setTimeout( ()=> {
				function logoutLink() { return $('a.logout'); }
				function tryLogout() {
					let link = logoutLink();
					if(link.length) {
						link.click();
					} else {
						setTimeout(() => { tryLogout(); },0);
					}
				}
				if(!logoutLink().length) {
					$('#current-user a').click();
				}
				tryLogout();
			}, 10 * 60 * 1000);
		}


		withPluginApi('0.3', api => {       
			apiUser = api.getCurrentUser();
			api.onPageChange( ()=> {
				setLogoutTimer('navigation');
			});
			[ 'mousemove', 'scroll' ].forEach( (eventType) => {
				window.addEventListener(eventType, ()=> {
					setLogoutTimer(eventType);
				},true);
			});
			setLogoutTimer('init');
		});

	}
}
