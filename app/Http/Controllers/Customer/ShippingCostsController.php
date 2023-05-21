<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\ShippingCost;
use Illuminate\Http\Request;

class ShippingCostsController extends Controller
{
    public function index($provinceId, $districtId, $wardId)
    {
        $shippingCosts = ShippingCost::where('provinceId', '=', $provinceId)->where('districtId', '=', $districtId)->where('wardId', '=', $wardId)->get();
        return response()->json($shippingCosts);
    }
}
