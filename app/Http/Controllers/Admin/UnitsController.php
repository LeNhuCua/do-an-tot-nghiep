<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

use App\Models\Unit;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Illuminate\Support\Facades\Validator;

class UnitsController extends Controller
{




    public function index()
    {
        $posts = Unit::orderBy("created_at", "desc")->get();

        return $posts;
        // return Category::select('unitId', 'alias', 'name', 'status')->get();
    }

    public function store(Request $request)
    {

        $messages = [
            'required' => 'Trường :attribute phải nhập',
            'unique' => 'Trường :attribute đã tồn tại'
        ];

        $validator = Validator::make($request->all(), [
            'unitId' => 'required|unique:units',
            'name' => 'required|unique:units',
        ], $messages);

        if ($validator->fails()) {
            return response()->json([

                'validation_error' => $validator->errors(),
                'message' => 'Kiểm tra lại thông tin',
            ]);
        } else {
            $unit =  Unit::create([
                'unitId' => $request->unitId,
                'name' => $request->name,
            ]);
            return response()->json([
                'status' => 400,
                'message' => 'Tạo thành công ',
                'unit' => $unit

            ]);
        }
    }
    // function show(unit $unit) {
    //      $response = [
    //         'unit' => $unit
    //     ];
    //     return $response;

    //     // header('Content-Type: application/json');

    // }

    public function show($id)
    {
        $unit = Unit::findOrFail($id);

        return response()->json([
            'unit' => $unit
        ]);
    }
    public function update(Request $request, $unitId)
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

                $category = Unit::findOrFail($unitId);
                // $category->updateMadm($request->produ$unitId);
                // $category->categoryId = $request->categoryId;
                // $category->name = $request->name;
                // $category->alias = $request->alias;
                // $category->save();

                $category->update($request->all());

                // $loaiSanPhams = unit::where('categoryId', $category->categoryId)->get();
                // foreach ($loaiSanPhams as $loaiSanPham) {
                //     $loaiSanPham->categoryId = $request->categoryId;
                //     $loaiSanPham->save();
                // }

                // unit::where('categoryId', $categoryId)->update(['categoryId' => $request->categoryId]);

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


    public function destroy(unit $category)
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

                $dataToSave[] = [
                    'unitId' => $row[0],
                    'name' => $row[1],
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ];
            }

            // Save data to database using Eloquent
            Unit::insert($dataToSave);

            // Return response to frontend
            return response()->json([
                'status' => 200,
                'message' => 'Thành công',
            ]);
        } catch (\Exception $e) {
            // Handle errors
            return response()->json([
                'status' => 422,
                'message' => "Vui lòng điền đủ các trường excel như mẫu. Không được trùng tên và mã",
                'Error' => 'Lỗi: ' . $e->getMessage(),
            ]);
        }
    }

    public function deleteAll(Request $request)
    {
        try {
            $selectedData = $request->input('dataId');

            DB::table('units')->whereIn('unitId', $selectedData)->delete();

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
