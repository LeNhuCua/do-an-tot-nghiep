<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\PaymentMethod;
use App\Models\ShippingMethod;
use Illuminate\Http\Request;

class PaymentMethodsController extends Controller
{
    public function paymentMethod()
    {
        $posts = PaymentMethod::orderBy("created_at", "desc")->get();
        return $posts;
    }
    public function shippingMethods()
    {
        $posts = ShippingMethod::orderBy("created_at", "desc")->get();
        return $posts;
    }
}
