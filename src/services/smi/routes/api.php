<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

//Route::middleware('cors:api')->post('/auth/validateLogin', 'AuthController@validarAcceso');

// Route::get('/auth/validateLogin', ['middleware' => 'cors',function(){

// 	return ['status'=>'success'];
// }]);

Route::group(['middleware' => 'cors'], function() {
    Route::post('/validateLogin','AuthController@validarAcceso' ); 
 });


Route::post('/validateLogin1',['middleware'=> 'cors',function(){
    return ['status'=>'success'];
}]);


//Route::post('/auth/validateLogin', 'AuthController@validarAcceso')->name('postValidateLogin');
Route::get('/status', 'MapasController@test')->name('getStatus');
Route::get('/mapas/distritos', 'MapasController@getDistritos')->name('getMapasDistritos');