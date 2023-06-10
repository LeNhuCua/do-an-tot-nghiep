<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Carbon\Carbon;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index()
    {
        $order = Order::orderBy("created_at", "desc")->where('orderStatusId', '=', 'TT001')->get();

        return $order;
        // return Category::select('categoryId', 'alias', 'name', 'status')->get();
    }

    public function  ordersBeingProcessed()
    {
        $order = Order::orderBy("created_at", "desc")->where('orderStatusId', '=', 'TT002')->get();

        return $order;
        // return Category::select('categoryId', 'alias', 'name', 'status')->get();
    }


    public function orderCheck(Request $request)
    {
        $orderId = $request->input('orderId');
        $order = Order::where('orderId', $orderId)->first();
        if ($order) {
            $order->orderStatusId = "TT002";
            $order->save();
            return response()->json([
                'status' => 200,
                'order' => $order
            ]);
        } else {
            // Xử lý khi không tìm thấy đơn hàng
        }
    }

    public function orderCheckDelivery(Request $request)
    {
        $orderId = $request->input('orderId');
        $order = Order::where('orderId', $orderId)->first();
        if ($order) {
            $order->orderStatusId = "TT003";
            $order->deliveryDate = Carbon::now();
            $order->save();
            return response()->json([
                'status' => 200,
                'order' => $order
            ]);
        } else {
            // Xử lý khi không tìm thấy đơn hàng
        }
    }



    
    public function orderCancel(Request $request)
    {
        $orderId = $request->input('orderId');
        $order = Order::where('orderId', $orderId)->first();
        if ($order) {
            $order->orderStatusId = "TT006";
            $order->save();
            return response()->json([
                'status' => 200,
                'order' => $order
            ]);
        } else {
            // Xử lý khi không tìm thấy đơn hàng
        }
    }
}
