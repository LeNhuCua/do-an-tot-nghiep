<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
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
        $posts = Product::orderBy("productId", "desc")->get();
        return $posts;
    }

    // public function store(Request $request)
    // {

    //     $request->validate([

    //         'description' => 'required',

    //     ]);

    //     try {
    //         $imageName = Str::random() . '.' . $request->avatar->getClientOriginalExtension();
    //         $request->file('avatar')->storeAs('product/image', $imageName, 'public');
    //         // $a =  Product::create($request->post() + ['avatar' => $imageName]);

    //         $product =  Product::create([
    //             'name' => $request->name,
    //             'alias' => $request->alias,
    //             'status' => $request->status,
    //             'productTypeId' => $request->productTypeId,
    //             'avatar' => $imageName,
    //             'description' => $request->description,
    //             'number' => $request->number,
    //             'price' => $request->price,

    //         ]);
    //         $product_id = $product->id;

    //         // Thêm dữ liệu vào bảng "productImage" với ProductId tương ứng với sản phẩm vừa thêm vào.
    //         $productImage = new ProductImage;
    //         $productImage->image = 'link_hinh_anh';
    //         $productImage->ProductId = $product_id;
    //         $productImage->save();
    //         // foreach ($request->file('images') as $image) {
    //         //     $imageName = Str::random() . '.' . $request->avatar->getClientOriginalExtension();
    //         //     $image->storeAs('product/image', $imageName, 'public');
    //         //     $product->productImages()->create([
    //         //         'image' => $image,
    //         //     ]);
    //         // }
    //         // $validatedData = $request->validated();
    //         // // thêm vào bảng ProductImage
    //         // foreach ($validatedData['images'] as $image) {
    //         //     $product->productImages()->create([
    //         //         'image' => $image,
    //         //     ]);
    //         // }
    //         return response()->json([
    //             'status' => 400,
    //             'message' => 'Product Created Successfully!!',
    //             'product' => $product,
    //             // 'productImages' => $productImages

    //         ]);
    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'message' => 'Something goes wrong while creating a product!!',
    //             'message1' => 'Lỗi: ' . $e->getMessage(),

    //         ], 500);
    //     }
    // }

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

    // public function importExcel(Request $request)
    // {
    //     try {
    //         $file = $request->file('file');
    //         $reader = IOFactory::createReaderForFile($file->getPathname());
    //         $spreadsheet = $reader->load($file->getPathname());
    //         $worksheet = $spreadsheet->getActiveSheet();
    //         $rows = $worksheet->toArray();

    //         if (count($rows) <= 1) {
    //             return response()->json([
    //                 'status' => 455,
    //                 'message' => 'Sheet is empty or contains only a header row',
    //             ]);
    //         }



    //         $lastProductId = Product::selectRaw('SUBSTRING(productId, -5) AS productId')
    //             ->orderBy('productId', 'desc')
    //             ->value('productId');
    //         $newProductIdNumber = substr($lastProductId, -0) + 1;

    //         foreach ($rows as $index => $row) {
    //             if ($index === 0) { // Skip header row
    //                 continue;
    //             }

    //             $newProductId =  ($row[6] . "-" . $row[4] . "-" . $this->convertString($row[3] . $row[5])) . "-" . 'SP' . str_pad($newProductIdNumber, 5, '0', STR_PAD_LEFT);
    //             $product = Product::where('name', $row[0])->first(); // Kiểm tra xem productId đã tồn tại trong db hay chưa
    //             if ($product) { // Nếu đã tồn tại thì báo lỗi

    //                 return response()->json([
    //                     'status' => 422,
    //                     'message' => 'Tên sản phẩm là ' . $row[0] . ' tại dòng thứ ' . $index . ' đã tồn tại. Vui lòng nhập tên khác',
    //                 ]);
    //                 break;
    //             } else {

    //                 // Save data to database using Eloquent
    //                 $product = new Product;
    //                 $product->productId =  $newProductId;
    //                 $product->name = $row[0];
    //                 $product->price = $row[1];
    //                 $product->number = $row[2];
    //                 $product->weight = $row[3];
    //                 $product->productTypeId = $row[4];
    //                 $product->unitId = $row[5];
    //                 $product->typeCategoryId = $row[6];
    //                 $product->status = 1;
    //                 $product->alias = $this->convertNameWithoutAccents($row[0] . "-" . $row[6] . "-" . $row[4]) . "-" . $this->convertString(strtolower($row[3] . $row[5]));
    //                 $product->created_at =  Carbon::now();
    //                 $product->updated_at = Carbon::now();

    //                 $product->save();
    //                 $newProductIdNumber++; // Increment the productId number
    //             }
    //         }

    //         // Return response to frontend
    //         return response()->json([
    //             'status' => 200,
    //             'message' => 'Thành công',
    //         ]);
    //     } catch (\Exception $e) {
    //         // Handle errors
    //         return response()->json([
    //             'status' => 401,
    //             'message' => "Vui lòng điền đủ các trường excel như mẫu",
    //             'message' => 'Lỗi: ' . $e->getMessage(),
    //         ]);
    //     }
    // }

    public function store(Request $request)
    {


        $messages = [
            'required' => 'Trường :attribute phải nhập',
            'unique' => 'Trường :attribute đã tồn tại'

        ];
        $validator = Validator::make($request->all(), [
            'alias' => 'required',
            'name' => 'required|unique:products',
            'price' => 'required',
            'avatar' => 'required',
            'number' => 'required',
            'weight' => 'required',
            'productTypeId' => 'required',
            'unitId' => 'required',
            'typeCategoryId' => 'required',
            'status' => 'required',
        ], $messages);
        if ($validator->fails()) {
            return response()->json([
                'validation_error' => $validator->errors(),
                'message' => 'Kiểm tra lại thông tin',

            ]);
        } else {
            $lastProductId = Product::selectRaw('SUBSTRING(productId, -5) AS productId')
                ->orderBy('productId', 'desc')
                ->value('productId');
            $newProductIdNumber = substr($lastProductId, -0) + 1;
            if ($lastProductId == null) {
                $newProductId = $request->typeCategoryId . "-" . $request->productTypeId . "-" . $this->convertString($request->weight . $request->unitId) . "-" . 'SP00001';
            } else {
                // $newProductIdNumber = substr($lastProductId->productId, -0) + 1;
                $newProductId =  $request->typeCategoryId . "-" . $request->productTypeId . "-" . $this->convertString($request->weight . $request->unitId) . "-"  . 'SP' . str_pad($newProductIdNumber, 5, '0', STR_PAD_LEFT);
            }
            $product = new Product;
            $product->productId  = $newProductId;
            $product->name  = $request->name;
            $product->alias  = $request->alias;
            $product->status  = $request->status;
            $product->productTypeId  = $request->productTypeId;
            $product->typeCategoryId  = $request->typeCategoryId;
            $product->unitId  = $request->unitId;
            $product->description  = $request->description;
            $product->number  = $request->number;
            $product->price  = $request->price;
            $product->weight  = $request->weight;
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

            return response()->json([
                'status' => 400,
                'message' => 'Product Created Successfully!!',
                'product' => $product,
                'productImages' => $productImages

            ]);
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
            'price' => 'required',
            // 'avatar' => 'required',
            'number' => 'required',
            'weight' => 'required',
            'productTypeId' => 'required',
            'unitId' => 'required',
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
                $newProductId =  $request->typeCategoryId . "-" . $request->productTypeId . "-" . $this->convertString($request->weight . $request->unitId) . "-"  . $newProductIdNumber;
                $product = Product::findOrFail($id);
                $product->productId  = $newProductId;
                $product->name  = $request->name;
                $product->alias  = $request->alias;
                $product->status  = $request->status;
                $product->productTypeId  = $request->productTypeId;
                $product->typeCategoryId  = $request->typeCategoryId;
                $product->unitId  = $request->unitId;
                $product->description  = $request->description;
                $product->number  = $request->number;
                $product->price  = $request->price;
                $product->weight  = $request->weight;



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

                return response()->json([
                    'status' => 400,
                    'message' => 'Product Updated Successfully!!',
                    'product' => $product,
                    'productImages' => $productImages

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


    public function importExcel(Request $request)
    {
        try {
            $file = $request->file('file');
            $reader = IOFactory::createReaderForFile($file->getPathname());
            $spreadsheet = $reader->load($file->getPathname());
            $worksheet = $spreadsheet->getActiveSheet();
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
            $newProductIdNumber = substr($lastProductId, -0) + 1;

            foreach ($rows as $index => $row) {
                if ($index === 0) { // Skip header row
                    continue;
                }

                $newProductId =  ($row[6] . "-" . $row[4] . "-" . $this->convertString($row[3] . $row[5])) . "-" . 'SP' . str_pad($newProductIdNumber, 5, '0', STR_PAD_LEFT);
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
                    $product->price = $row[1];
                    $product->number = $row[2];
                    $product->weight = $row[3];
                    $product->productTypeId = $row[4];
                    $product->unitId = $row[5];
                    $product->typeCategoryId = $row[6];
                    $product->status = 1;
                    $product->alias = $this->convertNameWithoutAccents($row[0] . "-" . $row[6] . "-" . $row[4]) . "-" . $this->convertString(strtolower($row[3] . $row[5]));
                    $product->created_at =  Carbon::now();
                    $product->updated_at = Carbon::now();

                    $product->save();
                    $newProductIdNumber++; // Increment the productId number
                }
            }

            // Return response to frontend
            return response()->json([
                'status' => 200,
                'message' => 'Thành công',
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
