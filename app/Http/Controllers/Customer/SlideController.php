<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SlideController extends Controller
{
    public function index()
    {
        $posts = DB::table('slides')->get();
        return $posts;
    }

    public function info()
    {
        $posts = DB::table('info')->get();
        return $posts;
    }
}
