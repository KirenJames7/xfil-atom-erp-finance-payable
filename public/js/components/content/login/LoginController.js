/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import PageLoader from '../../elements/PageLoader.js';
import LoginCompanyService from './LoginCompanyService.js';
import AuthenticatorService from './AuthenticatorService.js';
import FeatureService from './FeatureService.js';
import NavBar from '../../NavBar.js';
import HomeController from '../home/HomeController.js';
import ContainerController from '../../services/ContainerController.js';

class LoginController {
    
    errorDisplay(element) {
        if ( !element.val() ) {
            switch ( element.get(0).tagName.toLowerCase() ) {
                case "select": 
                    $('.CaptionCont').css("border", "#a94442 2px solid");
                    if ( $('.CaptionCont').parent().siblings().length ) {
                        $('.CaptionCont').parent().siblings().remove();
                    }
                    $('.CaptionCont').parent().after('<span class="text-danger" style="display:block;margin-bottom:10px;text-align:center">Please Select Company</span>');
                    break;
                case "input":
                    element.css({ background: "rgb(236, 185, 183)", "border-radius": "4px" });
                    if ( element.siblings('span').length ) {
                        element.siblings('span').remove();
                    }
                    element.after('<span class="text-danger align-center" style="display:block;margin-bottom:10px;text-align:center">Please Enter </span>');
                    break;
            }
            return false;
        } else {
            switch ( element.get(0).tagName.toLowerCase() ) {
                case "select": 
                    $('.CaptionCont').removeAttr("style");
                    if ( $('.CaptionCont').parent().siblings().length ) {
                        $('.CaptionCont').parent().siblings().remove();
                    }
                    break;
                case "input":
                    if ( element.siblings('span').length ) {
                        element.siblings('span').remove();
                    }
                    break;
            }
            return true;
        }
    }
    
    login() {
        $(document).ready(async function() {
            let companies = await new LoginCompanyService().getLoginCompanies();
            $('select.login-company').SumoSelect();
            Object.keys(companies.companies).map((key, index) => {
                $('select.login-company')[0].sumo.add(key, companies.companies[key], index);
            });
            $('select.login-company').val("");
            $('select.login-company').parents('.SumoSelect').css('width', "100%");
            $('.lds-css, .atom-spinner').fadeOut(function() {
                $(this).remove();
            });
            $('.row').fadeIn("slow");
            
            $(document).on("input", "input", function() {
                $(this).removeAttr("style");
                $(this).siblings('span').remove();
            });
            
            $(document).on("click", "div.SumoSelect", function() {
                $(this).children(".CaptionCont").removeAttr("style");
                $(this).children(".CaptionCont").parent().siblings().remove();;
            });
            
            $(document).on("click", '#login', function() {
                
                if ( ![ new LoginController().errorDisplay($('#username')), new LoginController().errorDisplay($('#password')), new LoginController().errorDisplay($('select.login-company')) ].every(bool => { return true && bool; }) ) {
                    return false;
                }
                
                let formData = $('#sign-in').serializeArray();
                formData.push({ name: "company", value: $('select.login-company').val() }, { name: "_token", value: $('meta[name="csrf-token"]').attr("content") });
                new AuthenticatorService(formData).authenticate().then( async (response) => {
                    //button fire works
                    $(this).attr("disabled", true);
                    if ( response.unauthorized ) {
                        $('#username').after('<span class="text-danger" style="display:block;margin-bottom:10px;text-align:center">Unauthorized | Invalid User</span>');
                        $('#username').val("").focus();
                        $(this).removeAttr("disabled");
                    } else {
                        if (response.authenticated) {
                            window.localStorage.setItem('current_user', response.session.current_user);
                            window.localStorage.setItem('current_user_id', JSON.stringify(response.session.current_user_id));
                            window.localStorage.setItem('current_user_company', response.session.current_user_company);
                            window.localStorage.setItem('current_user_purchase_groups', JSON.stringify(response.session.current_user_purchase_groups));
                            window.localStorage.setItem('current_user_purchase_order_global', JSON.stringify(response.session.current_user_purchase_order_global));
                            window.localStorage.setItem('current_user_purchase_procurement_global', JSON.stringify(response.session.current_user_purchase_procurement_global));
                            window.localStorage.setItem('current_user_system_administrator', JSON.stringify(response.session.current_user_system_administrator));
                            window.localStorage.setItem('current_user_approver', JSON.stringify(response.session.current_user_approver));
                            window.localStorage.setItem('current_user_approver_groups', JSON.stringify(response.session.current_user_approver_groups));
                            window.localStorage.setItem('current_user_leader', JSON.stringify(response.session.current_user_leader));
                            window.localStorage.setItem('current_user_leader_groups', JSON.stringify(response.session.current_user_leader_groups));
                            window.localStorage.setItem('current_user_authorizer', JSON.stringify(response.session.current_user_authorizer));
                            window.localStorage.setItem('current_user_authorization_structures', JSON.stringify(response.session.current_user_authorization_structures));
                            window.localStorage.setItem('current_user_authorizer_structures', JSON.stringify(response.session.current_user_authorizer_structures));
                            window.localStorage.setItem('current_user_company_information', JSON.stringify(await new LoginCompanyService().getCompanyInformation(window.localStorage.getItem('current_user_company')).then((response) => { return response.company; })));
                            window.features = await new FeatureService(window.localStorage.getItem('current_user_company')).getFeatures();
                            $('.row').fadeOut("slow");
                            setTimeout(function() {
                                $('.page-loader').remove();
                                $('body').children(':first').before(new PageLoader().render()).fadeIn("slow");
                                particleInit();
                                $('#app').html(new NavBar().render());
                                $('.user-info').text(window.localStorage.getItem('current_user'));
                                new HomeController().home();
                                $('div .container-fluid').css({ 
                                    marginTop: window.navbarHeight,
                                    marginLeft: window.drawerWidth
                                });
                                new ContainerController().render();
                                if ( !JSON.parse(window.localStorage.getItem('current_user_system_administrator')) ) {
                                    $('#administration').remove();
                                }
//                                if ( !JSON.parse(window.localStorage.getItem('current_user_approver')) ) {
//                                    $('#purchaserequestapproval').remove();
//                                }
                            }, 100);
                        } else {
                            $('#password').after('<span class="text-danger" style="display:block;margin-bottom:10px;text-align:center">Unauthenticated | Incorrect Password</span>');
                            $('#password').val("").focus();
                            $(this).removeAttr("disabled");
                        }
                    }
                }).catch(error => {
                    if ( error.status === 419 ) {
                        swal({
                            icon: "error",
                            title: "Network Timeout",
                            text: "The application will reload. Please try signing in again.",
                            buttons: false,
                            timer: 2000,
                            closeOnEsc: false,
                            closeOnClickOutside: false
                        }).then(() => {
                            location.reload();
                        });
                    }
                });
            });
        });
    }
    
    builder() {
        if ( !window.login ) {
            this.login();
        }
    }
    
}

export default LoginController;