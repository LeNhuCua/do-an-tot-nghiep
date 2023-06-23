<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Info;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class InfoController extends Controller
{


    public function index()
    {
        $posts = Info::orderBy("created_at", "desc")->get();

        return $posts;
        // return Category::select('unitId', 'alias', 'name', 'status')->get();
    }


    public function  update(Request $request, $id)
    {


        $messages = [
            'required' => 'Trường :attribute phải nhập',
            'unique' => 'Trường :attribute đã tồn tại'

        ];
        $validator = Validator::make($request->all(), [], $messages);
        if ($validator->fails()) {
            return response()->json([
                'validation_error' => $validator->errors(),
                'message' => 'Kiểm tra lại thông tin',

            ]);
        } else {
            try {
                $product = Info::findOrFail($id);
                $product->phone  = $request->phone;
                $product->bankName  = $request->bankName;
                $product->accountName  = $request->accountName;
                $product->accountNumber  = $request->accountNumber;
                $product->save();
                return response()->json([
                    'status' => 400,
                    'message' => 'Product Updated Successfully!!',
                    'product' => $product,
     
                ]);
            } catch (\Exception $e) {
                return response()->json([
                    'status' => 201,
                    'message' => 'Failed to update product: ' . $e->getMessage()
                ]);
            }
        }
    }
}
