/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import LoginController from './LoginController.js';
import Image from '../../elements/Image.js';
import Form from '../../elements/Form.js';
import FormEnd from '../../elements/FormEnd.js';
import Required from '../../elements/Required.js';
import Label from '../../elements/Label.js';
import Input from '../../elements/Input.js';
import Button from '../../elements/Button.js';
import Select from '../../elements/Select.js';

class Login {
    
    constructor() {
        new LoginController().builder();
    }
    
    render() {
        return(
            '<div class="row justify-content-center align-items-center login-container" style="display:none;">' +
                '<div class="col-md-3">' +
                    '<div class="card">' +
                        '<div class="card-body login">' +
                            '<div class="login-brand-container">' +
                                '<div class="login-brand-circle waves-effect">' +
                                    new Image("../../images/app-logo/xfil-logo.svg", [ "login-brand" ], "XFIL").render() +
                                '</div>' +
                            '</div>' +
                            '<div class="login-brand-name">' +
                                'XFIL | Accounts Payables' +
                            '</div>' +
                            new Form({ form_method: "POST", form_id: "sign-in", form_enctype: "application/x-www-form-urlencoded" }).render() +
                                '<div class="row">' +
                                    '<div class="col">' +
                                        '<div class="form-group">' +
                                            new Label('username', [], [], 'User Name' + Required).render() +
                                            new Input('text', [], 'username', { required: true }).render() +
                                        '</div>' +
                                        '<div class="form-group">' +
                                            new Label('password', [], [], 'Password' + Required).render() +
                                            new Input('password', [], 'password', { required: true }).render() +
                                        '</div>' +
                                        '<div class="form-group">' +
                                            '<div>' +
                                                new Select([ "login-company" ], "login-company", { required: true }, {}, 1).render() +
                                            '</div>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="row justify-content-center">' +
                                    new Button([ "btn-raised", "btn-secondary" ], "login", "Sign In").render() +
                                '</div>' +
                            FormEnd +
                        '</divor>' +
                    '</div>' +
                '</div>' +
            '</div>'
        );
    }
    
}

export default Login;