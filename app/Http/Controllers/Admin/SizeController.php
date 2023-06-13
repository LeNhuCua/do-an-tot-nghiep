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
        // return Category::select('sizeId', 'alias', 'name', 'status')->get();
    }

    public function store(Request $request)
    {

        $messages = [
            'required' => 'Trường :attribute phải nhập',
            'unique' => 'Trường :attribute đã tồn tại'

        ];
        $validator = Validator::make($request->all(), [
            'sizeValue' => 'required|unique:sizes',
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


    public function update(Request $request, $sizeId)
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
                $alreadyExistName = Size::where('sizeValue','=', $request->name)->first();
                if($alreadyExistName) {
                    return response()->json([
                        'status' => 201,
                        'message' => 'Giá trị kích thước đã tồn tại!!',
                        ' $alreadyExistName '=> $alreadyExistName 
                    ]);
                }else {
                    $size = Size::findOrFail($sizeId);
                    $size->sizeValue = $request->name;
                    $size->save();
                    return response()->json([
                        'status' => 400,
                        'message' => 'Product Updated Successfully!!',
                        
                    ]);
                }


              
            } catch (\Exception $e) {
                return response()->json([
                    'message' => 'Gặp lỗi khi cập nhật!!',
                    'eee' => 'Lỗi: ' . $e->getMessage(),
                    'status' => 201,

                ]);
            }
        }
    }


    public function importExcel(Request $request)
    {

        try {
            $file = $request->file('file');
            $reader = IOFactory::createReaderForFile($file->getPathname());
            $spreadsheet = $reader->load($file->getPathname());
            $worksheet = $spreadsheet->getSheet(0);
            $rows = $worksheet->toArray();

            // Process and validate the data

            $lastSizeId = Size::selectRaw('SUBSTRING(sizeId, -5) AS sizeId')
                ->orderBy('sizeId', 'desc')
                ->value('sizeId');

            if ($lastSizeId) {
                $newSizeIdNumber = substr($lastSizeId, -0) + 1;
            }

            foreach ($rows as $index => $row) {
                if ($index === 0) { // Skip header row
                    continue;
                }
                $newSizeId =  'SIZE' . str_pad($newSizeIdNumber, 5, '0', STR_PAD_LEFT);
                $size = Size::where('sizeValue', $row[0])->first();
                if ($size) { // Nếu đã tồn tại thì báo lỗi
                    return response()->json([
                        'status' => 422,
                        'message' => 'Giá trị size là ' . $row[0] . ' tại dòng thứ ' . $index . ' đã tồn tại. Vui lòng nhập tên khác',
                    ]);
                    break;
                } else {
                    $product = new Size;
                    $product->sizeId =  $newSizeId;
                    $product->sizeValue = $row[0];
                    $product->created_at =  Carbon::now();
                    $product->updated_at = Carbon::now();
                    $product->save();
                    $newSizeIdNumber++;
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

            DB::table('sizes')->whereIn('sizeId', $selectedData)->delete();

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
