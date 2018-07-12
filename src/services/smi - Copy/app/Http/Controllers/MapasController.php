<?php

namespace smi\Http\Controllers;

use Illuminate\Http\Request;

class MapasController extends Controller
{
    //
    public function getDistritos(){
        //$path = storage_path() . "/json/${filename}.json";
        $path=base_path() . '/storage/app/public/json/peru_departamental_simple.geojson';
        $json = json_decode(file_get_contents($path), true); 
        return $json;
    }

    public function test(){
        $json= "{\"status\":true}";
        return $json;
    }
}
