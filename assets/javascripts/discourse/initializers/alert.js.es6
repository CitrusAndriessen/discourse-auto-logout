import { withPluginApi } from 'discourse/lib/plugin-api';

export default {
	name: 'bbf',
	initialize() {
		let timer = 0;
		let apiUser;
        let warningID = 0;


		let requestOut = false;
		let requestValid = false;
		function setLogoutTimer(eventType) {
			if(requestOut) { return; }
			if(requestValid) { return; }

			requestOut = true;
            clearTimeout(warningID);


			const loc = window.location;
			const url = loc.protocol + '//api.' + loc.hostname + '/out/' + apiUser.id 
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if(this.readyState == 4) {
					requestOut = false;
					requestValid = true;

                    var obj = JSON.parse(this.responseText);
                    var warnSeconds = (obj.timeoutMinutes - 5) * 60;
                    if(warnSeconds > 0) {
                        warningID = setTimeout( function() {
                                bootbox.alert('Er is al enige tijd geen inactiviteit. Wanneer je binnen 5 minuten geen activiteit vertoond wordt je automatisch uitgelogd.', function() {
                                        });
                                },warnSeconds*1000);
                    }


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
