<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Ward;
use Illuminate\Http\Request;

class WardsController extends Controller
{
    public function index($id)
    {
        $xas = Ward::where('districtId', '=', $id)->get();
        return response()->json($xas);
    }
}
