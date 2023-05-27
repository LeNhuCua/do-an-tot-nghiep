<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\InvoicesController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\ProductsController;
use App\Http\Controllers\Admin\UsersController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Admin\ProductTypesController;
use App\Http\Controllers\Admin\SizeController;
use App\Http\Controllers\Admin\SlideController;
use App\Http\Controllers\Admin\StatisticalController;
use App\Http\Controllers\Admin\SubCategoriesController;
use App\Http\Controllers\Admin\TypeCategoriesController;
use App\Http\Controllers\Admin\UnitsController;
use App\Http\Controllers\Customer\CartsController;
use App\Http\Controllers\Customer\CustomerAddressesController;
use App\Http\Controllers\Customer\DistrictsController;
use App\Http\Controllers\Customer\OrderController;
use App\Http\Controllers\Customer\PaymentMethodsController;
use App\Http\Controllers\Customer\ProductsController as CustomerProductsController;
use App\Http\Controllers\Customer\UsersController as CustomerUserController;
use App\Http\Controllers\Customer\ProvincesController;
use App\Http\Controllers\Customer\ShippingCostsController;
use App\Http\Controllers\Customer\WardsController;
use App\Http\Middleware\CheckAccess;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/


//danh mục sản phẩm
// Route::middleware(['access'])->group(function () {
Route::group(['prefix' => 'categories'], function () {
    Route::resource('/', CategoryController::class);
    Route::post('/importExcel', [CategoryController::class, 'importExcel']);
    Route::delete('/deleteAll', [CategoryController::class, 'deleteAll']);
    Route::get('/{id}', [CategoryController::class, 'show']);
    Route::put('/{id}', [CategoryController::class, 'update']);
    Route::delete('/{categoryId}', [CategoryController::class, 'destroy']);
});
// });
Route::get('/index1', [CategoryController::class, 'index1']);


//danh mục con

Route::group(['prefix' => 'typeCategories'], function () {
    Route::resource('/', TypeCategoriesController::class);
    Route::post('/importExcel', [TypeCategoriesController::class, 'importExcel']);
    Route::delete('/deleteAll', [TypeCategoriesController::class, 'deleteAll']);
    Route::get('/{id}', [TypeCategoriesController::class, 'show']);
    Route::put('/{id}', [TypeCategoriesController::class, 'update']);
    Route::delete('/{typeCategoryId}', [TypeCategoriesController::class, 'destroy']);
});

// //danh mục con

// Route::group(['prefix' => 'subcategories'], function () {
//     Route::resource('/', SubCategoriesController::class);
//     Route::post('/importExcel', [SubCategoriesController::class, 'importExcel']);
//     Route::delete('/deleteAll', [SubCategoriesController::class, 'deleteAll']);
//     Route::get('/{id}', [SubCategoriesController::class, 'show']);
//     Route::put('/{id}', [SubCategoriesController::class, 'update']);
//     Route::delete('/{category}', [SubCategoriesController::class, 'destroy']);
// });

// loại sản phẩm
Route::group(['prefix' => 'productsType'], function () {
    Route::resource('/', ProductTypesController::class);
    Route::post('/importExcel', [ProductTypesController::class, 'importExcel']);
    Route::delete('/deleteAll', [ProductTypesController::class, 'deleteAll']);
    Route::get('/{id}', [ProductTypesController::class, 'show']);
    Route::put('/{id}', [ProductTypesController::class, 'update']);
    Route::delete('/{productType}', [ProductTypesController::class, 'destroy']);
});

//đơn vị tính
Route::group(['prefix' => 'units'], function () {
    Route::resource('/', UnitsController::class);
    Route::post('/importExcel', [UnitsController::class, 'importExcel']);
    Route::delete('/deleteAll', [UnitsController::class, 'deleteAll']);
    Route::get('/{id}', [UnitsController::class, 'show']);
    Route::put('/{id}', [UnitsController::class, 'update']);
    Route::delete('/{unit}', [UnitsController::class, 'destroy']);
});


//kích thước
Route::group(['prefix' => 'sizes'], function () {
    Route::resource('/', SizeController::class);
    Route::post('/importExcel', [SizeController::class, 'importExcel']);
    Route::delete('/deleteAll', [SizeController::class, 'deleteAll']);
    Route::get('/{id}', [SizeController::class, 'show']);
    Route::post('/{id}', [SizeController::class, 'update']);
    Route::delete('/{productImage}', [SizeController::class, 'deleteImages']);
});



//sản phẩm
Route::group(['prefix' => 'products'], function () {
    Route::resource('/', ProductsController::class);
    Route::post('/importExcel', [ProductsController::class, 'importExcel']);
    Route::delete('/deleteAll', [ProductsController::class, 'deleteAll']);
    Route::get('/{id}', [ProductsController::class, 'show']);
    Route::post('/{id}', [ProductsController::class, 'update']);
    Route::delete('/{productImage}', [ProductsController::class, 'deleteImages']);
});



//slide
Route::group(['prefix' => 'slides'], function () {
    Route::resource('/', SlideController::class);
    Route::post('/importExcel', [SlideController::class, 'importExcel']);
    Route::delete('/deleteAll', [SlideController::class, 'deleteAll']);
    Route::get('/{id}', [SlideController::class, 'show']);
    Route::post('/{id}', [SlideController::class, 'update']);
    Route::delete('/{productImage}', [SlideController::class, 'deleteImages']);
});



//hoá đơn
Route::group(['prefix' => 'invoices'], function () {
    Route::resource('/', InvoicesController::class);
    Route::post('/importExcel', [ProductsController::class, 'importExcel']);
    Route::delete('/deleteAll', [ProductsController::class, 'deleteAll']);
    Route::get('/{id}', [ProductsController::class, 'show']);
    Route::post('/{id}', [ProductsController::class, 'update']);
    Route::delete('/{productImage}', [ProductsController::class, 'deleteImages']);
});




//thống kê
Route::group(['prefix' => 'statistical'], function () {

    Route::get('/sales-data', [StatisticalController::class, 'getSalesDataByDay']);
    Route::get('/sales-data-month', [StatisticalController::class, 'getSalesDataByMonth']);
});



Route::group(['prefix' => 'users'], function () {
    Route::resource('/', InvoicesController::class);
    // Route::get('/lastUserId', [UsersController::class, 'lastUserId']);

    // Route::post('/importExcel', [ProductsController::class, 'importExcel']);
    // Route::delete('/deleteAll', [ProductsController::class, 'deleteAll']);
    // Route::get('/{id}', [ProductsController::class, 'show']);
    // Route::post('/{id}', [ProductsController::class, 'update']);
    // Route::delete('/{productImage}', [ProductsController::class, 'deleteImages']);
});




Route::group(['prefix' => 'orders'], function () {
    Route::resource('/', AdminOrderController::class);
    Route::put('/orderCheck', [AdminOrderController::class, 'orderCheck']);
    Route::put('/orderCancel', [AdminOrderController::class, 'orderCancel']);
    
    // Route::get('/lastUserId', [UsersController::class, 'lastUserId']);

    // Route::post('/importExcel', [ProductsController::class, 'importExcel']);
    // Route::delete('/deleteAll', [ProductsController::class, 'deleteAll']);
    // Route::get('/{id}', [ProductsController::class, 'show']);
    // Route::post('/{id}', [ProductsController::class, 'update']);
    // Route::delete('/{productImage}', [ProductsController::class, 'deleteImages']);
});



//KHÁCH HÀNG

//giao diện





Route::group(['prefix' => 'cus-products'], function () {
    Route::get('/categories', [CustomerProductsController::class, 'categories']);
    Route::get('/newProducts', [CustomerProductsController::class, 'newProducts']);
    Route::get('/hotProducts', [CustomerProductsController::class, 'hotProducts']);
    Route::get('/relatedProducts', [CustomerProductsController::class, 'relatedProducts']);
    Route::get('/showDetail', [CustomerProductsController::class, 'showDetail']);
    Route::get('/showTypeCategories', [CustomerProductsController::class, 'showTypeCategories']);
    Route::get('/showCategories', [CustomerProductsController::class, 'showCategories']);
    Route::get('/search', [CustomerProductsController::class, 'search']);
    Route::get('/searchProducts', [CustomerProductsController::class, 'searchProducts']);

    //đăng kí tài khoản
    Route::post('/signupCus', [CustomerUserController::class, 'signupCus']);
    // Route::get('/sales-data-month', [StatisticalController::class, 'getSalesDataByMonth']);
});
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/send-email', 'App\Http\Controllers\MailController@sendEmail');
});

//giỏ hàng// 
Route::middleware(['auth:sanctum'])->group(function () {

    Route::group(['prefix' => 'cart'], function () {
        Route::resource('/', CartsController::class);
        Route::put('/{id}/{scope}', [CartsController::class, 'update']);
        Route::delete('/{id}', [CartsController::class, 'destroy']);
        Route::get('/totalCart', [CartsController::class, 'totalCart']);
    });
});

//đặt hàng

//thêm địa chỉ giao hàng
Route::middleware(['auth:sanctum'])->group(function () {
    Route::group(['prefix' => 'customerAddresses'], function () {
        Route::resource('/', CustomerAddressesController::class);
        Route::get('/{id}', [CustomerAddressesController::class, 'show']);

        // Route::put('/{id}/{scope}', [CustomerAddressesController::class, 'update']);
        // Route::delete('/{id}', [CustomerAddressesController::class, 'destroy']);
        // Route::get('/totalCart', [CustomerAddressesController::class, 'totalCart']);
    });
});

Route::group(['prefix' => 'provinces'], function () {
    Route::resource('/', ProvincesController::class);
    Route::get('/{id}/districts', [DistrictsController::class, 'index']);
    // Route::get('/districts/{id}/wards', [WardsController::class, 'index']);

});

Route::group(['prefix' => 'districts'], function () {
    // Route::resource('/', ProvincesController::class);
    Route::get('/{id}/wards', [WardsController::class, 'index']);
});

//phí giao hàng
Route::group(['prefix' => 'shippingCosts'], function () {
    // Route::resource('/', ProvincesController::class);
    Route::get('/{provinceId}/{districtId}/{wardId}', [ShippingCostsController::class, 'index']);
});

//phương thức thanh toán
Route::group(['prefix' => 'cus-payment'], function () {
    Route::get('/paymentMethod', [PaymentMethodsController::class, 'paymentMethod']);
    Route::get('/shippingMethods', [PaymentMethodsController::class, 'shippingMethods']);
});




//Đặt hàng
Route::middleware(['auth:sanctum'])->group(function () {
    Route::group(['prefix' => 'cus-order'], function () {
        Route::resource('/', OrderController::class);
        Route::get('/show', [OrderController::class, 'show']);
        Route::put('/orderCancel', [OrderController::class, 'orderCancel']);


        // Route::get('/index/{id}', [OrderController::class, 'index']);
    });
});


// Route::group(['prefix' => 'wards'], function () {
//     // Route::resource('/', ProvincesController::class);
//     Route::get('/districts/{id}/wards', [WardsController::class, 'index']);
// });


// // Route::get('/provinces', 'TinhController@index');
// Route::get('/tinhs/{id}/huyens', 'HuyenController@index');
// Route::get('/huyens/{id}/xas', 'XaController@index');





// Route::resource('/adminUsers', UsersController::class);




// });

Route::post('/signup', [UsersController::class, 'signup']);



Route::post('/login', [AuthController::class, 'login']);


Route::get('/confirm-account/{token}', [CustomerUserController::class, 'confirmAccount']);


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'logged_user']);

    // Route::get('/user', function (Request $request) {
    //     return $request->user();
    // });

});


// Route::middleware(['auth:sanctum'])->group(function(){
//     Route::post('/logout', [UserController::class, 'logout']);
//     Route::get('/loggeduser', [UserController::class, 'logged_user']);
//     Route::post('/changepassword', [UserController::class, 'change_password']);
// });



// Route::post('/login', function (Request $request) {
//     $credentials = $request->only('account', 'password');
//     if (Auth::guard('admin')->attempt($credentials)) {
//         $user = Auth::guard('admin')->user();
//         $token = $user->createToken('admin-token')->plainTextToken;
//         return response()->json([
//             'access_token' => $token,
//             'token_type' => 'Bearer',
//             'expires_in' => config('sanctum.expiration'),
//         ]);
//     } else {
//         return response()->json(['message' => 'Unauthorized'], 401);
//     }
// });
// Route::get('/allproducts', [CategoryController::class, 'allproducts']);
// Route::get('/allproducts',[ProductsController::class]);


// Route::resource('/categories',CategoryController::class);
// Route::post('/importExcelCategories', [CategoryController::class, 'importExcel']);
// Route::delete('/deleteAllCategories', [CategoryController::class, 'deleteAll']);



// Route::group(['prefix' => 'categories', 'middleware' => 'authorize:admin'], function () {
//     Route::resource('/', CategoryController::class);
//     Route::post('/importExcel', [CategoryController::class, 'importExcel']);
//     Route::delete('/deleteAll', [CategoryController::class, 'deleteAll']);
// });


// Route::middleware('authorize:admin')->resource('categories', SanPhamController::class);
// Route::middleware(['access'])->group(function () {
//     Route::group(['prefix' => 'categories'], function () {
//         Route::resource('/', CategoryController::class);
//         Route::post('/importExcel', [CategoryController::class, 'importExcel']);
//         Route::delete('/deleteAll', [CategoryController::class, 'deleteAll']);
//     });
// });
// Route::resource('/productsType', ProductTypesController::class);
// // Route::get('/productsType1:{id}', [ProductTypesController::class, 'show']);


// Route::post('/importExcelProductsType', [ProductTypesController::class, 'importExcel']);

// Route::delete('/deleteAllProductsType', [ProductTypesController::class, 'deleteAll']);



Route::resource('/adminUsers', UsersController::class);


// Route::post('/importExcel', [AuthController::class, 'importExcel']);
// Route::get('/', function () {
//     // ...
// })->middleware(['cors']);