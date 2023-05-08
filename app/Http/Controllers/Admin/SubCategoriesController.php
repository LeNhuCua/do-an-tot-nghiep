<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CategoriesSub;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Illuminate\Support\Facades\Validator;

class SubCategoriesController extends Controller
{




    public function index()
    {
        $posts = CategoriesSub::orderBy("created_at", "desc")->get();

        return $posts;
        // return CategorySub::select('categorySubSubId', 'alias', 'name', 'status')->get();
    }

    public function store(Request $request)
    {

        $messages = [
            'required' => 'Trường :attribute phải nhập',
            'unique' => 'Trường :attribute đã tồn tại'
        ];

        $validator = Validator::make($request->all(), [
            'categorySubId' => 'required|unique:categories_subs',
            'alias' => 'required',
            'name' => 'required|unique:categories_subs',
            'status' => 'required',
        ], $messages);

        if ($validator->fails()) {
            return response()->json([

                'validation_error' => $validator->errors(),
                'message' => 'Kiểm tra lại thông tin',
            ]);
        } else {
            $categoriesSub =  CategoriesSub::create([
                'categorySubId' => $request->categorySubId,
                'alias' => $request->alias,
                'alias' => $request->alias,
                'name' => $request->name,
                'status' => $request->status,
                'categoryId' => $request->categoryId,
            ]);
            return response()->json([
                'status' => 400,
                'message' => 'Tạo thành công ',
                'categoriesSub' => $categoriesSub

            ]);
        }
    }
    // function show(CategoriesSub $CategoriesSub) {
    //      $response = [
    //         'CategoriesSub' => $CategoriesSub
    //     ];
    //     return $response;

    //     // header('Content-Type: application/json');

    // }

    public function show($id)
    {
        $subcategory = CategoriesSub::findOrFail($id);

        return response()->json([
            'subcategory' => $subcategory
        ]);
    }
    public function update(Request $request, $categorySubSubId)
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
                $categoriesSub = CategoriesSub::find($categorySubSubId);
                $categoriesSub->update($request->all());
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


    public function destroy(CategoriesSub $categorySub)
    {
        try {
            $categorySub->delete();

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
                    'categorySubId' => $row[0],
                    'name' => $row[1],
                    'alias' => convertNameWithoutAccents($row[1]),
                    'categoryId' => $row[2],
                    'status' => 1,
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ];
            }

            // Save data to database using Eloquent
            CategoriesSub::insert($dataToSave);

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
                'Error' => 'Lỗi: ' .$e->getMessage(),
            ]);
        }
    }

    public function deleteAll(Request $request)
    {
        $selectedData = $request->input('dataId');
        // DB::table('product_types')->whereIn('categoryId', $selectedData)->delete();
        $deletedRowCount = DB::table('categories_subs')->whereIn('categorySubId', $selectedData)->delete();

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
