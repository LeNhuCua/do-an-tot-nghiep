<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

use App\Models\TypeCategories;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Illuminate\Support\Facades\Validator;

class TypeCategoriesController extends Controller
{

    public function index()
    {
        $posts = TypeCategories::orderBy("created_at", "desc")->get();

        return $posts;
        // return typeCategory::select('typeCategoryId', 'alias', 'name', 'status')->get();
    }

    public function store(Request $request)
    {

        $messages = [
            'required' => 'Trường :attribute phải nhập',
            'unique' => 'Trường :attribute đã tồn tại'
        ];

        $validator = Validator::make($request->all(), [
            'typeCategoryId' => 'required|unique:type_categories',
            'alias' => 'required',
            'name' => 'required|unique:type_categories',
            'status' => 'required',
        ], $messages);

        if ($validator->fails()) {
            return response()->json([

                'validation_error' => $validator->errors(),
                'message' => 'Kiểm tra lại thông tin',
            ]);
        } else {
            $typeCategories =  TypeCategories::create([
                'typeCategoryId' => $request->typeCategoryId,
                'alias' => $request->alias,
                'alias' => $request->alias,
                'name' => $request->name,
                'status' => $request->status,
                'categoryId' => $request->categoryId,
            ]);
            return response()->json([
                'status' => 400,
                'message' => 'Tạo thành công ',
                'typeCategories' => $typeCategories

            ]);
        }
    }
    // function show(TypeCategories $TypeCategories) {
    //      $response = [
    //         'TypeCategories' => $TypeCategories
    //     ];
    //     return $response;

    //     // header('Content-Type: application/json');

    // }

    public function show($id)
    {
        $typeCategory = TypeCategories::findOrFail($id);

        return response()->json([
            'typeCategory' => $typeCategory
        ]);
    }
    public function update(Request $request, $typeCategoryId)
    {

        $messages = [
            'required' => 'Trường :attribute phải nhập',
            // 'required' => 'Trường :attribute phải nhập',
            // 'unique' => 'Bí danh đã tồn tại'

        ];

        $validator = Validator::make($request->all(), [

            'name' => 'required',
            'status' => 'required',
        ], $messages);

        if ($validator->fails()) {
            return response()->json([
                'validation_error' => $validator->errors(),
                'message' => 'Kiểm tra lại thông tin',
            ]);
        } else {
            try {
                $typeCategories = TypeCategories::find($typeCategoryId);
                $typeCategories->update($request->all());
                return response()->json([
                    'status' => 400,
                    'message' => 'Cập nhật thành công!!'

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


    public function destroy(TypeCategories $typeCategory)
    {
        try {
            $typeCategory->delete();

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

                $dataToSave[] = [
                    'typeCategoryId' => $row[0],
                    'name' => $row[1],
                    'alias' => convertNameWithoutAccents($row[1]),
                    'categoryId' => $row[2],
                    'status' => 1,
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ];
            }

            // Save data to database using Eloquent
            TypeCategories::insert($dataToSave);

            // Return response to frontend
            return response()->json([
                'status' => 200,
                'message' => 'Thành công',
            ]);
        } catch (\Exception $e) {
            // Handle errors
            return response()->json([
                'status' => 422,
                'message' => "Vui lòng điền đủ các trường excel như mẫu",
                'Error' => 'Lỗi: ' . $e->getMessage(),
            ]);
        }
    }

    public function deleteAll(Request $request)
    {
        $selectedData = $request->input('dataId');
        // DB::table('product_types')->whereIn('categoryId', $selectedData)->delete();
        $deletedRowCount = DB::table('type_categories')->whereIn('typeCategoryId', $selectedData)->delete();

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
