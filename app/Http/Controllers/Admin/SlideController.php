<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Slide;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Normalizer;


class SlideController extends Controller
{
    public function index()
    {
        $posts = DB::table('slides')->get();
        return $posts;
    }
    public function store(Request $request)
    {

        $messages = [
            'required' => 'Trường :attribute phải nhập',
            'unique' => 'Trường :attribute đã tồn tại'

        ];
        $validator = Validator::make($request->all(), [
            'image' => 'required',
        ], $messages);
        if ($validator->fails()) {
            return response()->json([
                'validation_error' => $validator->errors(),
                'message' => 'Kiểm tra lại thông tin',

            ]);
        } else {
            $lastSlideId = Slide::selectRaw('SUBSTRING(slideId, -5) AS slideId')
                ->orderBy('slideId', 'desc')
                ->value('slideId');
            if ($lastSlideId) {
                $newSlideIdNumber = substr($lastSlideId, -0) + 1;
            }

            if ($lastSlideId == null) {
                $newSlideId = 'SL00001';
            } else {
                $newSlideId = 'SL' . str_pad($newSlideIdNumber, 5, '0', STR_PAD_LEFT);
            }
            $slide = new Slide;
            $slide->slideId  = $newSlideId;
            $slide->status  = $request->status;
            if ($request->has('image')) {
                $imageName = Str::random() . '.' . $request->image->getClientOriginalExtension();
                $request->file('image')->storeAs('slide/image', $imageName, 'public');
                $slide->image = $imageName;
            }
            $slide->save();
            return response()->json([
                'status' => 400,
                'message' => 'Product Created Successfully!!',
                'slide' => $slide,
            ]);
        }
    }

    public function show($id)
    {
        $slide = Slide::findOrFail($id);

        return response()->json([
            'slide' => $slide
        ]);
    }


    public function deleteAll(Request $request)
    {
        try {
            $selectedData = $request->input('dataId');
            $product_image = DB::table('slides')->whereIn('slideId', $selectedData)->get();
            foreach ($product_image as $product_img) {
                // Delete product image from public folder
                if ($product_img->image && file_exists(('slide/image/' . $product_img->image))) {
                    $file_path = ('slide/image/' . $product_img->image);
                    unlink($file_path);
                }
            }


            DB::table('slides')->whereIn('slideId', $selectedData)->delete();

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
