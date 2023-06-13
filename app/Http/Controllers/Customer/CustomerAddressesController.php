<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CustomerAddress;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CustomerAddressesController extends Controller
{
    public function index()
    {
        $userId = Auth::user()->userId;
        $cart = CustomerAddress::orderBy("created_at", "desc")->where('userId', $userId)->get();

        return $cart;
    }

    public function show($id)
    {
        $customerAddress = CustomerAddress::findOrFail($id);

        return response()->json([
            'customerAddress' => $customerAddress
        ]);
    }

    public function update(Request $request, $addressId)
    {

        $messages = [
            'required' => 'Trường :attribute phải nhập',

        ];
        $validator = Validator::make($request->all(), [
           
        ], $messages);

        if ($validator->fails()) {
            return response()->json([
                'validation_error' => $validator->errors(),
                'message' => 'Kiểm tra lại thông tin',

            ]);
        } else {
            try {

                $customerAddress = CustomerAddress::findOrFail($addressId);
                // $customerAddress->recipientName = $request->recipientName;
                // $customerAddress->recipientAddress = $request->recipientAddress;
                // $customerAddress->recipientPhone = $request->recipientPhone;
                // $customerAddress->provinceId = $request->provinceId;
                // $customerAddress->districtId = $request->districtId;
                // $customerAddress->wardId = $request->wardId;
                // $customerAddress->save();

                $customerAddress->update($request->all());


                return response()->json([
                    'status' => 400,
                    'message' => 'Product Updated Successfully!!',
                    'customerAddress' => $customerAddress
                ]);
            } catch (\Exception $e) {
                return response()->json([
                    'message' => 'Gặp lỗi khi cập nhật!!',
                    'eee' => 'Lỗi: ' . $e->getMessage(),
                    'status' => 201,

                ]);
            }
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

                    $lassCustomerAddressId = CustomerAddress::selectRaw('SUBSTRING(addressId, -5) AS addressId')
                        ->whereDate('created_at', $days_now)
                        ->orderBy('addressId', 'desc')
                        ->value('addressId');
                    if ($lassCustomerAddressId) {
                        $newCustomerAddressIdNumber = substr($lassCustomerAddressId, -0) + 1;
                    }
                    if ($lassCustomerAddressId == null) {
                        $newAddressId = $dateObj . 'DC00001';
                    } else {
                        $newAddressId = $dateObj . 'DC' . str_pad($newCustomerAddressIdNumber, 5, '0', STR_PAD_LEFT);
                    }


                    $customerAddress = new CustomerAddress;
                    $customerAddress->addressId  = $newAddressId;
                    $customerAddress->recipientName  = $request->recipientName;
                    $customerAddress->recipientAddress  = $request->recipientAddress;
                    $customerAddress->recipientPhone  = $request->recipientPhone;
                    $customerAddress->provinceId  = $request->provinceId;
                    $customerAddress->districtId  = $request->districtId;
                    $customerAddress->wardId  = $request->wardId;
                    $customerAddress->userId  = $userId;

                    $customerAddress->save();
                    return response()->json([
                        'status' => 400,
                        'message' => 'CustomerAddress Created Successfully!!',
                        'customerAddress' => $customerAddress,


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
