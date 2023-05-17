<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\TypeCategories;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductsController extends Controller
{
    public function newProducts()
    {
        $posts = Product::where('created_at', '>=', Carbon::now()->subDays(30))->where('status', '=', 1)->orderBy("created_at", "desc")->paginate(2);
        return $posts;
    }


    public function hotProducts()
    {
        $posts = Product::where("rating", ">=", 4)->orderBy("rating", "desc")->where('status', '=', 1)->get();
        return $posts;


        // return DB::table('products')
        // ->select('name','alias', DB::raw('max(rating) as rating'))
        // // ->where("rating", ">=", 4)
        // ->groupBy('productId')
        // ->orderBy('rating', 'desc')
        // ->take(3) // chỉ lấy sản phẩm có số lượng lớn nhất
        // ->get();


    }

    public function showDetail(Request $request)
    {
        $alias = $request->input('alias');

        $productDetail = Product::with('productImage')->where('alias', $alias)
            ->get();

        return response()->json([
            'productDetail' => $productDetail
        ]);
    }


    public function showTypeCategories(Request $request)
    {
        $alias = $request->input('alias');
        $typeCategoryId = DB::table('type_categories')->where('alias', $alias)->where('status', '=', 1)->pluck('typeCategoryId');
        $data = Product::orderBy("productId", "desc")->where('typeCategoryId', $typeCategoryId)->paginate(1);;
        return $data;
    }

    public function showCategories(Request $request)
    {
        $alias = $request->input('alias');
        $categoryId = DB::table('categories')->where('alias', $alias)->where('status', '=', 1)->pluck('categoryId');
        $typeCategoryId = DB::table('type_categories')->where('categoryId', $categoryId)->where('status', '=', 1)->pluck('typeCategoryId');
        $data = Product::orderBy("productId", "desc")->whereIn('typeCategoryId', $typeCategoryId)->paginate(1);
        return $data;
    }



    // public function index()
    // {
    //     $productDetail = Product::with('typeCategory')->where('alias', $alias)
    //         ->get();

    //     return $productDetail;
    // }
    // public function showDetail(Request $request)
    // {
    //     $alias = $request->input('alias');
    //     $salesData = [
    //         'totalSales' => $this->show($alias),

    //     ];
    //     return response()->json($salesData);
    // }
}
