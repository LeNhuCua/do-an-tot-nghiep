<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{




    public function destroy($order)
    {

        $order = Order::find($order);
        if ($order) {
            try {
                $order->delete();
                return response()->json([
                    'status' => 200,
                    'message' => 'Xoá thành công!!'
                ]);
            } catch (\Exception $e) {
                return response()->json([
                    'message' => 'Lỗi khi xoá!!'
                ]);
            }
        }
    }


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

    public function  ordersBeingDelivered()
    {
        $order = Order::orderBy("created_at", "desc")->where('orderStatusId', '=', 'TT003')->get();

        return $order;
        // return Category::select('categoryId', 'alias', 'name', 'status')->get();
    }
    public function  ordersDelivered()
    {
        $order = Order::orderBy("created_at", "desc")->where('orderStatusId', '=', 'TT004')->orWhere('orderStatusId', '=', 'TT005')->orWhere('orderStatusId', '=', 'TT007')->get();

        return $order;
        // return Category::select('categoryId', 'alias', 'name', 'status')->get();
    }

    public function  orderCanceled()
    {
        $order = Order::orderBy("created_at", "desc")->where('orderStatusId', '=', 'TT006')->get();

        return $order;
        // return Category::select('categoryId', 'alias', 'name', 'status')->get();
    }




    public function orderCheck(Request $request)
    {
        $userName = Auth::user()->fullName;
        $orderId = $request->input('orderId');
        $order = Order::where('orderId', $orderId)->first();
        if ($order) {
            $order->orderStatusId = "TT002";
            $order->processingOrderBy = $userName;
            $order->isDeposit = 1;
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
        $userName = Auth::user()->fullName;
        $orderId = $request->input('orderId');
        $order = Order::where('orderId', $orderId)->first();
        if ($order) {
            $order->orderStatusId = "TT003";
            $order->deliveryDate = Carbon::now();
            $order->processingOrderBy = $userName;
            $order->save();
            return response()->json([
                'status' => 200,
                'order' => $order
            ]);
        } else {
            // Xử lý khi không tìm thấy đơn hàng
        }
    }



    public function orderSuccess(Request $request)
    {
        $userName = Auth::user()->fullName;
        $orderId = $request->input('orderId');
        $order = Order::where('orderId', $orderId)->first();
        if ($order) {
            $order->orderStatusId = "TT004";
            $order->processingOrderBy = $userName;
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


        $userName = Auth::user()->fullName;
        $orderId = $request->input('orderId');
        $order = Order::where('orderId', $orderId)->first();
        if ($order) {
            $order->orderStatusId = "TT006";
            $order->processingOrderBy = $userName;
            $order->save();
            return response()->json([
                'status' => 200,
                'order' => $order
            ]);
        } else {
            // Xử lý khi không tìm thấy đơn hàng
        }
    }


    public function orderSuccsessDelivered(Request $request)
    {
        $userName = Auth::user()->fullName;
        $orderId = $request->input('orderId');
        $order = Order::where('orderId', $orderId)->first();


        if ($order) {
            $order->orderStatusId = "TT005";
            $order->processingOrderBy = $userName;
            $orderDetails = OrderDetail::where('orderId', $order->orderId)->get();

            foreach ($orderDetails as $orderDetail) {
                $product = Product::where('productId', $orderDetail->productId)->first();
                $product->numberBuy += $orderDetail->quantity;
                $product->save();
            }
            $order->save();
            return response()->json([
                'status' => 200,
                'order' => $order,
                'orderDetails' => $orderDetails
            ]);
        } else {
            // Xử lý khi không tìm thấy đơn hàng
        }
    }
}
