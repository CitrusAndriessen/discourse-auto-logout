import { withPluginApi } from 'discourse/lib/plugin-api';

export default {
	name: 'bbf',
	initialize() {
		let timer = 0;
		let apiUser;

		let requestOut = false;
		let requestValid = false;
		function setLogoutTimer(eventType) {
			if(requestOut) { return; }
			if(requestValid) { return; }

			requestOut = true;

			const loc = window.location;
			const url = loc.protocol + '//api.' + loc.hostname + '/out/' + apiUser.id 
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if(this.readyState == 4) {
					requestOut = false;
					requestValid = true;

					clearTimeout( timer );
					timer = setTimeout( ()=> {
						requestValid = false;
					}, 5 * 1000);
				}
			}
			xhttp.open('GET', url, true);
			xhttp.send();
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
