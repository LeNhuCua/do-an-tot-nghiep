<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\Guard;

class CartsController extends Controller
{
    public function index()
    {
        $userId = Auth::user()->userId;
        $cart = Cart::orderBy("created_at", "desc")->where('userId', $userId)->get();



        // $cart = DB::table('carts')
        //     ->join('sizes', 'carts.sizeId', '=', 'sizes.sizeId')
        //     ->join('products', 'carts.productId', '=', 'products.productId')
        //     ->join('product_c', 'carts.productId', '=', 'products.productId')
        //     ->orderBy("carts.created_at", "desc")
        //     ->where('carts.userId', $userId)
        //     // ->select('invoices.invoiceId', 'invoices.fullName', 'invoices.phoneNumber', DB::raw('sum(invoice_details.number) as total_quantity'), DB::raw('(invoices.totalAmount) as total_Amount'))
        //     // ->whereDate('invoices.created_at', $date)
        //     // ->groupBy('invoices.invoiceId', 'invoices.created_at')
        //     ->get();
        return $cart;
        // return Category::select('unitId', 'alias', 'name', 'status')->get();
    }


    public function totalCart()
    {
        $userId = Auth::user()->userId;
        $cart =  Cart::select(DB::raw('count(cartId) as total_cart'))->where('userId', $userId)->get();

        return $cart;
    }
    // protected $currentUser;

    // public function __construct(Auth $auth)
    // {
    //     $this->currentUser = $auth->user();
    // }

    public function update($cartId, $scope)
    {
        $userId = Auth::user()->userId;
        $cartItem = Cart::where('cartId', $cartId)->where('userId', $userId)->first();
        if ($scope === 'inc') {
            $cartItem->quantity += 1;
        } else {
            if ($cartItem->quantity > 1) {
                $cartItem->quantity -= 1;
            } else {
                // $cartItem->delete();
                $this->destroy($cartId);
            }
        }
        $cartItem->update();
        return response()->json([
            'status' => 200,
            'message' => 'Thành công!!',
            'cartItem' => $cartItem,
            'user' => $userId


        ]);
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

                    $lastCartId = Cart::selectRaw('SUBSTRING(cartId, -5) AS cartId')
                        ->whereDate('created_at', $days_now)
                        ->orderBy('cartId', 'desc')
                        ->value('cartId');
                    if ($lastCartId) {
                        $newCartIdNumber = substr($lastCartId, -0) + 1;
                    }
                    if ($lastCartId == null) {
                        $newCartId = $dateObj . 'GH00001';
                    } else {
                        $newCartId = $dateObj . 'GH' . str_pad($newCartIdNumber, 5, '0', STR_PAD_LEFT);
                    }
                    $sizeItemObject = json_decode($request->selectedSize);


                    $cardDuplicated = Cart::where('userId', $userId)
                        ->where('productId', $sizeItemObject->productId)
                        ->where('sizeId', $sizeItemObject->sizeId)
                        ->value('cartId');

                    if ($cardDuplicated) {

                        $cart = Cart::find($cardDuplicated);
                        $cart->quantity +=  $request->quantity;

                        $cart->save();
                        return response()->json([
                            'status' => 400,
                            'message' => 'Product Created Successfully!!',
                            'cart' => $cart,
                            'user' => Auth::user()->userId

                        ]);
                    } else {

                        $cart = new Cart;
                        $cart->cartId  = $newCartId;
                        $cart->quantity  = $request->quantity;
                        $cart->price  =  $sizeItemObject->price;

                        $cart->userId  = $userId;
                        $cart->productId  = $sizeItemObject->productId;
                        $cart->sizeId  = $sizeItemObject->sizeId;

                        $cart->save();
                        return response()->json([
                            'status' => 400,
                            'message' => 'Product Created Successfully!!',
                            'cart' => $cart,
                            'user' => Auth::user()->userId


                        ]);
                    }
                } else {
                    return response()->json([
                        'message' => 'Gặp lỗi khi cập nhật!!',
                        'status' => 202,
                        'user' => Auth::user()->userId
                        // 'user' => $loggeduser,
                    ]);
                }
            } catch (\Exception $e) {
                return response()->json([
                    'message' => 'Gặp lỗi khi cập nhật!!',
                    'eee' => 'Lỗi: ' . $e->getMessage(),
                    'status' => 201,
                    'user' => Auth::user(),

                ]);
            }
        }
    }
}
