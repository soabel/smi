<?php

namespace smi\Http\Controllers;

use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function validarAcceso(){
        $data= array('status'=> true, 'showLogin'=> true);
        $json = json_encode($data); 
        return $json;
    }
}
