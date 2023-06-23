<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatisticalOnlineController extends Controller
{

    // thống kê theo ngày


    public function getTotalSalesByDay($date)
    {
        return DB::table('orders')
            ->whereDate('created_at', $date)
            ->where('orderStatusId','=' , 'TT005')
            ->sum('totalAmount');
    }

    public function detailDay($date)
    {
        $orders = DB::table('orders')
            ->join('order_details', 'orders.orderId', '=', 'order_details.orderId')
            ->join('users', 'orders.userId', '=', 'users.userId')
            ->select('orders.orderId', 'users.fullName', DB::raw('sum(order_details.quantity) as total_quantity'), DB::raw('(orders.totalAmount) as total_Amount'))
            ->whereDate('orders.created_at', $date)
            ->where('orderStatusId','=' , 'TT005')
            ->groupBy('orders.orderId', 'orders.created_at')
            ->get();

        return $orders;
        // return Category::select('categoryId', 'alias', 'name', 'status')->get();
    }

    public function getBestSellProductByDay($date)
    {
        return DB::table('order_details')
            ->select('products.name', 'products.avatar', DB::raw('SUM(order_details.quantity) as so_luong_ban'))
            ->join('products', 'order_details.productId', '=', 'products.productId')
            ->join('orders', 'order_details.orderId', '=', 'orders.orderId')
            ->whereDate('orders.created_at', $date)
            ->where('orders.orderStatusId','=' , 'TT005')
            ->groupBy('order_details.productId')
            ->orderBy('so_luong_ban', 'desc')
            ->take(3) // chỉ lấy sản phẩm có số lượng lớn nhất
            ->get();
    }


    public function getTotalQuantityByDay($date)
    {
        return DB::table('orders')
            ->join('order_details', 'orders.orderId', '=', 'order_details.orderId')
            ->whereDate('orders.created_at', $date)
            ->where('orderStatusId','=' , 'TT005')
            ->sum('order_details.quantity');
    }

    public function getChartData($date)
    {
        $date_7days_ago = Carbon::today()->subWeek();
        $dateObj = Carbon::createFromFormat('Y-m-d', $date);


        $chartData = DB::table('orders')

            ->select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(totalAmount) as total_sale'))
            ->whereBetween('created_at', [$date_7days_ago, $dateObj])
            ->where('orderStatusId','=' , 'TT005')
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
        return DB::table('orders')
            ->select(DB::raw('MONTH(created_at) as month'), DB::raw('SUM(totalAmount) as total_sales'))
            ->whereMonth('created_at', $month)
            ->whereYear('created_at', $year)
            ->where('orderStatusId', '=', 'TT005')
            ->groupBy('month')
            ->first();
    }
    public function getTotalQuantityByMonth($month, $year)
    {
        return DB::table('orders')
            ->join('order_details', 'orders.orderId', '=', 'order_details.orderId')
            ->whereMonth('orders.created_at', $month)
            ->whereYear('orders.created_at', $year)
            ->where('orderStatusId','=' , 'TT005')
            ->sum('order_details.quantity');
    }

    public function detailByMonth($month, $year)
    {
        $orders = DB::table('orders')
            ->join('order_details', 'orders.orderId', '=', 'order_details.orderId')
            ->select('orders.orderId', 'orders.userId',  'order_details.sizeValue', DB::raw('sum(order_details.quantity) as total_quantity'), DB::raw('(orders.totalAmount) as total_Amount'))
            ->whereMonth('orders.created_at', $month)
            ->whereYear('orders.created_at', $year)
            ->where('orderStatusId','=' , 'TT005')
            ->groupBy('orders.orderId', 'orders.created_at', 'order_details.orderDetailId')
            ->get();

        return $orders;
        // return Category::select('categoryId', 'alias', 'name', 'status')->get();
    }
    public function getBestSellProductByMonth($month, $year)
    {
        return DB::table('order_details')
            ->select('products.name', 'products.avatar', DB::raw('SUM(order_details.quantity) as so_luong_ban'))
            ->join('products', 'order_details.productId', '=', 'products.productId')
            ->join('orders', 'order_details.orderId', '=', 'orders.orderId')
            ->whereMonth('orders.created_at', $month)
            ->whereYear('orders.created_at', $year)
            ->where('orders.orderStatusId','=' , 'TT005')
            ->groupBy('order_details.productId')
            ->orderBy('so_luong_ban', 'desc')
            ->take(3) // chỉ lấy sản phẩm có số lượng lớn nhất
            ->get();
    }



    public function getChartDataMonth($month, $year)
    {
        $_months_ago = Carbon::today()->subMonth()->month;

        $chartData = DB::table('orders')
            ->select(DB::raw('MONTH(created_at) as month'), DB::raw('SUM(totalAmount) as total_sale'))
            ->whereBetween(DB::raw('MONTH(created_at)'), [$_months_ago, $month])
            ->whereYear('created_at', $year)
            ->where('orderStatusId','=' , 'TT005')
            
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
        return DB::table('orders')
            ->select(DB::raw('YEAR(created_at) as year'), DB::raw('SUM(totalAmount) as total_sales'))
            ->whereYear('created_at', $year)
            ->where('orderStatusId','=' , 'TT005')

            ->groupBy('year')
            ->first();
    }


    public function detailYear($date)
    {
        $orders = DB::table('orders')
            ->join('order_details', 'orders.orderId', '=', 'order_details.orderId')
            ->select('orders.orderId', 'orders.userId', DB::raw('sum(order_details.quantity) as total_quantity'), DB::raw('(orders.totalAmount) as total_Amount'))
            ->whereYear('orders.created_at', $date)
            ->where('orderStatusId','=' , 'TT005')

            ->groupBy('orders.orderId', 'orders.created_at')
            ->get();

        return $orders;
        // return Category::select('categoryId', 'alias', 'name', 'status')->get();
    }

    public function getBestSellProductByYear($date)
    {
        return DB::table('order_details')
            ->select('products.name', 'products.avatar', DB::raw('SUM(order_details.quantity) as so_luong_ban'))
            ->join('products', 'order_details.productId', '=', 'products.productId')
            ->join('orders', 'order_details.orderId', '=', 'orders.orderId')
            ->whereYear('orders.created_at', $date)
            ->where('orders.orderStatusId','=' , 'TT005')

            ->groupBy('order_details.productId')
            ->orderBy('so_luong_ban', 'desc')
            ->take(3) // chỉ lấy sản phẩm có số lượng lớn nhất
            ->get();
    }


    public function getTotalQuantityByYear($date)
    {
        return DB::table('orders')
            ->join('order_details', 'orders.orderId', '=', 'order_details.orderId')
            ->whereYear('orders.created_at', $date)
            ->where('orderStatusId','=' , 'TT005')

            ->sum('order_details.quantity');
    }

    public function getChartDataByYear($date)
    {
        $_months_ago = Carbon::today()->subYear()->year();
        $chartData = DB::table('orders')
            ->select(DB::raw('Year(created_at) as year'), DB::raw('SUM(totalAmount) as total_sale'))
            ->whereBetween(DB::raw('Year(created_at)'), [$_months_ago, $date])
            ->whereYear('created_at', $date)
            ->where('orderStatusId','=' , 'TT005')

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
