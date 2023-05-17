<?php

namespace App\Http\Controllers\Admin;

use Carbon\Carbon;
use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\Customer;
use App\Models\Size;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use PhpOffice\PhpSpreadsheet\IOFactory;


class SizeController extends Controller
{




    public function index()
    {
        $posts = Size::orderBy("created_at", "desc")->get();

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
            'sizeValue' => 'required',
        ], $messages);
        if ($validator->fails()) {
            return response()->json([
                'validation_error' => $validator->errors(),
                'message' => 'Kiểm tra lại thông tin',

            ]);
        } else {
            $lastSizeId = Size::selectRaw('SUBSTRING(sizeId, -5) AS sizeId')
                ->orderBy('sizeId', 'desc')
                ->value('sizeId');
            if ($lastSizeId) {
                $newSizeIdNumber = substr($lastSizeId, -0) + 1;
            }
            if ($lastSizeId == null) {
                $newSizeId = 'SIZE00001';
            } else {
                $newSizeId = 'SIZE' . str_pad($newSizeIdNumber, 5, '0', STR_PAD_LEFT);
            }
            $size = new Size;
            $size->sizeId  = $newSizeId;
            $size->sizeValue  = $request->sizeValue;

            $size->save();
            return response()->json([
                'status' => 400,
                'message' => 'Product Created Successfully!!',
                'size' => $size,
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
        $size = Size::findOrFail($id);

        return response()->json([
            'size' => $size
        ]);
    }



    public function destroy(Size $category)
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
            Size::insert($dataToSave);

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
