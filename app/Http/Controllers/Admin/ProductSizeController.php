<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProductSize;
use Illuminate\Http\Request;

class ProductSizeController extends Controller
{
    public function destroy($id)
    {

        $productSize = ProductSize::find($id);
        if ($productSize) {
            // DB::table('product_types')->whereIn('ProductSizeId', $ProductSizeId)->delete();
            $productSize->delete();
            return response()->json([
                'status' => 200,
                'message' => 'thành công',

            ]);
        } else {
            return response()->json(['message' => 'Không tìm size'], 404);
        }
    }
}
