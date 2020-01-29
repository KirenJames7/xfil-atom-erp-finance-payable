<?php

namespace App\Http\Controllers\LDAPAuth;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class LDAPAuthController extends Controller
{
    protected $bind;
    protected $ldap_connect;
    protected $ldap_config = [];
    
    public function ldapConnect() {
        $this->ldap_config['basedn'] = env('BASE_DN');
        $this->ldap_connect = ldap_connect(env('DOMAIN_IP'), env('DOMAIN_PORT'));
        ldap_set_option($this->ldap_connect, LDAP_OPT_PROTOCOL_VERSION, 3);
        ldap_set_option($this->ldap_connect, LDAP_OPT_REFERRALS, 0);
        return;
    }
    
    public function ldapBind($ldap_user, $ldap_password) {
        $this->bind = @ldap_bind($this->ldap_connect, $ldap_user . "@" . env('DOMAIN_NAME'), $ldap_password);
        return;
    }
}