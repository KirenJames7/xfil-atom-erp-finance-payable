<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Mail\DemoEmail;
use Illuminate\Support\Facades\Mail;

class MailController extends Controller
{
    public function send() {
        $objDemo =  new \stdClass();
        $objDemo->receiver = "Kiren";
        
        Mail::to(["kirenj@zone24x7.com", "janithp@zone24x7.com"])->send(new DemoEmail($objDemo));
    }
}