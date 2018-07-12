<?php

namespace smi\Http\Controllers;

use Illuminate\Http\Request;
use smi\Seccion;
use smi\SeccionDetalle;
use smi\SeccionAtributo;

class SeccionesController extends Controller
{
    public function get(){
        $secciones=Seccion::where([['activo','=','1'],['eliminado','=','0']])->get();
        $data= array('status'=> true, 'data'=> $secciones);
        return $data;
    }

    public function getById($idSeccion){
        $seccion = Seccion::find($idSeccion);

        $dataGeoJson=null;

        if($seccion->geoJsonFile <> null ){
            $fileName= $seccion->geoJsonFile;
            $baseSrc='\storage\app\public\json\\';
            $file= base_path().$baseSrc.($fileName);
            $dataGeoJson = file_get_contents($file);
        }

        $data= array(
            'status'=> true, 
            'data'=> array(
                'seccion' => $seccion,
                'geoJsonFile'=> $dataGeoJson
            )            
        );
        return $data;
    }

    public function getSeccionDetalleByIdSeccion($idSeccion){
        $detalleSeccion=SeccionDetalle::where([['idSeccion','=',$idSeccion]])->get();

        $data= array(
            'status'=> true, 
            'data'=> $detalleSeccion            
        );
        
        $json = json_encode($data); 

        return $data;
    }

    public function getSeccionAtributoByIdSeccion($idSeccion){
        $detalleAtributo=SeccionAtributo::where([['idSeccion','=',$idSeccion]])->get();
        $data= array('status'=> true, 'data'=> $detalleAtributo);
        return $data;
    }

    public function save($request){
        return null;
    }
}
