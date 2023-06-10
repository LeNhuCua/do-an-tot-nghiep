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
    //Trang chủ
    public function newProducts()
    {
        $posts = Product::where('created_at', '>=', Carbon::now()->subDays(30))->where('status', '=', 1)->orderBy("created_at", "desc")->paginate(5);
        return $posts;
    }


    public function hotProducts()
    {
        $posts = Product::where("rating", ">=", 4)->orderBy("rating", "desc")->where('status', '=', 1)->get();
        return $posts;
    }



    public function relatedProducts(Request $request)
    {
        $alias = $request->input('alias');

        $productTypeId = Product::where('alias', $alias)
            ->pluck('productTypeId');

        $relatedProduct = Product::with('productImage')->where('productTypeId', $productTypeId)
            ->inRandomOrder()
            ->limit(8) // Đổi giá trị "5" thành số bản ghi bạn muốn lấy
            ->get();

        return response()->json([
            'relatedProduct' => $relatedProduct
        ]);
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

    //danh mục
    // hiển thị danh mục

    public function categories()
    {
        $categories = Category::with('typeCategory')->orderBy("created_at", "desc")->get();

        return $categories;
    }




    public function showTypeCategories(Request $request)
    {
        $alias = $request->input('alias');
        $typeCategoryId = DB::table('type_categories')->where('alias', $alias)->where('status', '=', 1)->pluck('typeCategoryId');
        // $data = Product::orderBy("productId", "desc")->where('typeCategoryId', $typeCategoryId)->paginate(1);;

        $typeCategoryName = DB::table('type_categories')->where('alias', $alias)->where('status', '=', 1)->pluck('name');
        $categoryName = DB::table('type_categories')
            ->join('categories', 'type_categories.categoryId', '=', 'categories.categoryId')
            ->select('categories.name','categories.alias')
            ->where('type_categories.alias', '=', $alias)
            ->get();


        if ($request->input('sort') && $request->input('fillPrice')) {
            $sort = $request->input('sort');
            $fillPrice = $request->input('fillPrice');
            $priceRange = [];
            if ($fillPrice === 'lessTwo') {
                $priceRange = ['0', '2000000'];
            } else if ($fillPrice === 'betweenTwoAndSix') {
                $priceRange = ['2000000', '6000000'];
            } else if ($fillPrice === 'betweenSixAndTen') {
                $priceRange = ['6000000', '10000000'];
            } else if ($fillPrice === 'betweenTenAndTwenty') {
                $priceRange = ['10000000', '20000000'];
            } else if ($fillPrice === 'greaterTwenty') {
                $priceRange = ['20000000', '999999999'];
            }
            if ($sort === 'price-asc') {
                $data = Product::orderByPrice('asc')->whereIn('typeCategoryId', $typeCategoryId)->filterByPrice($priceRange[0], $priceRange[1])->paginate(5);
            } else if ($sort === 'price-desc') {
                $data = Product::orderByPrice('desc')->whereIn('typeCategoryId', $typeCategoryId)->filterByPrice($priceRange[0], $priceRange[1])->paginate(5);
            } else if ($sort === 'name-asc') {
                $data = Product::orderBy("name", 'asc')->whereIn('typeCategoryId', $typeCategoryId)->filterByPrice($priceRange[0], $priceRange[1])->paginate(5);
            } else if ($sort === 'name-desc') {
                $data = Product::orderBy("name", 'desc')->whereIn('typeCategoryId', $typeCategoryId)->filterByPrice($priceRange[0], $priceRange[1])->paginate(5);
            } else if ($sort === 'best-selling') {
                $data = Product::orderBy("numberBuy", 'desc')->whereIn('typeCategoryId', $typeCategoryId)->filterByPrice($priceRange[0], $priceRange[1])->paginate(5);
            }
        } else if ($request->input('sort')) {
            $sort = $request->input('sort');
            if ($sort === 'price-asc') {
                $data = Product::orderByPrice('asc')->whereIn('typeCategoryId', $typeCategoryId)->paginate(5);
            } else if ($sort === 'price-desc') {
                $data = Product::orderByPrice('desc')->whereIn('typeCategoryId', $typeCategoryId)->paginate(5);
            } else if ($sort === 'name-asc') {
                $data = Product::orderBy("name", 'asc')->whereIn('typeCategoryId', $typeCategoryId)->paginate(5);
            } else if ($sort === 'name-desc') {
                $data = Product::orderBy("name", 'desc')->whereIn('typeCategoryId', $typeCategoryId)->paginate(5);
            } else if ($sort === 'best-selling') {
                $data = Product::orderBy("numberBuy", 'desc')->whereIn('typeCategoryId', $typeCategoryId)->paginate(5);
            }
        } else if ($request->input('fillPrice')) {
            $fillPrice = $request->input('fillPrice');
            if ($fillPrice === 'lessTwo') {
                $data = Product::filterByPrice('0', '1000000')->whereIn('typeCategoryId', $typeCategoryId)->paginate(5);
            } else if ($fillPrice === 'betweenTwoAndSix') {
                $data = Product::filterByPrice('1000000', '999999999')->whereIn('typeCategoryId', $typeCategoryId)->paginate(5);
            }
        }

        return response()->json([
            'data' => $data,
            'status' => 200,
            'typeCategoryName' => $typeCategoryName,
            'categoryName' => $categoryName

        ]);
    }

    public function showCategories(Request $request)
    {
        $alias = $request->input('alias');
        $categoryId = DB::table('categories')->where('alias', $alias)->where('status', '=', 1)->pluck('categoryId');
        $typeCategoryId = DB::table('type_categories')->where('categoryId', $categoryId)->where('status', '=', 1)->pluck('typeCategoryId');
        // $data = Product::orderBy("created_at", "desc")->whereIn('typeCategoryId', $typeCategoryId)->paginate(5);
        $categoryName = DB::table('categories')->where('alias', $alias)->where('status', '=', 1)->pluck('name');

        if ($request->input('sort') && $request->input('fillPrice')) {
            $sort = $request->input('sort');
            $fillPrice = $request->input('fillPrice');
            $priceRange = [];
            if ($fillPrice === 'lessTwo') {
                $priceRange = ['0', '1999999'];
            } else if ($fillPrice === 'betweenTwoAndSix') {
                $priceRange = ['2000000', '5999999'];
            } else if ($fillPrice === 'betweenSixAndTen') {
                $priceRange = ['6000000', '9999999'];
            } else if ($fillPrice === 'betweenTenAndTwenty') {
                $priceRange = ['10000000', '19999999'];
            } else if ($fillPrice === 'greaterTwenty') {
                $priceRange = ['20000000', '999999999'];
            }
            if ($sort === 'price-asc') {
                $data = Product::orderByPrice('asc')->whereIn('typeCategoryId', $typeCategoryId)->filterByPrice($priceRange[0], $priceRange[1])->paginate(5);
            } else if ($sort === 'price-desc') {
                $data = Product::orderByPrice('desc')->whereIn('typeCategoryId', $typeCategoryId)->filterByPrice($priceRange[0], $priceRange[1])->paginate(5);
            } else if ($sort === 'name-asc') {
                $data = Product::orderBy("name", 'asc')->whereIn('typeCategoryId', $typeCategoryId)->filterByPrice($priceRange[0], $priceRange[1])->paginate(5);
            } else if ($sort === 'name-desc') {
                $data = Product::orderBy("name", 'desc')->whereIn('typeCategoryId', $typeCategoryId)->filterByPrice($priceRange[0], $priceRange[1])->paginate(5);
            } else if ($sort === 'best-selling') {
                $data = Product::orderBy("numberBuy", 'desc')->whereIn('typeCategoryId', $typeCategoryId)->filterByPrice($priceRange[0], $priceRange[1])->paginate(5);
            }
        } else if ($request->input('sort')) {
            $sort = $request->input('sort');
            if ($sort === 'price-asc') {
                $data = Product::orderByPrice('asc')->whereIn('typeCategoryId', $typeCategoryId)->paginate(5);
            } else if ($sort === 'price-desc') {
                $data = Product::orderByPrice('desc')->whereIn('typeCategoryId', $typeCategoryId)->paginate(5);
            } else if ($sort === 'name-asc') {
                $data = Product::orderBy("name", 'asc')->whereIn('typeCategoryId', $typeCategoryId)->paginate(5);
            } else if ($sort === 'name-desc') {
                $data = Product::orderBy("name", 'desc')->whereIn('typeCategoryId', $typeCategoryId)->paginate(5);
            } else if ($sort === 'best-selling') {
                $data = Product::orderBy("numberBuy", 'desc')->whereIn('typeCategoryId', $typeCategoryId)->paginate(5);
            }
        } else if ($request->input('fillPrice')) {
            $fillPrice = $request->input('fillPrice');
            if ($fillPrice === 'lessTwo') {
                $data = Product::filterByPrice('0', '1000000')->whereIn('typeCategoryId', $typeCategoryId)->paginate(5);
            } else if ($fillPrice === 'betweenTwoAndSix') {
                $data = Product::filterByPrice('1000000', '999999999')->whereIn('typeCategoryId', $typeCategoryId)->paginate(5);
            }
        }

        return response()->json([
            'data' => $data,
            'status' => 200,
            'categoryName' => $categoryName


        ]);
    }


    public function search(Request $request)
    {
        $term = $request->input('term');
        $results = Product::searchByPrice($term)->orWhere('name', 'like', '%' . $term . '%')->take(4)->get();

        return response()->json(['results' => $results]);
    }



    public function searchProducts(Request $request)
    {
        $search = $request->input('search');
        $data = Product::searchByPrice($search)->orWhere('name', 'like', '%' . $search . '%')->paginate(5);


        // $data = Product::orderBy("productId", "desc")->where('typeCategoryId', $typeCategoryId)->paginate(1);;
        if ($request->input('sort') && $request->input('fillPrice')) {
            $sort = $request->input('sort');
            $fillPrice = $request->input('fillPrice');
            $priceRange = [];
            if ($fillPrice === 'lessTwo') {
                $priceRange = ['0', '2000000'];
            } else if ($fillPrice === 'betweenTwoAndSix') {
                $priceRange = ['2000000', '6000000'];
            } else if ($fillPrice === 'betweenSixAndTen') {
                $priceRange = ['6000000', '10000000'];
            } else if ($fillPrice === 'betweenTenAndTwenty') {
                $priceRange = ['10000000', '20000000'];
            } else if ($fillPrice === 'greaterTwenty') {
                $priceRange = ['20000000', '999999999'];
            }
            if ($sort === 'price-asc') {
                $data = Product::orderByPrice('asc')->searchByPrice($search)->orWhere('name', 'like', '%' . $search . '%')->filterByPrice($priceRange[0], $priceRange[1])->paginate(5);
            } else if ($sort === 'price-desc') {
                $data = Product::orderByPrice('desc')->searchByPrice($search)->orWhere('name', 'like', '%' . $search . '%')->filterByPrice($priceRange[0], $priceRange[1])->paginate(5);
            } else if ($sort === 'name-asc') {
                $data = Product::orderBy("name", 'asc')->searchByPrice($search)->orWhere('name', 'like', '%' . $search . '%')->filterByPrice($priceRange[0], $priceRange[1])->paginate(5);
            } else if ($sort === 'name-desc') {
                $data = Product::orderBy("name", 'desc')->searchByPrice($search)->orWhere('name', 'like', '%' . $search . '%')->filterByPrice($priceRange[0], $priceRange[1])->paginate(5);
            } else if ($sort === 'best-selling') {
                $data = Product::orderBy("numberBuy", 'desc')->searchByPrice($search)->orWhere('name', 'like', '%' . $search . '%')->filterByPrice($priceRange[0], $priceRange[1])->paginate(5);
            }
        } else if ($request->input('sort')) {
            $sort = $request->input('sort');
            if ($sort === 'price-asc') {
                $data = Product::orderByPrice('asc')->searchByPrice($search)->orWhere('name', 'like', '%' . $search . '%')->paginate(5);
            } else if ($sort === 'price-desc') {
                $data = Product::orderByPrice('desc')->searchByPrice($search)->orWhere('name', 'like', '%' . $search . '%')->paginate(5);
            } else if ($sort === 'name-asc') {
                $data = Product::orderBy("name", 'asc')->searchByPrice($search)->orWhere('name', 'like', '%' . $search . '%')->paginate(5);
            } else if ($sort === 'name-desc') {
                $data = Product::orderBy("name", 'desc')->searchByPrice($search)->orWhere('name', 'like', '%' . $search . '%')->paginate(5);
            } else if ($sort === 'best-selling') {
                $data = Product::orderBy("numberBuy", 'desc')->searchByPrice($search)->orWhere('name', 'like', '%' . $search . '%')->paginate(5);
            }
        } else if ($request->input('fillPrice')) {
            $fillPrice = $request->input('fillPrice');
            if ($fillPrice === 'lessTwo') {
                $data = Product::filterByPrice('0', '1000000')->searchByPrice($search)->orWhere('name', 'like', '%' . $search . '%')->paginate(5);
            } else if ($fillPrice === 'betweenTwoAndSix') {
                $data = Product::filterByPrice('1000000', '999999999')->searchByPrice($search)->orWhere('name', 'like', '%' . $search . '%')->paginate(5);
            }
        }

    
        return $data;
    }





    // public function index()
    // {
    //     $productDetail = Product::with('typeCategory')->where('search', $alias)
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
