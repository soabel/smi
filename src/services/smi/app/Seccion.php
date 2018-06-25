<?php

namespace smi;

use Illuminate\Database\Eloquent\Model;

class Seccion extends Model
{
    protected $table="seccion";
    protected $primaryKey="id";
    protected $fillable=array('nombre','descripcion','idTipoGeoData','menuCategoria',
    'menuAccion','idTipoAccion','idSeccionPadre','activo',
    'fechaCrea','usuarioCrea','terminalCrea','fechaCambio','usuarioCambio','terminalCambio','eliminado');

    public function seccionPadre(){
        $this->belongTo('Seccion');
    }

    public function seccionDetalle(){
        $this->hasMany('SeccionDetalle');
    }

}
