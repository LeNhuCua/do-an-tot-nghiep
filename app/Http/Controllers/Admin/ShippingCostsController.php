<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\ShippingCost;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Illuminate\Support\Facades\Validator;


class ShippingCostsController extends Controller
{
    public function index()
    {
        $shippingCost = ShippingCost::orderBy("created_at", "desc")->get();

        return $shippingCost;
    }



    public function show($id)
    {
        $shippingCost = ShippingCost::findOrFail($id);

        return response()->json([
            'shippingCost' => $shippingCost
        ]);
    }

    public function update(Request $request, $categoryId)
    {

        $messages = [
            'required' => 'Trường :attribute phải nhập',

        ];
        $validator = Validator::make($request->all(), [
            // 'name' => 'required|max:50',
            // 'status' => 'required',
        ], $messages);

        if ($validator->fails()) {
            return response()->json([
                'validation_error' => $validator->errors(),
                'message' => 'Kiểm tra lại thông tin',

            ]);
        } else {
            try {

                $shipping = ShippingCost::findOrFail($categoryId);

                
                // $category->updateMadm($request->categoryId);
                // $category->categoryId = $request->categoryId;
                // $category->name = $request->name;
                // $shipping->shippingCost = $request->shippingCost;
                // $shipping->save();

                $shipping->update($request->all());

                // $loaiSanPhams = ProductType::where('categoryId', $category->categoryId)->get();
                // foreach ($loaiSanPhams as $loaiSanPham) {
                //     $loaiSanPham->categoryId = $request->categoryId;
                //     $loaiSanPham->save();
                // }

                // ProductType::where('categoryId', $categoryId)->update(['categoryId' => $request->categoryId]);

                return response()->json([
                    'status' => 400,
                    'message' => 'Product Updated Successfully!!',
                    'shippingCost' => $shipping,
                    ' $request->shippingCost' =>  $request->shippingCost
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
}
