<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductType;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Illuminate\Support\Facades\Validator;

class ProductTypesController extends Controller
{




    public function index()
    {
        $posts = ProductType::orderBy("created_at", "desc")->get();

        return $posts;
        // return Category::select('productTypeId', 'alias', 'name', 'status')->get();
    }

    public function store(Request $request)
    {

        $messages = [
            'required' => 'Trường :attribute phải nhập',
            'unique' => 'Trường :attribute đã tồn tại'
        ];

        $validator = Validator::make($request->all(), [
            'productTypeId' => 'required|unique:product_types',
            'name' => 'required|unique:product_types',
        ], $messages);

        if ($validator->fails()) {
            return response()->json([

                'validation_error' => $validator->errors(),
                'message' => 'Kiểm tra lại thông tin',
            ]);
        } else {
            $productType =  ProductType::create([
                'productTypeId' => $request->productTypeId,
                'name' => $request->name,
            ]);
            return response()->json([
                'status' => 400,
                'message' => 'Tạo thành công ',
                'productType' => $productType

            ]);
        }
    }
    // function show(ProductType $productType) {
    //      $response = [
    //         'productType' => $productType
    //     ];
    //     return $response;

    //     // header('Content-Type: application/json');

    // }

    public function show($id)
    {
        $productType = ProductType::findOrFail($id);

        return response()->json([
            'productType' => $productType
        ]);
    }
    public function update(Request $request, $productTypeId)
    {

        $messages = [
            'required' => 'Trường :attribute phải nhập',

        ];
        $validator = Validator::make($request->all(), [
            'name' => 'required|max:50',

        ], $messages);

        if ($validator->fails()) {
            return response()->json([
                'validation_error' => $validator->errors(),
                'message' => 'Kiểm tra lại thông tin',

            ]);
        } else {
            try {

                $category = ProductType::findOrFail($productTypeId);
                // $category->updateMadm($request->produ$productTypeId);
                // $category->categoryId = $request->categoryId;
                // $category->name = $request->name;
                // $category->alias = $request->alias;
                // $category->save();

                $category->update($request->all());

                // $loaiSanPhams = ProductType::where('categoryId', $category->categoryId)->get();
                // foreach ($loaiSanPhams as $loaiSanPham) {
                //     $loaiSanPham->categoryId = $request->categoryId;
                //     $loaiSanPham->save();
                // }

                // ProductType::where('categoryId', $categoryId)->update(['categoryId' => $request->categoryId]);

                return response()->json([
                    'status' => 400,
                    'message' => 'Product Updated Successfully!!'
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


    public function destroy(ProductType $category)
    {
        try {
            $category->delete();

            return response()->json([
                'message' => 'Xoá thành công!!'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi xoá!!'
            ]);
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

            // Process and validate the data
            $dataToSave = [];


            foreach ($rows as $index => $row) {
                if ($index === 0) { // Skip header row
                    continue;
                }
                $productTypeName = ProductType::where('name', $row[1])->first();
                $productTypeId = ProductType::where('productTypeId', $row[0])->first();
                if ($productTypeName) {
                    return response()->json([
                        'status' => 422,
                        'message' => 'Tên loại sản phẩm ' . $row[0] . ' tại dòng thứ ' . $index . ' đã tồn tại. Vui lòng nhập tên khác',
                    ]);
                    break;
                } else if ($productTypeId) {
                    return response()->json([
                        'status' => 422,
                        'message' => 'Mã loại sản phẩm ' . $row[0] . ' tại dòng thứ ' . $index . ' đã tồn tại. Vui lòng nhập tên khác',
                    ]);
                    break;
                } else {
                    $dataToSave[] = [
                        'productTypeId' => $row[0],
                        'name' => $row[1],
                        'created_at' => Carbon::now(),
                        'updated_at' => Carbon::now(),
                    ];
                    // Save data to database using Eloquent
                    ProductType::insert($dataToSave);

                    // Return response to frontend
                    return response()->json([
                        'status' => 200,
                        'message' => 'Thành công',
                    ]);
                }
            }
        } catch (\Exception $e) {
            // Handle errors
            return response()->json([
                'status' => 422,
                'message' => "Vui lòng điền đủ các trường excel như mẫu. Không được trùng tên và mã",
                // 'message' => 'Lỗi: ' . $e->getMessage(),
            ]);
        }
    }

    public function deleteAll(Request $request)
    {
        $selectedData = $request->input('dataId');

        DB::table('product_types')->whereIn('productTypeId', $selectedData)->delete();

        return response()->json(['message' => 'Xoá nhiều sản phẩm thành công.'], 200);
    }
}
