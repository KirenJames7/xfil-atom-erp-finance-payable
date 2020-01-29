import SessionService from './components/content/login/SessionService.js';
import FeatureService from './components/content/login/FeatureService.js'
import Login from './components/content/login/Login.js';
import NavBar from './components/NavBar.js';

window.onload = async function() {
    window.login = await new SessionService().checkActiveSession();
};

(function() {
    setTimeout(async function() {
        try {
            if ( window.login ) {
                window.features = await new FeatureService(window.localStorage.getItem('current_user_company')).getFeatures();
                document.getElementById('app').innerHTML = new NavBar().render();
                $('.user-info').text(window.localStorage.getItem('current_user'));
                if ( !JSON.parse(window.localStorage.getItem('current_user_system_administrator')) ) {
                    $('#administration').remove();
                }
//                if ( !JSON.parse(window.localStorage.getItem('current_user_approver')) ) {
//                    $('#purchaserequestapproval').remove();
//                }
            } else {
                window.localStorage.clear();
                document.getElementById('app').innerHTML = new Login().render();
            }
        } catch (err) {
            location.reload();
        }
    }, 1000);
})();