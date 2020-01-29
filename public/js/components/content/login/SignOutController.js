/* 
 * Copyright (C) 2019 kirenj
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
import Image from '../../elements/Image.js';
import UnauthenticatorService from './UnauthenticatorService.js';

class SignOutController {
    
    signOut() {
        
        $(document).on('click', '.navbar-sign-out', () => {
            let swal_text = document.createElement("div");
            swal_text.className = "swal-text text-center";
            swal_text.innerHTML = "Proceeding will end your current session.<br />All unsaved changes will be lost!";
            swal({
                icon: "error",
                title: "End Current Session?",
                content: swal_text,
                dangerMode: true,
                closeOnClickOutside: false,
                closeOnEsc: false,
                buttons: {
                    cancel: {
                        text: "Nope!",
                        visible: true
                    },
                    confirm: {
                        text: "Sign Out",
                        closeModal: false
                    }
                }
            }).then(async (signOut) => {
                if (signOut) {
                    let formData = new Array(
                        { name: "_token", value: $('meta[name="csrf-token"]').attr("content") }
                    );
                    await new UnauthenticatorService(formData).unauthenticate().then((response) => {
                        if ( response.unauthenticated ) {
                            swal_text.className = "swal-text";
                            swal_text.innerHTML = new Image("../../images/loading.gif", [ "loading-image" ], "Loading...").render();
                            swal({
                                icon: "info",
                                title: "Signing Out",
                                content: swal_text,
                                buttons: false,
                                timer: 2000,
                                closeOnEsc: false,
                                closeOnClickOutside: false
                            }).then(() => {
                                window.localStorage.clear();
                                location.reload();
                            });
                        }
                    });
                }
            });
        });
        
    }
    
}

export default new SignOutController().signOut();