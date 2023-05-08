<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatisticalController extends Controller
{

    // thống kê theo ngày


    public function getTotalSalesByDay($date)
    {
        return DB::table('invoices')
            ->whereDate('created_at', $date)
            ->sum('totalAmount');
    }

    public function detailDay($date)
    {
        $orders = DB::table('invoices')
            ->join('invoice_details', 'invoices.invoiceId', '=', 'invoice_details.invoiceId')
            ->select('invoices.invoiceId', 'invoices.fullName', 'invoices.phoneNumber', DB::raw('sum(invoice_details.number) as total_quantity'), DB::raw('(invoices.totalAmount) as total_Amount'))
            ->whereDate('invoices.created_at', $date)
            ->groupBy('invoices.invoiceId', 'invoices.created_at')
            ->get();

        return $orders;
        // return Category::select('categoryId', 'alias', 'name', 'status')->get();
    }

    public function getBestSellProductByDay($date)
    {
        return DB::table('invoice_details')
            ->select('products.name','products.avatar', DB::raw('max(invoice_details.number) as so_luong_ban'))
            ->join('products', 'invoice_details.productId', '=', 'products.productId')
            ->join('invoices', 'invoice_details.invoiceId', '=', 'invoices.invoiceId')
            ->whereDate('invoices.created_at', $date)
            ->groupBy('invoice_details.productId')
            ->orderBy('so_luong_ban', 'desc')
            ->take(3) // chỉ lấy sản phẩm có số lượng lớn nhất
            ->get();
    }


    public function getTotalQuantityByDay($date)
    {
        return DB::table('invoices')
            ->join('invoice_details', 'invoices.invoiceId', '=', 'invoice_details.invoiceId')
            ->whereDate('invoices.created_at', $date)
            ->sum('invoice_details.number');
    }

    public function getChartData($date)
    {
        $date_7days_ago = Carbon::today()->subWeek();
        $dateObj = Carbon::createFromFormat('Y-m-d', $date);


        $chartData = DB::table('invoices')

            ->select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(totalAmount) as total_sale'))
            ->whereBetween('created_at', [$date_7days_ago, $dateObj])
            ->groupBy(DB::raw('DATE(created_at)'))
            ->get();

        $labels = $chartData->pluck('date');
        $data = $chartData->pluck('total_sale');

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Doanh thu',
                    'backgroundColor' => 'rgb(30,144,255)',
                    'borderColor' => 'rgb(70,130,180)',
                    'borderWidth' => 1,
                    'hoverBackgroundColor' => 'rgb(70,130,180)',
                    'hoverBorderColor' => 'rgb(30,144,255)',
                    'data' => $data,
                ],
            ],
        ];
    }
    public function getSalesDataByDay(Request $request)
    {
        $date = $request->input('date');
        $salesData = [
            'totalSales' => $this->getTotalSalesByDay($date),
            'totalQuantity' => $this->getTotalQuantityByDay($date),
            'detail' => $this->detailDay($date),
            'getBestSellProductByDay' => $this->getBestSellProductByDay($date),
            'chartData' => $this->getChartData($date),
        ];
        return response()->json($salesData);
    }



    // thống kê theo tháng


    public function getTotalSalesByMonth($month, $year)
    {
        return DB::table('invoices')
            ->select(DB::raw('MONTH(created_at) as month'), DB::raw('SUM(totalAmount) as total_sales'))
            ->whereMonth('created_at', $month)
            ->whereYear('created_at', $year)
            ->groupBy('month')
            ->first();
    }

    public function detailByMonth($month, $year)
    {
        $orders = DB::table('invoices')
            ->join('invoice_details', 'invoices.invoiceId', '=', 'invoice_details.invoiceId')
            ->select('invoices.invoiceId', 'invoices.fullName', 'invoices.phoneNumber', DB::raw('sum(invoice_details.number) as total_quantity'), DB::raw('(invoices.totalAmount) as total_Amount'))
            ->whereMonth('invoices.created_at', $month)
            ->whereYear('invoices.created_at', $year)
            ->groupBy('invoices.invoiceId', 'invoices.created_at')
            ->get();

        return $orders;
        // return Category::select('categoryId', 'alias', 'name', 'status')->get();
    }
    public function getBestSellProductByMonth($month, $year)
    {
        return DB::table('invoice_details')
            ->select('products.name', DB::raw('max(invoice_details.number) as so_luong_ban'))
            ->join('products', 'invoice_details.productId', '=', 'products.productId')
            ->join('invoices', 'invoice_details.invoiceId', '=', 'invoices.invoiceId')
            ->whereMonth('invoices.created_at', $month)
            ->whereYear('invoices.created_at', $year)
            ->groupBy('invoice_details.productId')
            ->orderBy('so_luong_ban', 'desc')
            ->take(3) // chỉ lấy sản phẩm có số lượng lớn nhất
            ->get();
    }


    public function getTotalQuantityByMonth($month, $year)
    {
        return DB::table('invoices')
            ->join('invoice_details', 'invoices.invoiceId', '=', 'invoice_details.invoiceId')
            ->whereMonth('invoices.created_at', $month)
            ->whereYear('invoices.created_at', $year)
            ->sum('invoice_details.number');
    }

    public function getChartDataMonth($month, $year)
    {
        $_months_ago = Carbon::today()->subMonth()->month;

        $chartData = DB::table('invoices')
            ->select(DB::raw('MONTH(created_at) as month'), DB::raw('SUM(totalAmount) as total_sale'))
            ->whereBetween(DB::raw('MONTH(created_at)'), [$_months_ago, $month])
            ->whereYear('created_at', $year)
            ->groupBy(DB::raw('MONTH(created_at)'), DB::raw('YEAR(created_at)'))
            ->get();

        $labels = $chartData->pluck('month');
        $data = $chartData->pluck('total_sale');

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Doanh thu',
                    'backgroundColor' => 'rgb(30,144,255)',
                    'borderColor' => 'rgb(70,130,180)',
                    'borderWidth' => 1,
                    'hoverBackgroundColor' => 'rgb(70,130,180)',
                    'hoverBorderColor' => 'rgb(30,144,255)',
                    'data' => $data,
                ],
            ],
        ];
    }

    public function getSalesDataByMonth(Request $request)
    {
        $month = $request->input('month');
        $year = $request->input('year');
        $salesData = [
            'totalSales' => $this->getTotalSalesByMonth($month, $year),
            'totalQuantity' => $this->getTotalQuantityByMonth($month, $year),
            'detail' => $this->detailByMonth($month, $year),
            'getBestSellProductByMonth' => $this->getBestSellProductByMonth($month, $year),
            'chartData' => $this->getChartDataMonth($month, $year),
        ];
        return response()->json($salesData);
    }



    //theo năm
    public function getTotalSalesByYear($year)
    {
        return DB::table('invoices')
            ->select(DB::raw('YEAR(created_at) as year'), DB::raw('SUM(totalAmount) as total_sales'))
            ->whereYear('created_at', $year)
            ->groupBy('year')
            ->first();
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
            $lastEmployee = Invoice::orderBy('invoiceId', 'desc')->first();
            if ($lastEmployee == null) {
                $newInvoiceId = 'HD00001';
            } else {
                $newInvoiceIdNumber = substr($lastEmployee->invoiceId, 2) + 1;
                $newInvoiceId = 'HD' . str_pad($newInvoiceIdNumber, 5, '0', STR_PAD_LEFT);
            }
            $invoice = new Invoice;
            $invoice->invoiceId  = $newInvoiceId;
            $invoice->fullName  = $request->fullName;
            $invoice->phoneNumber  = $request->phoneNumber;
            $invoice->totalAmount  = $request->totalAmount;
            $invoice->userId  = $request->userId;

            // if ($request->has('avatar')) {
            //     $imageName = Str::random() . '.' . $request->avatar->getClientOriginalExtension();
            //     $request->file('avatar')->storeAs('invoice/image', $imageName, 'public');
            //     $invoice->avatar = $imageName;
            // }
            $invoice->save();

            // $invoiceDetail = null;
            $aa = gettype($request->invoices);
            $invoiceDetails = collect();
            if ($request->invoices) {
                // check if $request->invoices is an array
                foreach ($request->invoices as $row) {
                    foreach ($row as $value) {
                        $invoiceItemObject = json_decode($value);
                        $invoiceDetail = new InvoiceDetail;
                        $invoiceDetail->number = $invoiceItemObject->amount;
                        $invoiceDetail->productId = $invoiceItemObject->productId;
                        $invoiceDetail->price = $invoiceItemObject->price;
                        $invoiceDetail->invoiceId = $invoice->invoiceId;

                        $invoiceDetail->save();
                        $invoiceDetails->push($invoiceItemObject);
                    }
                }

                // foreach ($request->invoices as $invoiceItem) {
                //     // $invoices = json_decode(json_encode($invoiceItem), true);
                //     $invoiceItemObject = json_decode($invoiceItem);

                //     $invoiceDetail = new InvoiceDetail;
                //     $invoiceDetail->number = $invoiceItemObject->amount;
                //     $invoiceDetail->productId = $invoiceItemObject->productId;
                //     $invoiceDetail->price = $invoiceItemObject->price;
                //     $invoiceDetail->invoiceId = $invoice->invoiceId;

                //     $invoiceDetail->save();
                //     $invoiceDetails->push($invoiceItemObject);
                // }
            }



            return response()->json([
                'status' => 400,
                'message' => 'Product Created Successfully!!',
                'product' => $invoice,
                'invoiceDetails' => $invoiceDetails,
                '$aa' =>  $aa

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
