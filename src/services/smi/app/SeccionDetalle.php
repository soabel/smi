<?php

namespace smi;

use Illuminate\Database\Eloquent\Model;

class SeccionDetalle extends Model
{
    protected $table="seccion_detalle";
    protected $primaryKey="id";
    protected $fillable=array('codigo','descripcion'.'abreviatura','nombre','activo',
    'fechaCrea','usuarioCrea','terminalCrea','fechaCambio','usuarioCambio','terminalCambio','eliminado');

    public function seccion(){
        $this->belongTo('Seccion');
    }
}
