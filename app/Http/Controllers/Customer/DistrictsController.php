<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\District;
use Illuminate\Http\Request;

class DistrictsController extends Controller
{
    public function index($id)
    {
        $huyens = District::where('provinceId', '=', $id)->get();
        return response()->json($huyens);
    }
}
