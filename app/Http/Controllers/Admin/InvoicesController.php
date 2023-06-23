<?php

namespace App\Http\Controllers\Admin;


use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Invoice;
use App\Models\InvoiceDetail;
use App\Models\Product;
use App\Models\ProductSize;
use App\Models\ProductType;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Illuminate\Support\Facades\Validator;

class InvoicesController extends Controller
{
    public function index()
    {
        $posts = Invoice::orderBy("created_at", "desc")->get();

        return $posts;
        // return Category::select('categoryId', 'alias', 'name', 'status')->get();
    }
    // public function index1()
    // {
    //     $categories = Category::with('subcategory')->get();;

    //     return $categories;
    //     // return Category::select('categoryId', 'alias', 'name', 'status')->get();
    // }
    public function store(Request $request)
    {
        $messages = [
            'required' => 'Trường :attribute phải nhập 1',
            'unique' => 'Trường :attribute đã tồn tại'

        ];
        $validator = Validator::make($request->all(), [
            // 'invoiceId' => 'required|unique:invoices',
            'fullName' => 'required',
            'phoneNumber' => 'required',
            'totalAmount' => 'required',
            'userId' => 'required',
        ], $messages);
        if ($validator->fails()) {
            return response()->json([
                'validation_error' => $validator->errors(),
                'message' => 'Kiểm tra lại thông tin',

            ]);
        } else {
            $days_now = Carbon::today();
            $dateObj = $days_now->toDateString();

            $lastProductId = Invoice::selectRaw('SUBSTRING(invoiceId, -5) AS invoiceId')
                ->whereDate('created_at', $days_now)
                ->orderBy('invoiceId', 'desc')
                ->value('invoiceId');
            if ($lastProductId) {
                $newProductIdNumber = substr($lastProductId, -0) + 1;
            }
            if ($lastProductId == null) {
                $newProductId = $dateObj . 'HD00001';
            } else {

                $newProductId = $dateObj . 'HD' . str_pad($newProductIdNumber, 5, '0', STR_PAD_LEFT);
            }
            $invoice = new Invoice;
            $invoice->invoiceId  = $newProductId;
            $invoice->fullName  = $request->fullName;
            $invoice->phoneNumber  = $request->phoneNumber;
            $invoice->totalAmount  = $request->totalAmount;
            $invoice->userId  = $request->userId;
            $invoice->save();
            $invoiceDetails = collect();
            if ($request->invoices) {

                foreach ($request->invoices as $row) {
                    foreach ($row as $value) {
                        $invoiceItemObject = json_decode($value);

                        $product = Product::find($invoiceItemObject->productId);
                        $product->numberBuy += $invoiceItemObject->amount;
                        $product->save();
                        $productSize = ProductSize::where('sizeId', '=', $invoiceItemObject->sizeId)->where('productId' , '=', $invoiceItemObject->productId)->first();
                        $productSize->number -= $invoiceItemObject->amount;
                        $productSize->save();





                        $invoiceDetail = new InvoiceDetail;
                        $lastInvoiceDetailId = InvoiceDetail::selectRaw('SUBSTRING(invoiceDetailId, -5) AS invoiceDetailId')
                            ->whereDate('created_at', $days_now)
                            ->orderBy('invoiceDetailId', 'desc')
                            ->value('invoiceDetailId');
                        if ($lastInvoiceDetailId) {
                            $newInvoiceDetailIdNumber = substr($lastInvoiceDetailId, -0) + 1;
                        }
                        if ($lastInvoiceDetailId == null) {
                            $newInvoiceDetailId = $dateObj . 'CTHD00001';
                        } else {

                            $newInvoiceDetailId = $dateObj . 'CTHD' . str_pad($newInvoiceDetailIdNumber, 5, '0', STR_PAD_LEFT);
                        }
                        $invoiceDetail->invoiceDetailId = $newInvoiceDetailId;
                        $invoiceDetail->number = $invoiceItemObject->amount;
                        $invoiceDetail->productId = $invoiceItemObject->productId;
                        $invoiceDetail->price = $invoiceItemObject->sizePrice;
                        $invoiceDetail->sizeValue = $invoiceItemObject->sizeValue;
                        $invoiceDetail->invoiceId = $invoice->invoiceId;


                        $invoiceDetail->save();
                        $invoiceDetails->push($invoiceItemObject);
                    }
                }
            }
            // if ($request->bills) {

            //     foreach ($request->bills as $value) {

            //         $invoiceItemObject = json_decode($value);

            //         $product = Product::find($invoiceItemObject->productId);
            //         $product->number -= $invoiceItemObject->amount;
            //         $product->numberBuy += $invoiceItemObject->amount;
            //         $product->save();

            //         $invoiceDetail = new InvoiceDetail;
            //         $invoiceDetail->number = $invoiceItemObject->amount;
            //         $invoiceDetail->productId = $invoiceItemObject->productId;
            //         $invoiceDetail->price = $invoiceItemObject->price;
            //         $invoiceDetail->invoiceId = $invoice->invoiceId;
            //         $invoiceDetail->sizeId = $invoiceItemObject->sizeId;

            //         $invoiceDetail->save();
            //         $invoiceDetails->push($invoiceItemObject);
            //     }
            // }


            return response()->json([
                'status' => 400,
                'message' => 'Product Created Successfully!!',
                'product' => $invoice,
                'invoiceDetails' => $invoiceDetails,
                'productSize', $productSize
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
                    'categoryId' => $row[0],
                    'alias' => $row[1],
                    'name' => $row[2],
                    'status' => 1,
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ];
            }

            // Save data to database using Eloquent
            Category::insert($dataToSave);

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
