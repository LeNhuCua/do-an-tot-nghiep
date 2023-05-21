<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\ShippingAddress;
use App\Models\ShippingFee;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    public function index($id)
    {
        $order = Order::where('userId', '=', $id)->get();
        return response()->json($order);
    }
    public function destroy($cartId)
    {
        $userId = Auth::user()->userId;
        $cartItem = Cart::where('cartId', $cartId)->where('userId', $userId)->first();
        if ($cartItem) {
            $cartItem->delete();
            return response()->json([
                'status' => 200,
                'message' => 'Thành công!!',
                'cartItem' => $cartItem,
                'user' => $userId


            ]);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'ko tìm thấy Thành công!!',
                'cartItem' => $cartItem,
                'user' => $userId


            ]);
        }
    }

    public function store(Request $request)
    {
        $messages = [
            'required' => 'Trường :attribute phải nhập',
            'unique' => 'Trường :attribute đã tồn tại'

        ];
        $validator = Validator::make($request->all(), [
            // 'cartId' => 'required|unique:invoices',
            // 'quantity' => 'required',
            // 'userId' => 'required',
            // 'productId' => 'required',

        ], $messages);
        if ($validator->fails()) {
            return response()->json([
                'validation_error' => $validator->errors(),
                'message' => 'Kiểm tra lại thông tin',

            ]);
        } else {


            try {
                if (auth()->check()) {
                $userId = Auth::user()->userId;
                    $days_now = Carbon::today();
                    $dateObj = $days_now->toDateString();

                    $lassOrderAddressId = Order::selectRaw('SUBSTRING(orderId, -5) AS orderId')
                        ->whereDate('created_at', $days_now)
                        ->orderBy('orderId', 'desc')
                        ->value('orderId');
                    if ($lassOrderAddressId) {
                        $newOrderIdNumber = substr($lassOrderAddressId, -0) + 1;
                    }
                    if ($lassOrderAddressId == null) {
                        $newOrderId = $dateObj . 'DH00001';
                    } else {
                        $newOrderId = $dateObj . 'DH' . str_pad($newOrderIdNumber, 5, '0', STR_PAD_LEFT);
                    }


                    $order = new Order;

                    $order->orderId  = $newOrderId;
                    $order->totalAmount  = $request->totalAmount;
                    $order->orderStatusId  = "TT00001";
                    $order->deliveryDate  = null;
                    $order->userId  = $userId;
                    $order->paymentMethodId  = $request->paymentMethodId;
                    $order->shippingMethodId  = $request->shippingMethodId;
                    $order->save();


                    if ($request->orderDetails) {
                        foreach ($request->orderDetails as $orderDetail) {
                            $sizeItemObject = json_decode($orderDetail);

                            $lassOrderDetailId = OrderDetail::selectRaw('SUBSTRING(orderDetailId, -5) AS orderDetailId')
                                ->whereDate('created_at', $days_now)
                                ->orderBy('orderDetailId', 'desc')
                                ->value('orderDetailId');
                            if ($lassOrderDetailId) {
                                $newOrderDetailIdNumber = substr($lassOrderDetailId, -0) + 1;
                            }
                            if ($lassOrderDetailId == null) {
                                $newDetailOrderId = $dateObj . 'CTDH00001';
                            } else {
                                $newDetailOrderId = $dateObj . 'CTDH' . str_pad($newOrderDetailIdNumber, 5, '0', STR_PAD_LEFT);
                            }

                            $order_Detail = new OrderDetail;
                            $order_Detail->orderDetailId  = $newDetailOrderId;
                            $order_Detail->orderId = $order->orderId;
                            $order_Detail->quantity = $sizeItemObject->quantity;
                            $order_Detail->sizeValue = $sizeItemObject->size->sizeValue;
                            $order_Detail->price = $sizeItemObject->price;
                            $order_Detail->productId = $sizeItemObject->productId;
                            $order_Detail->save();


                            //TRỪ GIỎ HÀNG
                            // $cart = Cart::find($sizeItemObject->productId)->where('sizeId', $sizeItemObject->sizeId)->where('userId', $userId);
                            $cart = Cart::where('productId', $sizeItemObject->productId)->where('sizeId', $sizeItemObject->sizeId)->where('userId', $userId)->first();
                            $cart->quantity -= $sizeItemObject->quantity;
                            if ($cart->quantity === 0) {
                                $this->destroy($cart->cartId);
                            }
                            $cart->save();
                        }
                    }

                    $lassShippingFeeId = ShippingFee::selectRaw('SUBSTRING(shippingFeeId, -5) AS shippingFeeId')
                        ->whereDate('created_at', $days_now)
                        ->orderBy('shippingFeeId', 'desc')
                        ->value('shippingFeeId');
                    if ($lassShippingFeeId) {
                        $newShippingFeeIdNumber = substr($lassShippingFeeId, -0) + 1;
                    }
                    if ($lassShippingFeeId == null) {
                        $newShippingFeeId = $dateObj . 'PGH00001';
                    } else {
                        $newShippingFeeId = $dateObj . 'PGH' . str_pad($newShippingFeeIdNumber, 5, '0', STR_PAD_LEFT);
                    }
                    $shippingFee = new ShippingFee;
                    $shippingFee->shippingFeeId  = $newShippingFeeId;
                    $shippingFee->orderId  = $order->orderId;
                    $shippingFee->shippingFeeAmount  = $request->shippingFeeAmount;
                    $shippingFee->save();



                    $lassShippingAddressId = ShippingAddress::selectRaw('SUBSTRING(shippingAddressId, -5) AS shippingAddressId')
                        ->whereDate('created_at', $days_now)
                        ->orderBy('shippingAddressId', 'desc')
                        ->value('shippingAddressId');
                    if ($lassShippingAddressId) {
                        $newShippingAddressIdNumber = substr($lassShippingAddressId, -0) + 1;
                    }
                    if ($lassShippingAddressId == null) {
                        $newShippingAddressId = $dateObj . 'DCGH00001';
                    } else {
                        $newShippingAddressId = $dateObj . 'DCGH' . str_pad($newShippingAddressIdNumber, 5, '0', STR_PAD_LEFT);
                    }
                    $shippingAddress = new ShippingAddress;
                    $shippingAddress->shippingAddressId  = $newShippingAddressId;
                    $shippingAddress->recipientAddress  = $request->recipientAddress;
                    $shippingAddress->provinceId  = $request->provinceId;
                    $shippingAddress->districtId  = $request->districtId;
                    $shippingAddress->wardId  = $request->wardId;
                    $shippingAddress->recipientName  = $request->recipientName;
                    $shippingAddress->recipientPhone  = $request->recipientPhone;
                    $shippingAddress->orderId  = $order->orderId;
                    $shippingAddress->save();

                    return response()->json([
                        'status' => 400,
                        'message' => 'order Created Successfully!!',
                        'order' => $order,
                        '$cart' => $cart


                    ]);
                } else {
                    return response()->json([
                        'message' => 'Fail!!',
                        'status' => 202,
                        // 'user' => $loggeduser,
                    ]);
                }
            } catch (\Exception $e) {
                return response()->json([
                    'message' => 'Fail!!',
                    'eee' => 'Lỗi: ' . $e->getMessage(),
                    'status' => 201,

                ]);
            }
        }
    }
}
