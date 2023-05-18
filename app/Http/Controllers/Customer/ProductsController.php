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
        $data = Product::orderBy("created_at", "desc")->whereIn('typeCategoryId', $typeCategoryId)->paginate(2);

        if ($request->input('sort') && $request->input('fillPrice')) {
            $sort = $request->input('sort');
            $fillPrice = $request->input('fillPrice');
            $priceRange = [];
            if ($fillPrice === 'nho') {
                $priceRange = ['0', '1000000'];
            } else if ($fillPrice === 'lon') {
                $priceRange = ['1000000', '999999999'];
            }
            if ($sort === 'price-asc') {
                $data = Product::orderByPrice('asc')->whereIn('typeCategoryId', $typeCategoryId)->filterByPrice($priceRange[0], $priceRange[1])->paginate(2);
            } else if ($sort === 'price-desc') {
                $data = Product::orderByPrice('desc')->whereIn('typeCategoryId', $typeCategoryId)->filterByPrice($priceRange[0], $priceRange[1])->paginate(2);
            } else if ($sort === 'name-asc') {
                $data = Product::orderBy("name", 'asc')->whereIn('typeCategoryId', $typeCategoryId)->filterByPrice($priceRange[0], $priceRange[1])->paginate(2);
            } else if ($sort === 'name-desc') {
                $data = Product::orderBy("name", 'desc')->whereIn('typeCategoryId', $typeCategoryId)->filterByPrice($priceRange[0], $priceRange[1])->paginate(2);
            } else if ($sort === 'best-selling') {
                $data = Product::orderBy("numberBuy", 'desc')->whereIn('typeCategoryId', $typeCategoryId)->filterByPrice($priceRange[0], $priceRange[1])->paginate(2);
            }
        } else if ($request->input('sort')) {
            $sort = $request->input('sort');
            if ($sort === 'price-asc') {
                $data = Product::orderByPrice('asc')->whereIn('typeCategoryId', $typeCategoryId)->paginate(2);
            } else if ($sort === 'price-desc') {
                $data = Product::orderByPrice('desc')->whereIn('typeCategoryId', $typeCategoryId)->paginate(2);
            } else if ($sort === 'name-asc') {
                $data = Product::orderBy("name", 'asc')->whereIn('typeCategoryId', $typeCategoryId)->paginate(2);
            } else if ($sort === 'name-desc') {
                $data = Product::orderBy("name", 'desc')->whereIn('typeCategoryId', $typeCategoryId)->paginate(2);
            } else if ($sort === 'best-selling') {
                $data = Product::orderBy("numberBuy", 'desc')->whereIn('typeCategoryId', $typeCategoryId)->paginate(2);
            }
        } else if ($request->input('fillPrice')) {
            $fillPrice = $request->input('fillPrice');
            if ($fillPrice === 'nho') {
                $data = Product::filterByPrice('0', '1000000')->whereIn('typeCategoryId', $typeCategoryId)->paginate(2);
            } else if ($fillPrice === 'lon') {
                $data = Product::filterByPrice('1000000', '999999999')->whereIn('typeCategoryId', $typeCategoryId)->paginate(2);
            }
        }



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
