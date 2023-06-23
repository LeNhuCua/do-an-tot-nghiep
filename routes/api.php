<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\InfoController;
use App\Http\Controllers\Admin\InvoicesController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\ProductsController;
use App\Http\Controllers\Admin\ProductSizeController;
use App\Http\Controllers\Admin\UsersController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Admin\ProductTypesController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\ShippingCostsController as AdminShippingCostsController;
use App\Http\Controllers\Admin\SizeController;
use App\Http\Controllers\Admin\SlideController;
use App\Http\Controllers\Admin\StatisticalController;
use App\Http\Controllers\Admin\StatisticalOnlineController;
use App\Http\Controllers\Admin\SubCategoriesController;
use App\Http\Controllers\Admin\TypeCategoriesController;
use App\Http\Controllers\Admin\UnitsController;
use App\Http\Controllers\Api\ForgotPasswordController;
use App\Http\Controllers\Api\ResetPasswordController;
use App\Http\Controllers\Customer\CartsController;
use App\Http\Controllers\Customer\CustomerAddressesController;
use App\Http\Controllers\Customer\DistrictsController;
use App\Http\Controllers\Customer\OrderController;
use App\Http\Controllers\Customer\PaymentMethodsController;
use App\Http\Controllers\Customer\ProductsController as CustomerProductsController;
use App\Http\Controllers\Customer\UsersController as CustomerUserController;
use App\Http\Controllers\Customer\ProvincesController;
use App\Http\Controllers\Customer\ShippingCostsController;
use App\Http\Controllers\Customer\SlideController as CustomerSlideController;
use App\Http\Controllers\Customer\WardsController;
use App\Http\Controllers\MailController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\UsersController as ControllersUsersController;
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


//phí ship

Route::middleware(['auth:sanctum'])->group(function () {
    Route::middleware(['access'])->group(function () {
        Route::group(['prefix' => 'admin-shippingCosts'], function () {
            Route::resource('/', AdminShippingCostsController::class);
            Route::get('/{id}', [AdminShippingCostsController::class, 'show']);
            Route::put('/{id}', [AdminShippingCostsController::class, 'update']);
        });
    });
});



//danh mục sản phẩm

Route::middleware(['auth:sanctum'])->group(function () {
    Route::middleware(['access'])->group(function () {
        Route::group(['prefix' => 'categories'], function () {
            Route::resource('/', CategoryController::class);
            Route::delete('/deleteAll', [CategoryController::class, 'deleteAll']);
            Route::get('/{id}', [CategoryController::class, 'show']);
            Route::put('/{id}', [CategoryController::class, 'update']);
            Route::delete('/{categoryId}', [CategoryController::class, 'destroy']);
        });
    });
});
Route::post('/categories/importExcel', [CategoryController::class, 'importExcel']);


//danh mục con

Route::middleware(['auth:sanctum'])->group(function () {
    Route::group(['prefix' => 'typeCategories'], function () {
        Route::resource('/', TypeCategoriesController::class);
        Route::delete('/deleteAll', [TypeCategoriesController::class, 'deleteAll']);
        Route::get('/{id}', [TypeCategoriesController::class, 'show']);
        Route::put('/{id}', [TypeCategoriesController::class, 'update']);
        Route::delete('/{typeCategoryId}', [TypeCategoriesController::class, 'destroy']);
    });
});
Route::post('/typeCategories/importExcel', [TypeCategoriesController::class, 'importExcel']);


// loại sản phẩm
Route::middleware(['auth:sanctum'])->group(function () {
    Route::group(['prefix' => 'productsType'], function () {
        Route::resource('/', ProductTypesController::class);
        Route::delete('/deleteAll', [ProductTypesController::class, 'deleteAll']);
        Route::get('/{id}', [ProductTypesController::class, 'show']);
        Route::put('/{id}', [ProductTypesController::class, 'update']);
        Route::delete('/{productType}', [ProductTypesController::class, 'destroy']);
    });
});
Route::post('/productsType/importExcel', [ProductTypesController::class, 'importExcel']);

//đơn vị tính
Route::middleware(['auth:sanctum'])->group(function () {
    Route::group(['prefix' => 'units'], function () {
        Route::resource('/', UnitsController::class);
        Route::delete('/deleteAll', [UnitsController::class, 'deleteAll']);
        Route::get('/{id}', [UnitsController::class, 'show']);
        Route::put('/{id}', [UnitsController::class, 'update']);
        Route::delete('/{unit}', [UnitsController::class, 'destroy']);
    });
});
Route::post('/units/importExcel', [UnitsController::class, 'importExcel']);



// giới thiệu cưa hàng
Route::middleware(['auth:sanctum'])->group(function () {
    Route::group(['prefix' => 'info'], function () {
        Route::resource('/', InfoController::class);
        Route::put('/{id}', [InfoController::class, 'update']);
    });
});


//kích thước
Route::middleware(['auth:sanctum'])->group(function () {
    Route::group(['prefix' => 'sizes'], function () {
        Route::resource('/', SizeController::class);
        Route::delete('/deleteAll', [SizeController::class, 'deleteAll']);
        Route::get('/{id}', [SizeController::class, 'show']);
        Route::put('/{id}', [SizeController::class, 'update']);
    });
});
Route::post('/sizes/importExcel', [SizeController::class, 'importExcel']);


//sản phẩm
Route::middleware(['auth:sanctum'])->group(function () {
    Route::group(['prefix' => 'products'], function () {
        Route::resource('/', ProductsController::class);
        Route::delete('/deleteAll', [ProductsController::class, 'deleteAll']);
        Route::get('/{id}', [ProductsController::class, 'show']);
        Route::post('/{id}', [ProductsController::class, 'update']);
        Route::delete('/{productImage}', [ProductsController::class, 'deleteImages']);
    });
});
Route::post('/products1/importExcel', [ProductsController::class, 'importExcel']);


//nhân viên
Route::middleware(['auth:sanctum'])->group(function () {
    Route::group(['prefix' => 'users'], function () {
        Route::resource('/', UsersController::class);
        Route::delete('/deleteAll', [UsersController::class, 'deleteAll']);
        Route::get('/{id}', [UsersController::class, 'show']);
        Route::put('/{id}', [UsersController::class, 'update']);
    });
});

Route::middleware(['auth:sanctum'])->group(function () {
    Route::group(['prefix' => 'roles'], function () {
        Route::get('/role', [RoleController::class, 'role']);
    });
});


Route::post('/users/importExcel', [ProductsController::class, 'importExcel']);




//slide
Route::middleware(['auth:sanctum'])->group(function () {
    Route::group(['prefix' => 'slides'], function () {
        Route::resource('/', SlideController::class);

        Route::delete('/deleteAll', [SlideController::class, 'deleteAll']);
        Route::get('/{id}', [SlideController::class, 'show']);
        Route::post('/{id}', [SlideController::class, 'update']);
        Route::delete('/{productImage}', [SlideController::class, 'deleteImages']);
    });
});
Route::post('/slides/importExcel', [SlideController::class, 'importExcel']);



//hoá đơn
Route::middleware(['auth:sanctum'])->group(function () {
    Route::group(['prefix' => 'invoices'], function () {
        Route::resource('/', InvoicesController::class);
    });
});


//thống kê
Route::middleware(['auth:sanctum'])->group(function () {
    Route::group(['prefix' => 'statistical'], function () {
        Route::get('/sales-data', [StatisticalController::class, 'getSalesDataByDay']);
        Route::get('/sales-data-month', [StatisticalController::class, 'getSalesDataByMonth']);
        Route::get('/sales-data-year', [StatisticalController::class, 'getSalesDataByYear']);
    });
});

Route::middleware(['auth:sanctum'])->group(function () {
    Route::group(['prefix' => 'statistical-online'], function () {
        Route::get('/sales-data', [StatisticalOnlineController::class, 'getSalesDataByDay']);
        Route::get('/sales-data-month', [StatisticalOnlineController::class, 'getSalesDataByMonth']);
        Route::get('/sales-data-year', [StatisticalOnlineController::class, 'getSalesDataByYear']);
    });
});





Route::middleware(['auth:sanctum'])->group(function () {
    Route::group(['prefix' => 'orders'], function () {
        Route::resource('/', AdminOrderController::class);
        Route::get('/ordersBeingProcessed', [AdminOrderController::class, 'ordersBeingProcessed']);
        Route::get('/ordersBeingDelivered', [AdminOrderController::class, 'ordersBeingDelivered']);
        Route::get('/ordersDelivered', [AdminOrderController::class, 'ordersDelivered']);
        Route::get('/orderCanceled', [AdminOrderController::class, 'orderCanceled']);


        Route::put('/orderCheckDelivery', [AdminOrderController::class, 'orderCheckDelivery']);
        Route::put('/orderCheck', [AdminOrderController::class, 'orderCheck']);
        Route::put('/orderCancel', [AdminOrderController::class, 'orderCancel']);
        Route::put('/orderSuccess', [AdminOrderController::class, 'orderSuccess']);
        Route::put('/orderSuccsessDelivered', [AdminOrderController::class, 'orderSuccsessDelivered']);

        

        Route::delete('/{order}', [AdminOrderController::class, 'destroy']);
    });
});
Route::middleware(['auth:sanctum'])->group(function () {
    Route::group(['prefix' => 'productsSize'], function () {
        Route::delete('/{id}', [ProductSizeController::class, 'destroy']);
        Route::put('/update', [ProductSizeController::class, 'update']);

    });
});


//KHÁCH HÀNG

//giao diện





Route::group(['prefix' => 'cus-products'], function () {
    Route::get('/categories', [CustomerProductsController::class, 'categories']);
    Route::get('/newProducts', [CustomerProductsController::class, 'newProducts']);
    Route::get('/hotProducts', [CustomerProductsController::class, 'hotProducts']);
    Route::get('/bestProduct', [CustomerProductsController::class, 'bestProduct']);
    Route::get('/relatedProducts', [CustomerProductsController::class, 'relatedProducts']);
    Route::get('/showDetail', [CustomerProductsController::class, 'showDetail']);
    Route::get('/showTypeCategories', [CustomerProductsController::class, 'showTypeCategories']);
    Route::get('/showCategories', [CustomerProductsController::class, 'showCategories']);
    Route::get('/search', [CustomerProductsController::class, 'search']);
    Route::get('/searchProducts', [CustomerProductsController::class, 'searchProducts']);
    Route::get('/slides', [CustomerSlideController::class, 'index']);
    Route::get('/info', [CustomerSlideController::class, 'info']);
    //đăng kí tài khoản
    Route::post('/signupCus', [CustomerUserController::class, 'signupCus']);
    // Route::get('/sales-data-month', [StatisticalController::class, 'getSalesDataByMonth']);
});
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/send-email', [MailController::class, 'sendEmail']);
    Route::post('/rating', [CustomerProductsController::class, 'rating']);
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
        Route::put('/{id}', [CustomerAddressesController::class, 'update']);
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
        Route::put('/orderSuccsess', [OrderController::class, 'orderSuccsess']);
        Route::put('/orderReturns', [OrderController::class, 'orderReturns']);
        


        // Route::get('/index/{id}', [OrderController::class, 'index']);
    });
});



Route::get('/messages', [MessageController::class, 'index']);
Route::post('/messages', [MessageController::class, 'store']);

// Route::group(['prefix' => 'wards'], function () {
//     // Route::resource('/', ProvincesController::class);
//     Route::get('/districts/{id}/wards', [WardsController::class, 'index']);
// });


// // Route::get('/provinces', 'TinhController@index');
// Route::get('/tinhs/{id}/huyens', 'HuyenController@index');
// Route::get('/huyens/{id}/xas', 'XaController@index');





// Route::resource('/adminUsers', UsersController::class);




// });



// Route::get('/login1',  [AuthController::class, 'showLoginForm'])->name('login');

Route::post('/login', [AuthController::class, 'login']);
Route::post('/logincs', [AuthController::class, 'logincs']);

Route::get('/confirm-account/{token}', [CustomerUserController::class, 'confirmAccount']);


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'logged_user']);
    Route::post('/edit-user', [AuthController::class, 'edit_user']);
    Route::post('/changePassword', [AuthController::class, 'changePassword']);

    // Route::get('/user', function (Request $request) {
    //     return $request->user();
    // });

});

// Route::post('forgot-password', 'Auth\ForgotPasswordController@sendResetLinkEmail');
// Route::post('reset-password', 'Auth\ResetPasswordController@reset');
// Route::post('/forgot-password', [ForgotPasswordController::class, 'forgotPassword']);
Route::post('/forgot-password', [ForgotPasswordController::class, 'sendOTP']);
Route::post('/reset-password', [ForgotPasswordController::class, 'resetPassword']);

// Route::post('/reset-password', [ForgotPasswordController::class, 'resetPassword']);

// Route::post('/reset-password', [ResetPasswordController::class, 'resetPassword']);

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