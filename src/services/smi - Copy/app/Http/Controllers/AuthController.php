<?php

namespace smi\Http\Controllers;

use Illuminate\Http\Request;
use smi\Parametro;
use smi\config\enums;

class AuthController extends Controller
{
    public function validarAcceso(){
        $resultado=false;
        try{

            $codigoParametro='ACTIVAR_AUTENTICACION_PUBLICA'; //Config::get('enums.parametroEmuns.ActivarAutenticacionPublica');
            $parametroAutenticacion= $this->getByCodigo($codigoParametro);

            if($parametroAutenticacion->valor=='1'){
                $resultado= true;
            }

            $data= array('status'=> true, 'showLogin'=> $resultado);

            $json = json_encode($data); 
            return $json;
            
       }catch(Exception $e){
            report($e);
            return $resultado;
        }
        
    }

    public function autenticar(Request $request){
        error_log($request);

        $data= array(
            'status'=> true,
            'data'=> array(
                'id'=> 1,
                'login'=> 'abenaute',
                'nombre'=> 'Alfredo Benaute Laiza'
            )
        );

        $json = json_encode($data); 
        return $json;
    }

    public function get($id){
        $parametro=Parametro::find($id);
        return $parametro;
    }

    public function getByCodigo($codigo){
        $parametro=Parametro::where('codigo','=',$codigo)->first();
        return $parametro;
    }
}
