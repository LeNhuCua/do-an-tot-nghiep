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
            ->select('products.name', 'products.avatar', DB::raw('SUM(invoice_details.number) as so_luong_ban'))
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
            ->orderBy('date')
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
    public function getTotalQuantityByMonth($month, $year)
    {
        return DB::table('invoices')
            ->join('invoice_details', 'invoices.invoiceId', '=', 'invoice_details.invoiceId')
            ->whereMonth('invoices.created_at', $month)
            ->whereYear('invoices.created_at', $year)
            ->sum('invoice_details.number');
    }

    public function detailByMonth($month, $year)
    {
        $orders = DB::table('invoices')
            ->join('invoice_details', 'invoices.invoiceId', '=', 'invoice_details.invoiceId')
            ->select('invoices.invoiceId', 'invoices.fullName', 'invoices.phoneNumber',  'invoice_details.sizeValue', DB::raw('sum(invoice_details.number) as total_quantity'), DB::raw('(invoices.totalAmount) as total_Amount'))
            ->whereMonth('invoices.created_at', $month)
            ->whereYear('invoices.created_at', $year)
            ->groupBy('invoices.invoiceId', 'invoices.created_at', 'invoice_details.invoiceDetailId')
            ->get();

        return $orders;
        // return Category::select('categoryId', 'alias', 'name', 'status')->get();
    }
    public function getBestSellProductByMonth($month, $year)
    {
        return DB::table('invoice_details')
            ->select('products.name', 'products.avatar', DB::raw('SUM(invoice_details.number) as so_luong_ban'))
            ->join('products', 'invoice_details.productId', '=', 'products.productId')
            ->join('invoices', 'invoice_details.invoiceId', '=', 'invoices.invoiceId')
            ->whereMonth('invoices.created_at', $month)
            ->whereYear('invoices.created_at', $year)
            ->groupBy('invoice_details.productId')
            ->orderBy('so_luong_ban', 'desc')
            ->take(3) // chỉ lấy sản phẩm có số lượng lớn nhất
            ->get();
    }



    public function getChartDataMonth($month, $year)
    {
        $_months_ago = Carbon::today()->subMonth()->month;

        $chartData = DB::table('invoices')
            ->select(DB::raw('MONTH(created_at) as month'), DB::raw('SUM(totalAmount) as total_sale'))
            ->whereBetween(DB::raw('MONTH(created_at)'), [$_months_ago, $month])
            ->whereYear('created_at', $year)
            ->groupBy(DB::raw('MONTH(created_at)'), DB::raw('YEAR(created_at)'))
            ->orderBy('month')
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
            'totalSalesByMonth' => $this->getTotalSalesByMonth($month, $year),
            'totalQuantityByMonth' => $this->getTotalQuantityByMonth($month, $year),
            'detailByMonth' => $this->detailByMonth($month, $year),
            'getBestSellProductByMonth' => $this->getBestSellProductByMonth($month, $year),
            'chartDataByMonth' => $this->getChartDataMonth($month, $year),
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


    public function detailYear($date)
    {
        $orders = DB::table('invoices')
            ->join('invoice_details', 'invoices.invoiceId', '=', 'invoice_details.invoiceId')
            ->select('invoices.invoiceId', 'invoices.fullName', 'invoices.phoneNumber', DB::raw('sum(invoice_details.number) as total_quantity'), DB::raw('(invoices.totalAmount) as total_Amount'))
            ->whereYear('invoices.created_at', $date)
            ->groupBy('invoices.invoiceId', 'invoices.created_at')
            ->get();

        return $orders;
        // return Category::select('categoryId', 'alias', 'name', 'status')->get();
    }

    public function getBestSellProductByYear($date)
    {
        return DB::table('invoice_details')
            ->select('products.name', 'products.avatar', DB::raw('SUM(invoice_details.number) as so_luong_ban'))
            ->join('products', 'invoice_details.productId', '=', 'products.productId')
            ->join('invoices', 'invoice_details.invoiceId', '=', 'invoices.invoiceId')
            ->whereYear('invoices.created_at', $date)
            ->groupBy('invoice_details.productId')
            ->orderBy('so_luong_ban', 'desc')
            ->take(3) // chỉ lấy sản phẩm có số lượng lớn nhất
            ->get();
    }


    public function getTotalQuantityByYear($date)
    {
        return DB::table('invoices')
            ->join('invoice_details', 'invoices.invoiceId', '=', 'invoice_details.invoiceId')
            ->whereYear('invoices.created_at', $date)
            ->sum('invoice_details.number');
    }

    public function getChartDataByYear($date)
    {
        $_months_ago = Carbon::today()->subYear()->year();
        $chartData = DB::table('invoices')
            ->select(DB::raw('Year(created_at) as year'), DB::raw('SUM(totalAmount) as total_sale'))
            ->whereBetween(DB::raw('Year(created_at)'), [$_months_ago, $date])
            ->whereYear('created_at', $date)
            ->groupBy(DB::raw('Year(created_at)'), DB::raw('Year(created_at)'))
            ->orderBy('year')
            ->get();

        $labels = $chartData->pluck('year');
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
                    '_months_ago' => $_months_ago
                ],
            ],
        ];
    }
    public function getSalesDataByYear(Request $request)
    {
        $date = $request->input('date');
        $salesData = [
            'totalSales' => $this->getTotalSalesByYear($date),
            'totalQuantity' => $this->getTotalQuantityByYear($date),
            'detail' => $this->detailYear($date),
            'getBestSellProductByYear' => $this->getBestSellProductByYear($date),
            'chartData' => $this->getChartDataByYear($date),
        ];
        return response()->json($salesData);
    }
}
