<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductSize;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Normalizer;

class ProductsController extends Controller
{
    public function index()
    {
        $posts = Product::orderBy("created_at", "desc")->get();
        return $posts;
    }


    public function convertString($str)
    {
        // Sử dụng biểu thức chính quy để tìm kiếm các phần tử số và chữ cái trong chuỗi
        $regex = '/(\d+)\.?(\d*)\s?([a-zA-Z]+)/';
        // Sử dụng hàm preg_replace_callback để thay thế chuỗi cần chuyển đổi
        return preg_replace_callback($regex, function ($matches) {
            $p1 = $matches[1];
            $p2 = $matches[2];
            $p3 = $matches[3];
            // Loại bỏ tất cả các khoảng trắng
            $p3 = preg_replace('/\s+/', '', $p3);
            // Nếu p2 là chuỗi rỗng (không có phần thập phân) thì trả về chuỗi "p1p3"
            if (empty($p2)) {
                return $p1 . $p3;
            }
            // Nếu p2 khác rỗng (có phần thập phân) thì trả về chuỗi "p1p3p2"
            return $p1 . $p3 . $p2;
        }, $str);
    }

    function removeAccents($str)
    {
        return preg_replace('/\pM/u', '', Normalizer::normalize($str, Normalizer::FORM_D));
    }


    function convertNameWithoutAccents($name)
    {
        // Remove accents from name
        $name = $this->removeAccents($name);

        // Convert name to lower case and replace spaces with hyphens
        return str_replace(' ', '-', mb_convert_case($name, MB_CASE_LOWER, 'utf-8'));
    }


    public function store(Request $request)
    {

        $a = null;
        $messages = [
            'required' => 'Trường :attribute phải nhập',
            'unique' => 'Trường :attribute đã tồn tại'

        ];
        $validator = Validator::make($request->all(), [
           
            'name' => 'required|unique:products',
            'avatar' => 'required',
            'productTypeId' => 'required',
            'typeCategoryId' => 'required',
            'status' => 'required',
        ], $messages);
        if ($validator->fails()) {
            return response()->json([
                'validation_error' => $validator->errors(),
                'message' => 'Kiểm tra lại thông tin',

            ]);
        } else {
            try {
                $lastProductId = Product::selectRaw('SUBSTRING(productId, -5) AS productId')
                    ->orderBy('productId', 'desc')
                    ->value('productId');
                if ($lastProductId) {
                    $newProductIdNumber = substr($lastProductId, -0) + 1;
                }

                if ($lastProductId == null) {
                    $newProductId = $request->typeCategoryId . "-" . $request->productTypeId . "-" . 'SP00001';
                } else {
                    $newProductId =  $request->typeCategoryId . "-" . $request->productTypeId . "-"  . 'SP' . str_pad($newProductIdNumber, 5, '0', STR_PAD_LEFT);
                }
                $product = new Product;
                $product->productId  = $newProductId;
                $product->name  = $request->name;
                $product->alias  = $request->alias;
                $product->status  = $request->status;
                $product->productTypeId  = $request->productTypeId;
                $product->typeCategoryId  = $request->typeCategoryId;

                $product->description  = $request->description;

                if ($request->has('avatar')) {
                    $imageName = Str::random() . '.' . $request->avatar->getClientOriginalExtension();
                    $request->file('avatar')->storeAs('product/image', $imageName, 'public');
                    $product->avatar = $imageName;
                }
                $product->save();
                $productImage = null;
                $productImages = collect();
                if ($request->hasFile('images')) {
                    foreach ($request->file('images') as $image) {
                        $imageName = Str::random() . '.' . $request->avatar->getClientOriginalExtension();
                        // $filename = time() . '_' . $image->getClientOriginalName();
                        $image->storeAs('product/image', $imageName, 'public');
                        $productImage = new ProductImage;
                        $productImage->image = $imageName;
                        $productImage->productId = $product->productId;
                        $productImage->save();
                        $productImages->push($productImage);
                    }
                }
                $productSizes = collect();
                $sizesValue = collect();
                $units = collect();

                if ($request->sizes) {
                    $a = "có";
                    foreach ($request->sizes as $size) {
                        $sizeItemObject = json_decode($size);

                        $days_now = Carbon::today();
                        $dateObj = $days_now->toDateString();

                        $lastProductSizeId = ProductSize::selectRaw('SUBSTRING(productSizeId, -5) AS productSizeId')
                            ->whereDate('created_at', $days_now)
                            ->orderBy('productSizeId', 'desc')
                            ->value('productSizeId');
                        if ($lastProductSizeId) {
                            $newProductSizeIdNumber = substr($lastProductSizeId, -0) + 1;
                        }
                        if ($lastProductSizeId == null) {
                            $newProductSizeId = $dateObj . 'SP_S00001';
                        } else {

                            $newProductSizeId = $dateObj . 'SP_S' . str_pad($newProductSizeIdNumber, 5, '0', STR_PAD_LEFT);
                        }
                        $productSize = new ProductSize;
                        $productSize->productSizeId  = $newProductSizeId;
                        $productSize->sizeId  = $sizeItemObject->sizeId;
                        $productSize->unitId  = $sizeItemObject->unitId;
                        $productSize->price  = $sizeItemObject->price;
                        $productSize->weight  = $sizeItemObject->weight;
                        $productSize->number  = $sizeItemObject->number;
                        $productSize->productId  = $product->productId;
                        $productSize->save();
                        $productSizes->push($productSize);
                        $sizesValue->push($sizeItemObject->sizeValue);
                        $units->push($sizeItemObject->sizeValue);
                    }
                } else {
                    $a = "ko";
                }


                return response()->json([
                    'status' => 400,
                    'message' => 'Product Created Successfully!!',
                    'product' => $product,
                    'productImages' => $productImages,
                    'productSizes' => $productSizes,
                    'sizesValue' => $sizesValue
                ]);
            } catch (\Exception $e) {
                return response()->json([
                    'message' => 'Gặp lỗi khi cập nhật!!',
                    'eee' => 'Lỗi: ' . $e->getMessage(),
                    'status' => 201,
                    'a' => $a
                ]);
            }
        }
    }

    public function show($id)
    {
        $product = Product::findOrFail($id);

        return response()->json([
            'product' => $product
        ]);
    }





    public function update(Request $request, $id)
    {

        $messages = [
            'required' => 'Trường :attribute phải nhập',
            'unique' => 'Trường :attribute đã tồn tại'

        ];
        $validator = Validator::make($request->all(), [

            'alias' => 'required',
            'name' => 'required',


            'productTypeId' => 'required',

            'typeCategoryId' => 'required',
            'status' => 'required',
        ], $messages);
        if ($validator->fails()) {
            return response()->json([
                'validation_error' => $validator->errors(),
                'message' => 'Kiểm tra lại thông tin',

            ]);
        } else {
            try {

                $newProductIdNumber = substr($id, -7);
                $newProductId =  $request->typeCategoryId . "-" . $request->productTypeId . "-"   . $newProductIdNumber;
                $product = Product::findOrFail($id);
                $product->productId  = $newProductId;
                $product->name  = $request->name;
                $product->alias  = $request->alias;
                $product->status  = $request->status;
                $product->productTypeId  = $request->productTypeId;
                $product->typeCategoryId  = $request->typeCategoryId;
                $product->description  = $request->description;

                if ($request->hasFile('avatar')) {
                    if ($product->avatar) {
                        $exists = Storage::disk('public')->exists("product/image/{$product->avatar}");
                        if ($exists) {
                            Storage::disk('public')->delete("product/image/{$product->avatar}");
                        }
                    }
                    $imageName = Str::random() . '.' . $request->avatar->getClientOriginalExtension();
                    $request->file('avatar')->storeAs('product/image', $imageName, 'public');
                    $product->avatar = $imageName;
                }
                $product->save();
                $productImage = null;
                $productImages = collect();

                if ($request->hasFile('images')) {
                    foreach ($request->file('images') as $image) {
                        $imageName = Str::random() . '.' . $image->getClientOriginalName();
                        // $filename = time() . '_' . $image->getClientOriginalName();
                        $image->storeAs('product/image', $imageName, 'public');
                        $productImage = new ProductImage;
                        $productImage->image = $imageName;
                        $productImage->productId = $product->productId;
                        $productImage->save();
                        $productImages->push($productImage);
                    }
                }


                if ($request->sizes) {

                    foreach ($request->sizes as $size) {
                        $sizeItemObject = json_decode($size);
                        $days_now = Carbon::today();
                        $dateObj = $days_now->toDateString();

                        $lastProductSizeId = ProductSize::selectRaw('SUBSTRING(productSizeId, -5) AS productSizeId')
                            ->whereDate('created_at', $days_now)
                            ->orderBy('productSizeId', 'desc')
                            ->value('productSizeId');
                        if ($lastProductSizeId) {
                            $newProductSizeIdNumber = substr($lastProductSizeId, -0) + 1;
                        }
                        if ($lastProductSizeId == null) {
                            $newProductSizeId = $dateObj . 'SP_S00001';
                        } else {
                            $newProductSizeId = $dateObj . 'SP_S' . str_pad($newProductSizeIdNumber, 5, '0', STR_PAD_LEFT);
                        }

                        $alreadyExistSize = ProductSize::where('productID', '=', $product->productId)->where('sizeId', '=', $sizeItemObject->sizeId)->first();
                        if ($alreadyExistSize) {

                            return response()->json([
                                'status' => 401,
                                'alreadyExistSize' =>  $alreadyExistSize
                            ]);
                        } else {
                            $productSize = new ProductSize;
                            $productSize->productSizeId  = $newProductSizeId;
                            $productSize->sizeId  = $sizeItemObject->sizeId;
                            $productSize->unitId  = $sizeItemObject->unitId;
                            $productSize->price  = $sizeItemObject->price;
                            $productSize->weight  = $sizeItemObject->weight;
                            $productSize->number  = $sizeItemObject->number;
                            $productSize->productId  = $product->productId;
                            $productSize->save();
                        }
                    }
                } else {
                }


                return response()->json([
                    'status' => 400,
                    'message' => 'Product Updated Successfully!!',
                    'product' => $product,
                    'productImages' => $productImages,
               

                ]);
            } catch (\Exception $e) {
                return response()->json([
                    'status' => 201,
                    'message' => 'Failed to update product: ' . $e->getMessage()
                ]);
            }
        }
    }

    // public function update(Request $request, $categoryId)
    // {



    //     $messages = [
    //         'required' => 'Trường :attribute phải nhập',
    //         // 'required' => 'Trường :attribute phải nhập',
    //         // 'unique' => 'Bí danh đã tồn tại'

    //     ];

    //     $validator = Validator::make($request->all(), [
    //         'alias' => 'required',
    //         'name' => 'required',
    //         'status' => 'required',
    //     ], $messages);

    //     if ($validator->fails()) {
    //         return response()->json([
    //             'validation_error' => $validator->errors(),
    //             'message' => 'Kiểm tra lại thông tin',
    //         ]);
    //     } else {
    //         try {
    //             $productType = Product::findOrFail($categoryId);
    //             $productType->name = $request->name;
    //             $productType->alias = $request->alias;
    //             $productType->status = $request->status;
    //             $productType->categoryId = $request->categoryId;
    //             $productType->save();

    //             return response()->json([
    //                 'status' => 400,
    //                 'message' => 'Cập nhật thành công!!'

    //             ]);
    //         } catch (\Exception $e) {
    //             return response()->json([
    //                 'message' => 'Gặp lỗi khi cập nhật!!'
    //             ], 500);
    //         }
    //     }
    // }


    public function deleteImages($productImageId)
    {

        $productImage = ProductImage::find($productImageId);
        if ($productImage) {
            // DB::table('product_types')->whereIn('productImageId', $productImageId)->delete();
            $productImage->delete();

            $exists = Storage::disk('public')->exists("product/image/{$productImage->image}");
            if ($exists) {
                Storage::disk('public')->delete("product/image/{$productImage->image}");
            }

            return response()->json([
                'status' => 200,
                'message' => 'thành công',

            ]);
        } else {
            return response()->json(['message' => 'Không tìm thấy ảnh'], 404);
        }
    }


    function convertToLaravelArray($input)
    {
        $array = explode(',', $input);

        $resultArray = [];

        foreach ($array as $item) {
            $trimmedItem = trim($item);

            // Kiểm tra xem chuỗi có bắt đầu bằng "SIZE" hay "SanPham" hay không
            if (strpos($trimmedItem, 'SIZE') === 0) {
                $resultArray[] = ['name' => 'SIZE', 'value' => $trimmedItem];
            } elseif (strpos($trimmedItem, 'SanPham') === 0) {
                $resultArray[] = ['name' => 'SanPham', 'value' => $trimmedItem];
            }
        }

        return $resultArray;
    }

    public function importExcel(Request $request)
    {
        try {
            $file = $request->file('file');
            $reader = IOFactory::createReaderForFile($file->getPathname());
            $spreadsheet = $reader->load($file->getPathname());
            $worksheet = $spreadsheet->getSheet(0);
            $rows = $worksheet->toArray();

            if (count($rows) <= 1) {
                return response()->json([
                    'status' => 455,
                    'message' => 'Sheet is empty or contains only a header row',
                ]);
            }

            $lastProductId = Product::selectRaw('SUBSTRING(productId, -5) AS productId')
                ->orderBy('productId', 'desc')
                ->value('productId');

            if ($lastProductId) {
                $newProductIdNumber = substr($lastProductId, -0) + 1;
            }


            foreach ($rows as $index => $row) {
                if ($index === 0) { // Skip header row
                    continue;
                }

                $newProductId =  ($row[2] . "-" . $row[1]) . "-" . 'SP' . str_pad($newProductIdNumber, 5, '0', STR_PAD_LEFT);
                $product = Product::where('name', $row[0])->first(); // Kiểm tra xem productId đã tồn tại trong db hay chưa
                if ($product) { // Nếu đã tồn tại thì báo lỗi

                    return response()->json([
                        'status' => 422,
                        'message' => 'Tên sản phẩm là ' . $row[0] . ' tại dòng thứ ' . $index . ' đã tồn tại. Vui lòng nhập tên khác',
                    ]);
                    break;
                } else {

                    // Save data to database using Eloquent
                    $product = new Product;
                    $product->productId =  $newProductId;
                    $product->name = $row[0];
                    $product->productTypeId = $row[1];
                    $product->typeCategoryId = $row[2];
                    $product->status = 1;
                    $product->alias = $this->convertNameWithoutAccents($row[0] . "-" . $row[2] . "-" . $row[1]);
                    $product->created_at =  Carbon::now();
                    $product->updated_at = Carbon::now();
                    $product->save();



                    $sizeId = explode(";", $row[3]);
                    $unitId = explode(";", $row[6]);
                    $price = explode(";", $row[4]);
                    $weight = explode(";", $row[5]);
                    $number = explode(";", $row[7]);

                    // $unitId = $this->convertToLaravelArray($row[6]);

                    $collection = collect($sizeId)->map(function ($sizeId, $index) use ($unitId, $price, $weight, $number) {
                        return ['sizeId' => $sizeId, 'unitId' => $unitId[$index], 'price' => $price[$index], 'weight' => $weight[$index], 'number' => $number[$index]];
                    });

                    $objectsArray = $collection->toArray();





                    foreach ($objectsArray as $index => $r) {

                        $days_now = Carbon::today();
                        $dateObj = $days_now->toDateString();
                        $lastProductSizeId = ProductSize::selectRaw('SUBSTRING(productSizeId, -5) AS productSizeId')
                            ->whereDate('created_at', $days_now)
                            ->orderBy('productSizeId', 'desc')
                            ->value('productSizeId');
                        if ($lastProductSizeId) {
                            $newProductSizeIdNumber = substr($lastProductSizeId, -0) + 1;
                        }
                        if ($lastProductSizeId == null) {
                            $newProductSizeId = $dateObj . 'SP_S00001';
                        } else {

                            $newProductSizeId = $dateObj . 'SP_S' . str_pad($newProductSizeIdNumber, 5, '0', STR_PAD_LEFT);
                        }

                        $productSize = new ProductSize;
                        $productSize->productSizeId  = $newProductSizeId;
                        $productSize->sizeId  = $r['sizeId'];
                        $productSize->unitId  = $r['unitId'];
                        $productSize->price  = $r['price'];
                        $productSize->weight  = $r['weight'];
                        $productSize->number  = $r['number'];
                        $productSize->productId  = $product->productId;
                        $productSize->save();
                    }




                    $newProductIdNumber++; // Increment the productId number
                }
            }

            // Return response to frontend
            return response()->json([
                'status' => 200,
                'message' => 'Thành công',
                'ahiahi' => $objectsArray
            ]);
        } catch (\Exception $e) {
            // Handle errors
            return response()->json([
                'status' => 401,
                'message' => "Vui lòng điền đủ các trường excel như mẫu",
                'message' => 'Lỗi: ' . $e->getMessage(),
            ]);
        }
    }



    public function deleteAll(Request $request)
    {
        try {
            $selectedData = $request->input('dataId');
            $products_image = DB::table('product_images')->whereIn('productId', $selectedData)->get();
            $product_image = DB::table('products')->whereIn('productId', $selectedData)->get();
            foreach ($product_image as $product_img) {
                // Delete product image from public folder
                if ($product_img->avatar && file_exists(('product/image/' . $product_img->avatar))) {
                    $file_path = ('product/image/' . $product_img->avatar);
                    unlink($file_path);
                }
            }
            foreach ($products_image as $product_image) {

                if ($product_image->image && file_exists(('product/image/' . $product_image->image))) {
                    $file_path = ('product/image/' . $product_image->image);
                    unlink($file_path);
                }
            }

            DB::table('products')->whereIn('productId', $selectedData)->delete();

            return response()->json([
                'status' => 200,
                'message' => "Xoá nhiều sản phẩm thành công",

            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => "Lỗi xoá sản phẩm: " . $e->getMessage(),
            ]);
        }
    }
}
