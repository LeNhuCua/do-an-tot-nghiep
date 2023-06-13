<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Illuminate\Support\Facades\Validator;


class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::with('typeCategory')->orderBy("created_at", "desc")->get();

        return $categories;
    }
    // public function index1()
    // {
    //     $categories = Category::with('typeCategory')->get();;

    //     return $categories;
    //     // return Category::select('categoryId', 'alias', 'name', 'status')->get();
    // }
    public function store(Request $request)
    {
        $messages = [
            'required' => 'Trường :attribute phải nhập',
            'unique' => 'Trường :attribute đã tồn tại'

        ];
        $validator = Validator::make($request->all(), [
            'categoryId' => 'required|unique:categories',
            'alias' => 'required',
            'name' => 'required|unique:categories',
            'status' => 'required',
        ], $messages);

        if ($validator->fails()) {
            return response()->json([
                'validation_error' => $validator->errors(),
                'message' => 'Kiểm tra lại thông tin',

            ]);
        } else {
            $category =  Category::create([
                'categoryId' =>  $request->categoryId,
                'alias' => $request->alias,
                'name' => $request->name,
                'status' => $request->status,

            ]);
            return response()->json([
                'status' => 400,
                'message' => 'Tạo thành công ',
                'category' => $category
            ]);
        }
    }

    // public function show(Category $category)
    // {
    //     return response()->json([
    //         'category' => $category
    //     ]);
    // }

    public function show($id)
    {
        $category = Category::findOrFail($id);

        return response()->json([
            'category' => $category
        ]);
    }

    public function update(Request $request, $categoryId)
    {

        $messages = [
            'required' => 'Trường :attribute phải nhập',

        ];
        $validator = Validator::make($request->all(), [
            'name' => 'required|max:50',
            'status' => 'required',
        ], $messages);

        if ($validator->fails()) {
            return response()->json([
                'validation_error' => $validator->errors(),
                'message' => 'Kiểm tra lại thông tin',

            ]);
        } else {
            try {

                $category = Category::findOrFail($categoryId);
                // $category->updateMadm($request->categoryId);
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

    public function destroy($categoryId)
    {

        $category = Category::find($categoryId);
        if ($category) {
            // DB::table('product_types')->whereIn('categoryId', $categoryId)->delete();
            $category->delete();
            return response()->json(['message' => 'Xoá thành công']);
        } else {
            return response()->json(['message' => 'Không tìm thấy Category'], 404);
        }
    }


    public function importExcel(Request $request)
    {

        $auth = Auth::user();
        if($auth) {
            
        }

        function removeAccents(string $str): string
        {
            $str = mb_convert_encoding($str, 'UTF-8', mb_list_encodings());
            $str = preg_replace('/[^a-zA-Z0-9\/_|+ -]/', '', $str);
            $str = strtolower(trim($str, '-'));
            $str = preg_replace('/[\/_|+ -]+/', '-', $str);
            return $str;
        }

        function convertNameWithoutAccents(string $name): string
        {
            // Remove accents from name
            $name = removeAccents($name);

            // Replace spaces with hyphens
            return str_replace(' ', '-', $name);
        }



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
                $categoryName = Category::where('name', $row[1])->first();
                $categoryId = Category::where('categoryId', $row[0])->first();
                if ($categoryName) {
                    return response()->json([
                        'status' => 422,
                        'message' => 'Tên danh mục ' . $row[0] . ' tại dòng thứ ' . $index . ' đã tồn tại. Vui lòng nhập tên khác',
                    ]);
                    break;
                } else if ($categoryId) {
                    return response()->json([
                        'status' => 422,
                        'message' => 'Mã danh mục ' . $row[0] . ' tại dòng thứ ' . $index . ' đã tồn tại. Vui lòng nhập tên khác',
                    ]);
                    break;
                } else {
                    $dataToSave[] = [
                        'categoryId' => $row[0],
                        'name' => $row[1],
                        'alias' => convertNameWithoutAccents($row[1]),
                        'status' => 1,
                        'created_at' => Carbon::now(),
                        'updated_at' => Carbon::now(),
                    ];
                    // Save data to database using Eloquent
                    Category::insert($dataToSave);

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
        // DB::table('product_types')->whereIn('categoryId', $selectedData)->delete();
        $deletedRowCount = DB::table('categories')->whereIn('categoryId', $selectedData)->delete();

        if ($deletedRowCount > 0) {
            return response()->json([
                'status' => 200,
                'message' => "Selected products deleted successfully.",
                // 'message' => 'Lỗi: ' . $e->getMessage(),
            ]);
            // return response()->json(['message' => 'Selected products deleted successfully.'], 200);
        } else {
            return response()->json([
                'status' => 500,
                'message' => "Không có trường nào được xoá",
                // 'message' => 'Lỗi: ' . $e->getMessage(),
            ]);
        }
    }
}
